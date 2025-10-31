from typing import Dict, Any, List, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Path to your Firebase credentials JSON
FIREBASE_CRED_PATH = "backend/firebase_credentials.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred)
db = firestore.client()

class ArchiveService:
    def __init__(self):
        self.collection = db.collection("analyses")

    async def save_analysis(self, analysis_data: Dict[str, Any]) -> bool:
        try:
            analysis_id = analysis_data.get("id", f"analysis_{int(datetime.now().timestamp())}")
            doc_ref = self.collection.document(analysis_id)
            data = {
                **analysis_data,
                "id": analysis_id,
                "created_at": analysis_data.get("created_at", datetime.now().isoformat()),
                "updated_at": datetime.now().isoformat()
            }
            doc_ref.set(data)
            return True
        except Exception as e:
            print(f"Error saving analysis to Firestore: {str(e)}")
            return False

    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        try:
            doc = self.collection.document(analysis_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"Error getting analysis by id from Firestore: {str(e)}")
            return None

    async def get_analyses(self, filters: Dict[str, Any], limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        try:
            query = self.collection
            # Filtering (basic demo, can be expanded)
            if "verdict" in filters and filters["verdict"]:
                query = query.where("verdict", "==", filters["verdict"])
            if "analysis_type" in filters and filters["analysis_type"]:
                query = query.where("analysis_type", "==", filters["analysis_type"])
            # Fetch all docs (Firestore doesn't support offset efficiently)
            docs = query.stream()
            analyses = [doc.to_dict() for doc in docs]
            # Search and risk_level filtering in Python
            if "search" in filters and filters["search"]:
                analyses = [a for a in analyses if filters["search"].lower() in a.get("ai_analysis", "").lower()]
            if "risk_level" in filters and filters["risk_level"]:
                def risk_bucket(score):
                    if score >= 80: return "high"
                    if score >= 60: return "medium"
                    return "low"
                analyses = [a for a in analyses if risk_bucket(a.get("risk_score", 0)) == filters["risk_level"]]
            # Sort and paginate
            analyses.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            return analyses[offset:offset+limit]
        except Exception as e:
            print(f"Error getting analyses from Firestore: {str(e)}")
            return []
