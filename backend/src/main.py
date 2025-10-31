from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from api.routes import fact_check, upload, report, archive
from api.middleware.cors import setup_cors
from api.middleware.auth import get_current_user
from analysis_engine.comprehensive_analysis import ComprehensiveAnalyzer
from database.archive_service import ArchiveService
from database.report_service import ReportService
from utils.config import get_settings

# Load environment variables
load_dotenv()

# Global services
analyzer = None
archive_service = None
report_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global analyzer, archive_service, report_service
    
    # Startup
    print("🚀 Starting TruthLens API...")
    
    # Initialize services
    analyzer = ComprehensiveAnalyzer()
    archive_service = ArchiveService()
    report_service = ReportService()
    
    print("✅ Services initialized")
    yield
    
    # Shutdown
    print("🛑 Shutting down TruthLens API...")

# Create FastAPI app
app = FastAPI(
    title="TruthLens API",
    description="AI-Powered Misinformation Detection System",
    version="2.0.0",
    lifespan=lifespan
)

# Setup CORS
setup_cors(app)

# Include routers
app.include_router(fact_check.router, prefix="/api", tags=["analysis"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(report.router, prefix="/api", tags=["reports"])
app.include_router(archive.router, prefix="/api", tags=["archive"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "TruthLens API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "analyzer": analyzer is not None,
            "archive": archive_service is not None,
            "reports": report_service is not None
        }
    }

@app.get("/api/dashboard")
async def get_dashboard_data(time_range: str = "7d"):
    """Get dashboard analytics data"""
    try:
        if not archive_service:
            raise HTTPException(status_code=503, detail="Archive service not available")
        
        data = await archive_service.get_dashboard_metrics(time_range)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dependency injection
def get_analyzer():
    if not analyzer:
        raise HTTPException(status_code=503, detail="Analyzer not available")
    return analyzer

def get_archive_service():
    if not archive_service:
        raise HTTPException(status_code=503, detail="Archive service not available")
    return archive_service

def get_report_service():
    if not report_service:
        raise HTTPException(status_code=503, detail="Report service not available")
    return report_service

if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
