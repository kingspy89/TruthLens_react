from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta
import json
from pydantic import BaseModel

from database.archive_service import ArchiveService

router = APIRouter()

class ArchiveResponse(BaseModel):
    id: str
    title: str
    content: str
    verdict: str
    risk_score: int
    confidence: float
    analysis_type: str
    created_at: str
    updated_at: str

class ArchiveStats(BaseModel):
    total_analyses: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    false_information_count: int
    misleading_count: int
    true_count: int
    unverified_count: int
    average_risk_score: float
    analysis_types: dict

@router.get("/archive", response_model=List[ArchiveResponse])
async def get_archived_analyses(
    search: Optional[str] = Query(None, description="Search term for content"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (low, medium, high)"),
    verdict: Optional[str] = Query(None, description="Filter by verdict"),
    analysis_type: Optional[str] = Query(None, description="Filter by analysis type"),
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(50, description="Number of results to return"),
    offset: int = Query(0, description="Number of results to skip"),
    archive_service: ArchiveService = Depends()
):
    """
    Get archived analyses with filtering and pagination
    """
    try:
        # Build filters
        filters = {}
        if search:
            filters["search"] = search
        if risk_level:
            filters["risk_level"] = risk_level
        if verdict:
            filters["verdict"] = verdict
        if analysis_type:
            filters["analysis_type"] = analysis_type
        if date_from:
            filters["date_from"] = date_from
        if date_to:
            filters["date_to"] = date_to
        
        # Get analyses
        analyses = await archive_service.get_analyses(filters, limit, offset)
        
        # Convert to response format
        response = []
        for analysis in analyses:
            response.append(ArchiveResponse(
                id=analysis.get("id", ""),
                title=analysis.get("title", "Untitled Analysis"),
                content=analysis.get("content", ""),
                verdict=analysis.get("verdict", "UNVERIFIED"),
                risk_score=analysis.get("risk_score", 0),
                confidence=analysis.get("confidence", 0.0),
                analysis_type=analysis.get("analysis_type", "text"),
                created_at=analysis.get("created_at", ""),
                updated_at=analysis.get("updated_at", "")
            ))
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get archived analyses: {str(e)}")

@router.get("/archive/{analysis_id}", response_model=ArchiveResponse)
async def get_analysis_by_id(
    analysis_id: str,
    archive_service: ArchiveService = Depends()
):
    """
    Get specific analysis by ID
    """
    try:
        analysis = await archive_service.get_analysis_by_id(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return ArchiveResponse(
            id=analysis.get("id", ""),
            title=analysis.get("title", "Untitled Analysis"),
            content=analysis.get("content", ""),
            verdict=analysis.get("verdict", "UNVERIFIED"),
            risk_score=analysis.get("risk_score", 0),
            confidence=analysis.get("confidence", 0.0),
            analysis_type=analysis.get("analysis_type", "text"),
            created_at=analysis.get("created_at", ""),
            updated_at=analysis.get("updated_at", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analysis: {str(e)}")

@router.get("/archive/stats", response_model=ArchiveStats)
async def get_archive_stats(
    time_range: str = Query("7d", description="Time range for stats (1d, 7d, 30d, 90d, 1y)"),
    archive_service: ArchiveService = Depends()
):
    """
    Get archive statistics
    """
    try:
        stats = await archive_service.get_statistics(time_range)
        
        return ArchiveStats(
            total_analyses=stats.get("total_analyses", 0),
            high_risk_count=stats.get("high_risk_count", 0),
            medium_risk_count=stats.get("medium_risk_count", 0),
            low_risk_count=stats.get("low_risk_count", 0),
            false_information_count=stats.get("false_information_count", 0),
            misleading_count=stats.get("misleading_count", 0),
            true_count=stats.get("true_count", 0),
            unverified_count=stats.get("unverified_count", 0),
            average_risk_score=stats.get("average_risk_score", 0.0),
            analysis_types=stats.get("analysis_types", {})
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get archive stats: {str(e)}")

@router.get("/archive/export")
async def export_archive(
    format: str = Query("json", description="Export format (json, csv, xlsx)"),
    filters: Optional[str] = Query(None, description="JSON string of filters"),
    archive_service: ArchiveService = Depends()
):
    """
    Export archived analyses
    """
    try:
        # Parse filters if provided
        filter_dict = {}
        if filters:
            try:
                filter_dict = json.loads(filters)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid filters format")
        
        # Get all analyses matching filters
        analyses = await archive_service.get_analyses(filter_dict, limit=10000, offset=0)
        
        if format == "json":
            return {"analyses": analyses}
        elif format == "csv":
            # Convert to CSV format
            import csv
            import io
            
            output = io.StringIO()
            if analyses:
                writer = csv.DictWriter(output, fieldnames=analyses[0].keys())
                writer.writeheader()
                writer.writerows(analyses)
            
            return {"csv_data": output.getvalue()}
        else:
            raise HTTPException(status_code=400, detail="Unsupported export format")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export archive: {str(e)}")

@router.delete("/archive/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    archive_service: ArchiveService = Depends()
):
    """
    Delete analysis from archive
    """
    try:
        success = await archive_service.delete_analysis(analysis_id)
        if not success:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {"message": "Analysis deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete analysis: {str(e)}")

@router.put("/archive/{analysis_id}")
async def update_analysis(
    analysis_id: str,
    title: Optional[str] = None,
    tags: Optional[List[str]] = None,
    notes: Optional[str] = None,
    archive_service: ArchiveService = Depends()
):
    """
    Update analysis metadata
    """
    try:
        update_data = {
            "updated_at": datetime.now().isoformat()
        }
        
        if title is not None:
            update_data["title"] = title
        if tags is not None:
            update_data["tags"] = tags
        if notes is not None:
            update_data["notes"] = notes
        
        success = await archive_service.update_analysis(analysis_id, update_data)
        if not success:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {"message": "Analysis updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update analysis: {str(e)}")

@router.get("/archive/search/suggestions")
async def get_search_suggestions(
    query: str = Query(..., description="Search query"),
    limit: int = Query(10, description="Number of suggestions"),
    archive_service: ArchiveService = Depends()
):
    """
    Get search suggestions based on query
    """
    try:
        suggestions = await archive_service.get_search_suggestions(query, limit)
        return {"suggestions": suggestions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get suggestions: {str(e)}")

@router.get("/archive/trends")
async def get_analysis_trends(
    time_range: str = Query("30d", description="Time range for trends"),
    granularity: str = Query("day", description="Data granularity (hour, day, week)"),
    archive_service: ArchiveService = Depends()
):
    """
    Get analysis trends over time
    """
    try:
        trends = await archive_service.get_trends(time_range, granularity)
        return trends
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trends: {str(e)}")
