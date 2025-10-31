from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Response
from typing import Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import requests
import json
from analysis_engine.comprehensive_analysis import ComprehensiveAnalyzer

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def analyze_with_gemini(text):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    prompt = (
        f"""
        Analyze this text for misinformation. Provide three separate sections:

        1. Verdict section:
        - Classification: (TRUE, FALSE INFORMATION, MISLEADING, or UNVERIFIED)
        - Risk score (0-100)
        - Confidence score (0-100)

        2. Analysis section:
        - Brief, clear analysis (2-3 sentences max)
        - Key tactics used (if any)

        3. Evidence section:
        - Relevant fact-checking sources 
        - Related news articles
        - Official reporting channels

        Text to analyze: {text}

        Respond in this exact JSON format:
        {{
            "verdict": "string",
            "risk_score": number,
            "confidence": number,
            "ai_analysis": "string",
            "manipulation_tactics": ["string"],
            "fact_checks": [{{ "description": "string" }}],
            "source_links": [{{ "url": "string", "name": "string" }}],
            "reporting_emails": ["string"]
        }}
        """
    )
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    response = requests.post(url, headers=headers, params=params, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.text}


router = APIRouter()




# Only one endpoint: /analyze
@router.post("/analyze")
async def analyze_content(
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    analysis_type: str = Form("text"),
    language: str = Form("en"),
    include_sources: bool = Form(True),
    include_reporting: bool = Form(True),
    analyzer: ComprehensiveAnalyzer = Depends()
):
    """
    Analyze content for misinformation using AI-powered detection and return HTML for web section display
    """
    from database.archive_service import ArchiveService
    archive_service = ArchiveService()
    try:
        start_time = datetime.now()
        # Validate input
        if analysis_type == "text" and not text:
            raise HTTPException(status_code=400, detail="Text content is required for text analysis")
        elif analysis_type == "url" and not url:
            raise HTTPException(status_code=400, detail="URL is required for URL analysis")
        elif analysis_type == "image" and not image:
            raise HTTPException(status_code=400, detail="Image file is required for image analysis")

        # Prepare analysis data
        analysis_data = {
            "type": analysis_type,
            "language": language,
            "include_sources": include_sources,
            "include_reporting": include_reporting
        }
        if analysis_type == "text":
            analysis_data["content"] = text
        elif analysis_type == "url":
            analysis_data["content"] = url
        elif analysis_type == "image":
            analysis_data["file"] = image

        # If text analysis, use Gemini API
        if analysis_type == "text" and text:
            gemini_result = analyze_with_gemini(text)
            print("Gemini raw response:", gemini_result)
            result = {
                "verdict": "UNVERIFIED",
                "risk_score": 0,
                "confidence": 0.0,
                "ai_analysis": "",
                "manipulation_tactics": [],
                "fact_checks": [],
                "source_links": [],
                "reporting_emails": []
            }
            try:
                gemini_text = gemini_result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                print("Gemini text:", gemini_text)
                # Remove markdown code block markers if present
                if gemini_text.strip().startswith('```'):
                    gemini_text = gemini_text.strip()
                    # Remove leading/trailing code block markers
                    if gemini_text.startswith('```json'):
                        gemini_text = gemini_text[len('```json'):]
                    elif gemini_text.startswith('```'):
                        gemini_text = gemini_text[len('```'):]
                    if gemini_text.endswith('```'):
                        gemini_text = gemini_text[:-3]
                    gemini_text = gemini_text.strip()
                parsed = json.loads(gemini_text)
                print("Gemini parsed JSON:", parsed)
                for k in result:
                    if k in parsed:
                        result[k] = parsed[k]
            except Exception as e:
                print("Gemini parse error:", e)
                result["ai_analysis"] = gemini_text if 'gemini_text' in locals() else ""
        else:
            # Run comprehensive analysis for other types
            result = await analyzer.analyze(analysis_data)

        # Save to archive
        try:
            await archive_service.save_analysis({
                **result,
                "content": text or url or "",
                "analysis_type": analysis_type,
                "created_at": datetime.now().isoformat(),
                "title": f"Analysis {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            })
        except Exception as e:
            print(f"Error saving analysis to archive: {e}")

        # Calculate analysis time
        analysis_time = (datetime.now() - start_time).total_seconds()

        # Normalize source_links and fact_checks for frontend cards
        def normalize_sources(sources):
            norm = []
            for s in sources:
                if isinstance(s, dict):
                    norm.append(s)
                elif isinstance(s, str):
                    # Try to extract url and description
                    if s.startswith('http'):
                        norm.append({"url": s, "name": s})
                    else:
                        norm.append({"description": s})
            return norm

        def normalize_facts(facts):
            norm = []
            for f in facts:
                if isinstance(f, dict):
                    norm.append(f)
                elif isinstance(f, str):
                    norm.append({"description": f})
            return norm

        # Make ai_analysis more concise if it's too long
        ai_analysis = result.get("ai_analysis", "")
        if len(ai_analysis.split('. ')) > 3:
            ai_analysis = '. '.join(ai_analysis.split('. ')[:3]) + '.'

        # Ensure risk_score is int 0-100, confidence is percent int 0-100
        risk_score = result.get("risk_score", 0)
        try:
            risk_score = int(float(risk_score))
        except Exception:
            risk_score = 0
        if risk_score < 0: risk_score = 0
        if risk_score > 100: risk_score = 100

        confidence = result.get("confidence", 0.0)
        try:
            confidence = float(confidence)
            if confidence <= 1.0:
                confidence = int(round(confidence * 100))
            else:
                confidence = int(round(confidence))
        except Exception:
            confidence = 0
        if confidence < 0: confidence = 0
        if confidence > 100: confidence = 100

        # Only return source_links in the right (evidence) section, not in the left/main verdict
        return {
            "verdict": result.get("verdict", "UNVERIFIED"),
            "risk_score": risk_score,
            "confidence": confidence,
            "ai_analysis": ai_analysis,  # Only the analysis string
            "manipulation_tactics": result.get("manipulation_tactics", []),
            "fact_checks": normalize_facts(result.get("fact_checks", [])),
            "source_links": normalize_sources(result.get("source_links", [])),
            "reporting_emails": result.get("reporting_emails", []),
            "analysis_time": analysis_time
        }
    except Exception as e:
        raise
