from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import List, Optional
import aiofiles
import os
from datetime import datetime
import uuid
from pydantic import BaseModel

from analysis_engine.image_forensics import ImageForensics
from analysis_engine.comprehensive_analysis import ComprehensiveAnalyzer

router = APIRouter()

# Allowed file types
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
ALLOWED_DOCUMENT_TYPES = ["application/pdf", "text/plain", "application/msword"]

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    file_type: str
    file_size: int
    upload_time: str
    analysis_ready: bool

@router.post("/upload/image", response_model=UploadResponse)
async def upload_image(
    image: UploadFile = File(...),
    analyzer: ComprehensiveAnalyzer = Depends()
):
    """
    Upload and analyze an image file
    """
    try:
        # Validate file type
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {image.content_type} not allowed. Allowed types: {ALLOWED_IMAGE_TYPES}"
            )
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_extension = image.filename.split('.')[-1] if '.' in image.filename else 'jpg'
        filename = f"{file_id}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await image.read()
            await f.write(content)
        
        # Get file size
        file_size = len(content)
        
        # Prepare analysis data
        analysis_data = {
            "type": "image",
            "file_path": file_path,
            "filename": image.filename,
            "content_type": image.content_type
        }
        
        # Run analysis
        try:
            result = await analyzer.analyze(analysis_data)
            analysis_ready = True
        except Exception as e:
            print(f"Analysis failed for {filename}: {str(e)}")
            analysis_ready = False
        
        return UploadResponse(
            file_id=file_id,
            filename=image.filename,
            file_type=image.content_type,
            file_size=file_size,
            upload_time=datetime.now().isoformat(),
            analysis_ready=analysis_ready
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/upload/document", response_model=UploadResponse)
async def upload_document(
    document: UploadFile = File(...),
    analyzer: ComprehensiveAnalyzer = Depends()
):
    """
    Upload and analyze a document file
    """
    try:
        # Validate file type
        if document.content_type not in ALLOWED_DOCUMENT_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {document.content_type} not allowed. Allowed types: {ALLOWED_DOCUMENT_TYPES}"
            )
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_extension = document.filename.split('.')[-1] if '.' in document.filename else 'txt'
        filename = f"{file_id}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await document.read()
            await f.write(content)
        
        # Get file size
        file_size = len(content)
        
        # Prepare analysis data
        analysis_data = {
            "type": "document",
            "file_path": file_path,
            "filename": document.filename,
            "content_type": document.content_type
        }
        
        # Run analysis
        try:
            result = await analyzer.analyze(analysis_data)
            analysis_ready = True
        except Exception as e:
            print(f"Analysis failed for {filename}: {str(e)}")
            analysis_ready = False
        
        return UploadResponse(
            file_id=file_id,
            filename=document.filename,
            file_type=document.content_type,
            file_size=file_size,
            upload_time=datetime.now().isoformat(),
            analysis_ready=analysis_ready
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/upload/batch")
async def upload_batch(
    files: List[UploadFile] = File(...),
    analyzer: ComprehensiveAnalyzer = Depends()
):
    """
    Upload multiple files for batch analysis
    """
    try:
        results = []
        
        for file in files:
            try:
                # Determine file type and route accordingly
                if file.content_type in ALLOWED_IMAGE_TYPES:
                    result = await upload_image(file, analyzer)
                elif file.content_type in ALLOWED_DOCUMENT_TYPES:
                    result = await upload_document(file, analyzer)
                else:
                    result = {
                        "error": f"File type {file.content_type} not supported",
                        "filename": file.filename
                    }
                
                results.append(result)
                
            except Exception as e:
                results.append({
                    "error": str(e),
                    "filename": file.filename
                })
        
        return {
            "message": f"Processed {len(files)} files",
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch upload failed: {str(e)}")

@router.get("/upload/{file_id}")
async def get_upload_status(file_id: str):
    """
    Get upload status and analysis results
    """
    try:
        # Check if file exists
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.*")
        import glob
        matching_files = glob.glob(file_path)
        
        if not matching_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        actual_file_path = matching_files[0]
        filename = os.path.basename(actual_file_path)
        
        # Get file stats
        stat = os.stat(actual_file_path)
        
        return {
            "file_id": file_id,
            "filename": filename,
            "file_size": stat.st_size,
            "upload_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
            "status": "uploaded"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get upload status: {str(e)}")

@router.delete("/upload/{file_id}")
async def delete_upload(file_id: str):
    """
    Delete uploaded file
    """
    try:
        # Find and delete file
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.*")
        import glob
        matching_files = glob.glob(file_path)
        
        if not matching_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        for file_path in matching_files:
            os.remove(file_path)
        
        return {"message": "File deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

@router.get("/upload/list")
async def list_uploads():
    """
    List all uploaded files
    """
    try:
        files = []
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            stat = os.stat(file_path)
            
            files.append({
                "filename": filename,
                "file_size": stat.st_size,
                "upload_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "file_type": "image" if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')) else "document"
            })
        
        return {
            "files": files,
            "total": len(files)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list uploads: {str(e)}")
