from fastapi import APIRouter
from pydantic import BaseModel
import re

from backend.config import GEMINI_API_KEY
from google import genai
from backend.services.rag_engine import load_json


def retrieve_chat_records(question: str) -> list[dict]:
    """Find relevant records in the local PLANORA knowledge base."""
    stop_words = {
        "what", "where", "when", "which", "who", "how", "are", "is", "the",
        "a", "an", "for", "in", "on", "to", "of", "and", "or", "can", "do",
        "i", "we", "you", "available", "options", "please"
    }
    words = {
        word for word in re.findall(r"[a-z0-9]+", question.lower())
        if len(word) > 2 and word not in stop_words
    }
    records = []

    for filename, category in (
        ("venues.json", "venue"),
        ("vendors.json", "vendor"),
        ("catering.json", "catering"),
        ("decorations.json", "decoration"),
        ("photography.json", "photography")
    ):
        for item in load_json(filename):
            searchable = " ".join(str(value) for value in item.values()).lower()
            searchable_words = set(re.findall(r"[a-z0-9]+", searchable))
            score = sum(1 for word in words if word in searchable_words)
            if score:
                records.append((score, category, item))

    return [item for _, _, item in sorted(records, key=lambda record: record[0], reverse=True)[:3]]


def format_chat_records(records: list[dict]) -> str:
    """Format retrieved records into a concise chatbot response."""
    lines = ["I found these matching options in the PLANORA data:"]
    for item in records:
        name = item.get("name", "Unnamed option")
        details = []
        for key in ("city", "capacity", "estimated_price", "price_per_person", "facilities", "services"):
            if key in item:
                value = item[key]
                label = key.replace("_", " ").title()
                if key == "estimated_price":
                    value = f"INR {value:,}"
                if key == "price_per_person":
                    value = f"INR {value}/person"
                if isinstance(value, list):
                    value = ", ".join(str(entry) for entry in value)
                details.append(f"{label}: {value}")
        lines.append(f"- {name} ({'; '.join(details)}).")
    lines.append("Please confirm availability and the final quote before booking.")
    return "\n".join(lines)


def fallback_reply(question: str) -> str:
    """Return useful local guidance when the AI service is unavailable."""
    question_lower = question.lower()

    if any(word in question_lower for word in ("book", "booking", "reserve", "reservation")):
        return "To book a service, open your event plan, choose Venue, Catering, Decoration, or Photography, select Request quote, and submit your name and phone number. An admin can review the request from the Admin dashboard."
    if any(word in question_lower for word in ("budget", "cost", "price", "save", "cheap", "expensive")):
        return "For a balanced budget, start with 25% for the venue, 30% for catering, 15% for decoration, 10% for photography, 10% for transport and entertainment, and keep 10% as an emergency buffer. Compare at least three vendor quotes before booking."
    if any(word in question_lower for word in ("venue", "hall", "location", "capacity")):
        return "Choose a venue that fits your guest count with room for food service, stage setup, and guest movement. Confirm date availability, parking, power backup, catering rules, cleaning charges, cancellation terms, and the complete final quote before paying."
    if any(word in question_lower for word in ("food", "catering", "caterer", "menu", "meal")):
        return "For catering, confirm the per-person price, vegetarian and non-vegetarian counts, drinks, desserts, service staff, buffet setup, tasting date, taxes, and the deadline for changing the final guest count."
    if any(word in question_lower for word in ("decor", "decoration", "flower", "light", "theme")):
        return "Choose one clear decoration theme and ask for a written package covering flowers, backdrop, stage, lighting, setup time, removal, and replacement costs. Seasonal local flowers and reusable lighting usually reduce the cost."
    if any(word in question_lower for word in ("photo", "photography", "video", "camera")):
        return "When booking photography, confirm coverage hours, number of photographers, edited photos, video delivery, drone permissions, delivery date, backup equipment, and overtime charges."
    if any(word in question_lower for word in ("checklist", "task", "plan", "prepare")):
        return "Start by booking the venue and key vendors. Then finalize the guest list and menu, send invitations, confirm decorations and transport, and reconfirm every supplier one week before the event."
    if any(word in question_lower for word in ("time", "schedule", "timeline", "when")):
        return "A simple event timeline is: vendor setup first, guest arrival next, ceremony or main program, meal service, photos and activities, then venue cleanup. Keep at least 30 minutes of buffer for delays."

    return "Tell me what you need help with: booking, budget, venue, catering, decoration, photography, checklist, or event schedule. I will give you guidance for that topic."

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatMessage(BaseModel):
    message: str


@router.post("/")
def chat(message: ChatMessage):
    user_message = message.message.strip()

    if not user_message:
        return {
            "user_message": message.message,
            "response": "Please type a question about your event, budget, venue, or vendors."
        }

    if GEMINI_API_KEY:
        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            records = retrieve_chat_records(user_message)
            context = format_chat_records(records) if records else "No matching local records were found."

            for model_name in ("gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"):
                try:
                    result = client.models.generate_content(
                        model=model_name,
                        contents=(
                            "You are PLANORA, a concise and helpful event planning assistant. "
                            "Answer the user's question with practical event-planning advice. "
                            "Use the retrieved records when relevant. Do not invent vendors or prices. "
                            "Keep the answer under 120 words.\n\n"
                            f"Retrieved PLANORA records:\n{context}\n\n"
                            f"User question: {user_message}"
                        )
                    )
                    text = getattr(result, "text", None)
                    if text:
                        return {"user_message": message.message, "response": text}
                except Exception:
                    continue
        except Exception:
            pass

    records = retrieve_chat_records(user_message)
    response = format_chat_records(records) if records else fallback_reply(user_message)

    return {
        "user_message": message.message,
        "response": response
    }