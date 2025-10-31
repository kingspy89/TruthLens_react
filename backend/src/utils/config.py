from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    # Google Cloud APIs
    google_application_credentials: Optional[str] = None
    gemini_api_key: Optional[str] = None
    fact_check_api_key: Optional[str] = None
    
    # Database
    firestore_project_id: Optional[str] = None
    
    # Email
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    # Firebase and API keys (added to match .env and avoid extra fields error)
    firebase_api_key: Optional[str] = None
    firebase_auth_domain: Optional[str] = None
    firebase_project_id: Optional[str] = None
    firebase_storage_bucket: Optional[str] = None
    firebase_messaging_sender_id: Optional[str] = None
    firebase_app_id: Optional[str] = None
    firebase_measurement_id: Optional[str] = None
    google_api_key: Optional[str] = None
    newsapi_key: Optional[str] = None
    newsdata_api_key: Optional[str] = None
    google_cloud_project: Optional[str] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # Admin
    admin_email: str = "admin@truthlens.com"
    
    class Config:
        env_file = ".env"

def get_settings():
    return Settings()
