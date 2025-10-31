from typing import Dict, Any
import hashlib
import json
from datetime import datetime

def generate_analysis_id() -> str:
    """Generate unique analysis ID"""
    timestamp = int(datetime.now().timestamp())
    return f"analysis_{timestamp}"

def generate_report_id() -> str:
    """Generate unique report ID"""
    timestamp = int(datetime.now().timestamp())
    return f"report_{timestamp}"

def hash_content(content: str) -> str:
    """Generate hash for content deduplication"""
    return hashlib.md5(content.encode()).hexdigest()

def format_timestamp(timestamp: datetime) -> str:
    """Format timestamp for API responses"""
    return timestamp.isoformat()

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_text(text: str) -> str:
    """Sanitize text input"""
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = " ".join(text.split())
    
    # Limit length
    if len(text) > 10000:
        text = text[:10000] + "..."
    
    return text

def calculate_risk_score(verdict: str, confidence: float, tactics_count: int) -> int:
    """Calculate risk score based on analysis factors"""
    base_scores = {
        "FALSE INFORMATION": 85,
        "MISLEADING": 65,
        "UNVERIFIED": 40,
        "TRUE": 15,
        "ERROR": 0
    }
    
    base_score = base_scores.get(verdict, 40)
    
    # Adjust based on confidence
    if confidence > 0.8:
        base_score += 10
    elif confidence < 0.5:
        base_score -= 10
    
    # Adjust based on tactics count
    base_score += min(tactics_count * 5, 20)
    
    return max(0, min(100, base_score))
