def calculate_budget(total_budget: float, guests: int):
    """
    Creates a simple estimated event budget.
    """

    budget = {
        "venue": total_budget * 0.25,
        "catering": total_budget * 0.30,
        "decoration": total_budget * 0.15,
        "photography": total_budget * 0.10,
        "entertainment": total_budget * 0.08,
        "transportation": total_budget * 0.05,
        "miscellaneous": total_budget * 0.07
    }

    return {
        "total_budget": total_budget,
        "guests": guests,
        "breakdown": {
            key: round(value, 2)
            for key, value in budget.items()
        }
    }