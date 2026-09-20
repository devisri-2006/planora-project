from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.rag_engine import retrieve_event_information
from backend.services.gemini_service import generate_event_plan
from backend.services.budget_service import calculate_budget

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AIEventRequest(BaseModel):
    event_type: str
    location: str
    guests: int
    budget: float
    requirements: str = ""


@router.post("/generate-plan")
def generate_plan(event: AIEventRequest):

    # 1. Retrieve information from PLANORA knowledge base
    context = retrieve_event_information(
        event_type=event.event_type,
        location=event.location,
        guests=event.guests,
        budget=event.budget
    )

    # 2. Calculate estimated budget
    budget_data = calculate_budget(
        total_budget=event.budget,
        guests=event.guests
    )

    # 3. Send information to Gemini
    user_details = {
        "event_type": event.event_type,
        "location": event.location,
        "guests": event.guests,
        "budget": event.budget,
        "requirements": event.requirements
    }

    ai_result = generate_event_plan(
        user_details=user_details,
        retrieved_context=context
    )

    return {
        "event_details": user_details,
        "budget": budget_data,
        "ai_plan": ai_result
    }