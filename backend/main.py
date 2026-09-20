from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.event_routes import router as event_router
from backend.routes.ai_routes import router as ai_router
from backend.routes.chat_routes import router as chat_router


app = FastAPI(
    title="PLANORA API",
    description="AI-Powered Event Management and Planning Assistant",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(event_router)
app.include_router(ai_router)
app.include_router(chat_router)


@app.get("/")
def home():

    return {
        "project": "PLANORA",
        "message": "AI-Powered Event Management Assistant",
        "status": "Backend is running successfully"
    }