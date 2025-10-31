import os
import requests
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

url = "https://generativelanguage.googleapis.com/v1beta/models"
params = {"key": GEMINI_API_KEY}
response = requests.get(url, params=params)
print("Available Gemini models:")
print(response.json())
