import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

APP_NAME = "PLANORA"
APP_VERSION = "1.0.0"