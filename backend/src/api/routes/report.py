from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid


from database.report_service import ReportService
from utils.email_service import EmailService

router = APIRouter()

class ReportRequest(BaseModel):
    content_id: str
    content_type: str
    report_type: str
    priority: str = "medium"
    reporter_name: Optional[str] = None
    reporter_email: Optional[EmailStr] = None
    additional_info: Optional[str] = None
    evidence: Optional[List[str]] = None

class ReportResponse(BaseModel):
    report_id: str
    status: str
    created_at: str
    estimated_resolution: str

class ReportStatus(BaseModel):
    report_id: str
    status: str
    priority: str
    created_at: str
    updated_at: str
    resolution: Optional[str] = None
    assigned_to: Optional[str] = None

email_service = EmailService()

@router.post("/report", response_model=ReportResponse)
async def submit_report(
    request: ReportRequest,
    report_service: ReportService = Depends(),
):
    """
    Submit a new report for false information
    """
    try:
        # Generate report ID
        report_id = f"report_{int(datetime.now().timestamp())}_{str(uuid.uuid4())[:8]}"
        
        # Create report data
        report_data = {
            "report_id": report_id,
            "content_id": request.content_id,
            "content_type": request.content_type,
            "report_type": request.report_type,
            "priority": request.priority,
            "reporter_name": request.reporter_name,
            "reporter_email": request.reporter_email,
            "additional_info": request.additional_info,
            "evidence": request.evidence or [],
            "status": "submitted",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # Save report
        success = await report_service.create_report(report_data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to create report")
        
        # Send notification email
        try:
            await email_service.send_report_notification(report_data)
        except Exception as e:
            print(f"Failed to send notification email: {str(e)}")
        
        # Calculate estimated resolution time
        resolution_times = {
            "low": "3-5 business days",
            "medium": "1-3 business days", 
            "high": "24-48 hours",
            "critical": "12-24 hours"
        }
        estimated_resolution = resolution_times.get(request.priority, "3-5 business days")
        
        return ReportResponse(
            report_id=report_id,
            status="submitted",
            created_at=report_data["created_at"],
            estimated_resolution=estimated_resolution
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit report: {str(e)}")

@router.get("/report/{report_id}", response_model=ReportStatus)
async def get_report_status(
    report_id: str,
    report_service: ReportService = Depends()
):
    """
    Get report status by ID
    """
    try:
        report = await report_service.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return ReportStatus(**report)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get report: {str(e)}")

@router.get("/reports")
async def list_reports(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    report_service: ReportService = Depends()
):
    """
    List reports with optional filtering
    """
    try:
        filters = {}
        if status:
            filters["status"] = status
        if priority:
            filters["priority"] = priority
        
        reports = await report_service.list_reports(filters, limit, offset)
        total = await report_service.count_reports(filters)
        
        return {
            "reports": reports,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list reports: {str(e)}")

@router.put("/report/{report_id}/status")
async def update_report_status(
    report_id: str,
    status: str,
    resolution: Optional[str] = None,
    assigned_to: Optional[str] = None,
    report_service: ReportService = Depends()
):
    """
    Update report status
    """
    try:
        update_data = {
            "status": status,
            "updated_at": datetime.now().isoformat()
        }
        
        if resolution:
            update_data["resolution"] = resolution
        if assigned_to:
            update_data["assigned_to"] = assigned_to
        
        success = await report_service.update_report(report_id, update_data)
        if not success:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"message": "Report status updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update report: {str(e)}")

@router.delete("/report/{report_id}")
async def delete_report(
    report_id: str,
    report_service: ReportService = Depends()
):
    """
    Delete a report
    """
    try:
        success = await report_service.delete_report(report_id)
        if not success:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"message": "Report deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete report: {str(e)}")

@router.get("/report/stats")
async def get_report_stats(
    report_service: ReportService = Depends()
):
    """
    Get report statistics
    """
    try:
        stats = await report_service.get_statistics()
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get report stats: {str(e)}")

@router.post("/report/{report_id}/escalate")
async def escalate_report(
    report_id: str,
    reason: str,
    report_service: ReportService = Depends()
):
    """
    Escalate a report to higher priority
    """
    try:
        # Get current report
        report = await report_service.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Determine new priority
        current_priority = report.get("priority", "medium")
        priority_levels = ["low", "medium", "high", "critical"]
        current_index = priority_levels.index(current_priority)
        
        if current_index < len(priority_levels) - 1:
            new_priority = priority_levels[current_index + 1]
        else:
            new_priority = current_priority
        
        # Update report
        update_data = {
            "priority": new_priority,
            "status": "escalated",
            "updated_at": datetime.now().isoformat(),
            "escalation_reason": reason
        }
        
        success = await report_service.update_report(report_id, update_data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to escalate report")
        
        return {
            "message": "Report escalated successfully",
            "new_priority": new_priority
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to escalate report: {str(e)}")

@router.post("/report/{report_id}/assign")
async def assign_report(
    report_id: str,
    assigned_to: str,
    report_service: ReportService = Depends()
):
    """
    Assign report to a specific user
    """
    try:
        update_data = {
            "assigned_to": assigned_to,
            "status": "assigned",
            "updated_at": datetime.now().isoformat()
        }
        
        success = await report_service.update_report(report_id, update_data)
        if not success:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"message": "Report assigned successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to assign report: {str(e)}")
