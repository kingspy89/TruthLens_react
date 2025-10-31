from typing import Dict, Any
import asyncio
import re

class TacticsAnalyzer:
    """
    Psychological manipulation tactics detection
    """
    
    def __init__(self):
        self.tactics_patterns = {
            "emotional_language": [
                r"\b(urgent|emergency|crisis|danger|threat|fear|panic)\b",
                r"\b(amazing|incredible|shocking|outrageous|unbelievable)\b"
            ],
            "false_urgency": [
                r"\b(act now|limited time|don't wait|immediately|right now)\b",
                r"\b(breaking|urgent|emergency|alert)\b"
            ],
            "conspiracy_theory": [
                r"\b(conspiracy|cover-up|hidden truth|they don't want you to know)\b",
                r"\b(establishment|mainstream media|big pharma|government)\b"
            ],
            "cherry_picking": [
                r"\b(studies show|research proves|scientists say)\b",
                r"\b(according to|data reveals|evidence shows)\b"
            ]
        }
    
    async def analyze(self, text: str, language: str = "en") -> Dict[str, Any]:
        """Analyze text for manipulation tactics"""
        try:
            tactics_found = []
            text_lower = text.lower()
            
            for tactic_name, patterns in self.tactics_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, text_lower):
                        tactics_found.append(tactic_name.replace("_", " ").title())
                        break
            
            return {
                "tactics": tactics_found,
                "tactic_count": len(tactics_found),
                "manipulation_score": len(tactics_found) / len(self.tactics_patterns)
            }
            
        except Exception as e:
            return {"tactics": [], "error": str(e)}
