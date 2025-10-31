from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class AnalysisRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    analysis_type: str = "text"
    language: str = "en"
    include_sources: bool = True
    include_reporting: bool = True

class AnalysisResponse(BaseModel):
    id: str
    verdict: str
    risk_score: int
    confidence: float
    ai_analysis: str
    manipulation_tactics: List[str]
    fact_checks: List[str]
    source_links: List[Dict[str, str]]
    reporting_emails: List[Dict[str, str]]
    created_at: str
    analysis_time: float

class ReportRequest(BaseModel):
    content_id: str
    content_type: str
    report_type: str
    priority: str = "medium"
    reporter_name: Optional[str] = None
    reporter_email: Optional[str] = None
    additional_info: Optional[str] = None
    evidence: Optional[List[str]] = None

class ReportResponse(BaseModel):
    report_id: str
    status: str
    created_at: str
    estimated_resolution: str
