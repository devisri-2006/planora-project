import json
import os


DATA_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data"
)


def load_json(filename):
    """
    Loads a JSON file from the PLANORA data folder.
    """

    file_path = os.path.join(DATA_FOLDER, filename)

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)

    except FileNotFoundError:
        return []


def retrieve_event_information(
    event_type: str,
    location: str,
    guests: int,
    budget: float
):
    """
    Simple RAG retrieval layer.

    It searches the PLANORA knowledge base
    for information matching the user's requirements.
    """

    events = load_json("events.json")
    venues = load_json("venues.json")
    vendors = load_json("vendors.json")
    catering = load_json("catering.json")
    decorations = load_json("decorations.json")
    photography = load_json("photography.json")

    event_results = []

    # Event information
    for event in events:
        if event.get("event_type", "").lower() == event_type.lower():
            event_results.append(event)

    # Venue information
    venue_results = []

    for venue in venues:
        city_match = venue.get("city", "").lower() == location.lower()
        event_match = event_type in venue.get("suitable_for", [])

        if city_match and event_match:
            if venue.get("capacity", 0) >= guests:
                venue_results.append(venue)

    # Vendor information
    vendor_results = []

    for vendor in vendors:
        city_match = vendor.get("city", "").lower() == location.lower()
        event_match = event_type in vendor.get("suitable_for", [])

        if city_match and event_match:
            vendor_results.append(vendor)

    # Catering information
    catering_results = []

    for item in catering:
        if item.get("city", "").lower() == location.lower():
            catering_results.append(item)

    # Decoration information
    decoration_results = []

    for item in decorations:
        if (
            item.get("city", "").lower() == location.lower()
            and event_type in item.get("suitable_for", [])
        ):
            decoration_results.append(item)

    # Photography information
    photography_results = []

    for item in photography:
        if (
            item.get("city", "").lower() == location.lower()
            and event_type in item.get("suitable_for", [])
        ):
            photography_results.append(item)

    context = {
        "event_information": event_results,
        "venues": venue_results,
        "vendors": vendor_results,
        "catering": catering_results,
        "decorations": decoration_results,
        "photography": photography_results,
        "user_requirements": {
            "event_type": event_type,
            "location": location,
            "guests": guests,
            "budget": budget
        }
    }

    return json.dumps(context, indent=2)