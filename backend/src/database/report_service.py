from typing import Dict, Any, List, Optional
import asyncio
from datetime import datetime

class ReportService:
    """
    Report service for managing user reports
    """
    
    def __init__(self):
        # In a real implementation, this would connect to Firestore
        self.reports = {}
        self.stats = {
            "total_reports": 0,
            "submitted": 0,
            "under_review": 0,
            "resolved": 0,
            "rejected": 0
        }
    
    async def create_report(self, report_data: Dict[str, Any]) -> bool:
        """Create a new report"""
        try:
            report_id = report_data.get("report_id", f"report_{int(datetime.now().timestamp())}")
            self.reports[report_id] = {
                **report_data,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Update stats
            self.stats["total_reports"] += 1
            self.stats["submitted"] += 1
            
            return True
            
        except Exception as e:
            print(f"Error creating report: {str(e)}")
            return False
    
    async def get_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        """Get report by ID"""
        return self.reports.get(report_id)
    
    async def list_reports(self, filters: Dict[str, Any], limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """List reports with filtering"""
        try:
            filtered_reports = []
            
            for report in self.reports.values():
                if self._matches_filters(report, filters):
                    filtered_reports.append(report)
            
            # Sort by created_at descending
            filtered_reports.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            
            # Apply pagination
            return filtered_reports[offset:offset + limit]
            
        except Exception as e:
            print(f"Error listing reports: {str(e)}")
            return []
    
    async def update_report(self, report_id: str, update_data: Dict[str, Any]) -> bool:
        """Update report"""
        try:
            if report_id in self.reports:
                self.reports[report_id].update(update_data)
                self.reports[report_id]["updated_at"] = datetime.now().isoformat()
                return True
            return False
        except Exception as e:
            print(f"Error updating report: {str(e)}")
            return False
    
    async def delete_report(self, report_id: str) -> bool:
        """Delete report"""
        try:
            if report_id in self.reports:
                del self.reports[report_id]
                return True
            return False
        except Exception as e:
            print(f"Error deleting report: {str(e)}")
            return False
    
    async def count_reports(self, filters: Dict[str, Any]) -> int:
        """Count reports matching filters"""
        try:
            count = 0
            for report in self.reports.values():
                if self._matches_filters(report, filters):
                    count += 1
            return count
        except Exception as e:
            print(f"Error counting reports: {str(e)}")
            return 0
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get report statistics"""
        return self.stats.copy()
    
    def _matches_filters(self, report: Dict[str, Any], filters: Dict[str, Any]) -> bool:
        """Check if report matches filters"""
        try:
            # Status filter
            if "status" in filters and filters["status"]:
                if report.get("status") != filters["status"]:
                    return False
            
            # Priority filter
            if "priority" in filters and filters["priority"]:
                if report.get("priority") != filters["priority"]:
                    return False
            
            return True
            
        except Exception:
            return False
