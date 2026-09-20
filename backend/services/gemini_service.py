from google import genai

from backend.config import GEMINI_API_KEY


def generate_event_plan(user_details: dict, retrieved_context: str):
    """
    Sends event details and RAG context to Google Gemini.
    """

    if not GEMINI_API_KEY:
        return {
            "error": "GEMINI_API_KEY is not configured."
        }

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"""
You are PLANORA, an AI-powered event management assistant.

Create a practical event plan using the user's requirements
and the retrieved information.

USER REQUIREMENTS:
{user_details}

RETRIEVED INFORMATION:
{retrieved_context}

Provide:

1. Event Overview
2. Budget Suggestions
3. Venue Suggestions
4. Vendor Suggestions
5. Catering Suggestions
6. Decoration Suggestions
7. Event Checklist
8. Event Schedule
9. Cost-Saving Suggestions

IMPORTANT:
- Use retrieved information when available.
- Do not invent real-world businesses or prices.
- If information is unavailable, clearly say that it is unavailable.
- Clearly distinguish sample data from verified information.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
    except Exception as error:
        budget = user_details.get("budget", 0)
        guests = user_details.get("guests", 0)
        event_type = user_details.get("event_type", "event")
        location = user_details.get("location", "your city")
        return {
            "response": (
                f"PLANORA Event Plan: {event_type}\n"
                f"Location: {location}\n"
                f"Guests: {guests}\n"
                f"Budget: INR {budget:,.0f}\n\n"
                "1. Budget Allocation\n"
                f"- Venue: INR {budget * 0.25:,.0f}\n"
                f"- Catering: INR {budget * 0.30:,.0f}\n"
                f"- Decoration: INR {budget * 0.15:,.0f}\n"
                f"- Photography: INR {budget * 0.10:,.0f}\n"
                f"- Entertainment and transport: INR {budget * 0.10:,.0f}\n"
                f"- Emergency buffer: INR {budget * 0.10:,.0f}\n\n"
                "2. Planning Checklist\n"
                "- Confirm the venue capacity and availability.\n"
                "- Finalize the guest list and catering menu.\n"
                "- Compare at least three vendor quotations.\n"
                "- Confirm decoration, photography, and transport schedules.\n"
                "- Keep all bookings and payment receipts together.\n\n"
                "3. Suggested Schedule\n"
                "- 2-3 months before: book venue and key vendors.\n"
                "- 1 month before: finalize guests, menu, and decorations.\n"
                "- 1 week before: reconfirm every vendor and prepare payments.\n"
                "- Event day: complete setup before guests arrive and keep a 10% buffer."
            )
        }

    return {
        "response": response.text
    }