from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
import os

class ArchiveService:
    """
    Service for managing archived analyses
    """

    def __init__(self):
        # For now, use in-memory storage
        # In production, this would connect to a database
        self.analyses = []
        self._load_mock_data()

    def _load_mock_data(self):
        """Load some mock data for testing"""
        self.analyses = [
            {
                "id": "1",
                "title": "Sample Text Analysis",
                "content": "This is a sample text for analysis.",
                "verdict": "UNVERIFIED",
                "risk_score": 30,
                "confidence": 0.4,
                "analysis_type": "text",
                "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
                "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
                "userId": "sample_user_1"
            },
            {
                "id": "2",
                "title": "Image Analysis Report",
                "content": "Analysis of uploaded image content.",
                "verdict": "FALSE INFORMATION",
                "risk_score": 85,
                "confidence": 0.8,
                "analysis_type": "image",
                "created_at": (datetime.now() - timedelta(hours=5)).isoformat(),
                "updated_at": (datetime.now() - timedelta(hours=5)).isoformat(),
                "userId": "sample_user_1"
            },
            {
                "id": "3",
                "title": "URL Verification",
                "content": "Checking the authenticity of a news article URL.",
                "verdict": "TRUE INFORMATION",
                "risk_score": 10,
                "confidence": 0.9,
                "analysis_type": "url",
                "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
                "updated_at": (datetime.now() - timedelta(hours=2)).isoformat(),
                "userId": "sample_user_2"
            }
        ]

    async def get_analyses(self, filters: Dict[str, Any], limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Get analyses with filtering"""
        filtered_analyses = self.analyses.copy()

        # Apply filters
        if filters.get("search"):
            search_term = filters["search"].lower()
            filtered_analyses = [
                a for a in filtered_analyses
                if search_term in a.get("title", "").lower() or
                   search_term in a.get("content", "").lower()
            ]

        if filters.get("risk_level"):
            risk_level = filters["risk_level"]
            if risk_level == "high":
                filtered_analyses = [a for a in filtered_analyses if a.get("risk_score", 0) >= 80]
            elif risk_level == "medium":
                filtered_analyses = [a for a in filtered_analyses if 60 <= a.get("risk_score", 0) < 80]
            elif risk_level == "low":
                filtered_analyses = [a for a in filtered_analyses if a.get("risk_score", 0) < 60]

        if filters.get("verdict"):
            verdict = filters["verdict"]
            filtered_analyses = [a for a in filtered_analyses if a.get("verdict") == verdict]

        if filters.get("analysis_type"):
            analysis_type = filters["analysis_type"]
            filtered_analyses = [a for a in filtered_analyses if a.get("analysis_type") == analysis_type]

        # Apply pagination
        start = offset
        end = offset + limit
        return filtered_analyses[start:end]

    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """Get analysis by ID"""
        for analysis in self.analyses:
            if analysis["id"] == analysis_id:
                return analysis
        return None

    async def get_statistics(self, time_range: str = "7d") -> Dict[str, Any]:
        """Get archive statistics"""
        # Parse time range
        if time_range.endswith("d"):
            days = int(time_range[:-1])
        elif time_range.endswith("h"):
            days = int(time_range[:-1]) / 24
        else:
            days = 7

        cutoff_date = datetime.now() - timedelta(days=days)

        # Filter analyses by time range
        recent_analyses = [
            a for a in self.analyses
            if datetime.fromisoformat(a["created_at"]) >= cutoff_date
        ]

        total = len(recent_analyses)
        high_risk = len([a for a in recent_analyses if a.get("risk_score", 0) >= 80])
        medium_risk = len([a for a in recent_analyses if 60 <= a.get("risk_score", 0) < 80])
        low_risk = len([a for a in recent_analyses if a.get("risk_score", 0) < 60])

        false_info = len([a for a in recent_analyses if a.get("verdict") == "FALSE INFORMATION"])
        misleading = len([a for a in recent_analyses if a.get("verdict") == "MISLEADING"])
        true_info = len([a for a in recent_analyses if a.get("verdict") == "TRUE INFORMATION"])
        unverified = len([a for a in recent_analyses if a.get("verdict") == "UNVERIFIED"])

        avg_risk = sum(a.get("risk_score", 0) for a in recent_analyses) / total if total > 0 else 0

        analysis_types = {}
        for a in recent_analyses:
            atype = a.get("analysis_type", "unknown")
            analysis_types[atype] = analysis_types.get(atype, 0) + 1

        return {
            "total_analyses": total,
            "high_risk_count": high_risk,
            "medium_risk_count": medium_risk,
            "low_risk_count": low_risk,
            "false_information_count": false_info,
            "misleading_count": misleading,
            "true_count": true_info,
            "unverified_count": unverified,
            "average_risk_score": avg_risk,
            "analysis_types": analysis_types
        }

    async def delete_analysis(self, analysis_id: str) -> bool:
        """Delete analysis by ID"""
        for i, analysis in enumerate(self.analyses):
            if analysis["id"] == analysis_id:
                self.analyses.pop(i)
                return True
        return False

    async def update_analysis(self, analysis_id: str, update_data: Dict[str, Any]) -> bool:
        """Update analysis metadata"""
        for analysis in self.analyses:
            if analysis["id"] == analysis_id:
                analysis.update(update_data)
                return True
        return False

    async def get_search_suggestions(self, query: str, limit: int = 10) -> List[str]:
        """Get search suggestions"""
        suggestions = set()
        query_lower = query.lower()

        for analysis in self.analyses:
            title = analysis.get("title", "").lower()
            content = analysis.get("content", "").lower()

            if query_lower in title:
                suggestions.add(analysis["title"])
            if query_lower in content:
                # Add relevant words from content
                words = content.split()
                for word in words:
                    if query_lower in word.lower() and len(word) > 3:
                        suggestions.add(word)

        return list(suggestions)[:limit]

    async def get_trends(self, time_range: str = "30d", granularity: str = "day") -> Dict[str, Any]:
        """Get analysis trends over time"""
        # Simplified implementation
        return {
            "time_range": time_range,
            "granularity": granularity,
            "data_points": []
        }
