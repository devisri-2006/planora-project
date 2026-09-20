from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


class EventDetails(BaseModel):
    event_type: str
    location: str
    guests: int
    budget: float
    requirements: str = ""


@router.post("/plan")
def create_event_plan(event: EventDetails):

    return {
        "message": "Event details received successfully",
        "event": {
            "type": event.event_type,
            "location": event.location,
            "guests": event.guests,
            "budget": event.budget,
            "requirements": event.requirements
        }
    }