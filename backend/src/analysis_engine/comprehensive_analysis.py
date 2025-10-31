from typing import Dict, Any, Optional
import asyncio
from datetime import datetime
import json

from .text_analysis import TextAnalyzer
from .image_forensics import ImageForensics
from .source_tracking import SourceTracker
from .context_analysis import ContextAnalyzer
from .tactics_breakdown import TacticsAnalyzer

class ComprehensiveAnalyzer:
    """
    Main orchestrator for comprehensive misinformation analysis
    """
    
    def __init__(self):
        self.text_analyzer = TextAnalyzer()
        self.image_forensics = ImageForensics()
        self.source_tracker = SourceTracker()
        self.context_analyzer = ContextAnalyzer()
        self.tactics_analyzer = TacticsAnalyzer()
    
    async def analyze(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive analysis based on content type
        """
        try:
            analysis_type = analysis_data.get("type", "text")
            content = analysis_data.get("content", "")
            language = analysis_data.get("language", "en")
            include_sources = analysis_data.get("include_sources", True)
            include_reporting = analysis_data.get("include_reporting", True)
            
            # Initialize result structure
            result = {
                "verdict": "UNVERIFIED",
                "risk_score": 0,
                "confidence": 0.0,
                "ai_analysis": "",
                "manipulation_tactics": [],
                "fact_checks": [],
                "source_links": [],
                "reporting_emails": [],
                "analysis_metadata": {
                    "type": analysis_type,
                    "language": language,
                    "timestamp": datetime.now().isoformat(),
                    "processing_time": 0
                }
            }
            
            start_time = datetime.now()
            
            if analysis_type == "text":
                result = await self._analyze_text(content, language, include_sources, include_reporting)
            elif analysis_type == "image":
                result = await self._analyze_image(analysis_data, language, include_sources, include_reporting)
            elif analysis_type == "url":
                result = await self._analyze_url(content, language, include_sources, include_reporting)
            elif analysis_type == "document":
                result = await self._analyze_document(analysis_data, language, include_sources, include_reporting)
            else:
                raise ValueError(f"Unsupported analysis type: {analysis_type}")
            
            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds()
            result["analysis_metadata"]["processing_time"] = processing_time
            
            return result
            
        except Exception as e:
            return {
                "verdict": "ERROR",
                "risk_score": 0,
                "confidence": 0.0,
                "ai_analysis": f"Analysis failed: {str(e)}",
                "manipulation_tactics": [],
                "fact_checks": [],
                "source_links": [],
                "reporting_emails": [],
                "error": str(e)
            }
    
    async def _analyze_text(self, text: str, language: str, include_sources: bool, include_reporting: bool) -> Dict[str, Any]:
        """Analyze text content"""
        try:
            # Run text analysis
            text_result = await self.text_analyzer.analyze(text, language)
            
            # Run context analysis
            context_result = await self.context_analyzer.analyze(text, language)
            
            # Run tactics analysis
            tactics_result = await self.tactics_analyzer.analyze(text, language)
            
            # Combine results
            result = {
                "verdict": text_result.get("verdict", "UNVERIFIED"),
                "risk_score": text_result.get("risk_score", 0),
                "confidence": text_result.get("confidence", 0.0),
                "ai_analysis": text_result.get("analysis", ""),
                "manipulation_tactics": tactics_result.get("tactics", []),
                "fact_checks": text_result.get("fact_checks", []),
                "source_links": [],
                "reporting_emails": []
            }
            
            # Add sources if requested
            if include_sources:
                source_result = await self.source_tracker.find_sources(text, language)
                result["source_links"] = source_result.get("sources", [])
            
            # Add reporting emails if requested
            if include_reporting:
                result["reporting_emails"] = self._get_reporting_emails(result["verdict"])
            
            return result
            
        except Exception as e:
            raise Exception(f"Text analysis failed: {str(e)}")
    
    async def _analyze_image(self, analysis_data: Dict[str, Any], language: str, include_sources: bool, include_reporting: bool) -> Dict[str, Any]:
        """Analyze image content"""
        try:
            file_path = analysis_data.get("file_path")
            file_obj = analysis_data.get("file")
            
            if file_path:
                image_result = await self.image_forensics.analyze_file(file_path, language)
            elif file_obj:
                image_result = await self.image_forensics.analyze_file_obj(file_obj, language)
            else:
                raise ValueError("No image file provided")
            
            # Extract text from image for additional analysis
            extracted_text = image_result.get("extracted_text", "")
            if extracted_text:
                text_result = await self.text_analyzer.analyze(extracted_text, language)
                tactics_result = await self.tactics_analyzer.analyze(extracted_text, language)
            else:
                text_result = {"verdict": "UNVERIFIED", "risk_score": 0, "confidence": 0.0, "analysis": ""}
                tactics_result = {"tactics": []}
            
            # Combine image and text analysis
            result = {
                "verdict": image_result.get("verdict", text_result.get("verdict", "UNVERIFIED")),
                "risk_score": max(image_result.get("risk_score", 0), text_result.get("risk_score", 0)),
                "confidence": max(image_result.get("confidence", 0.0), text_result.get("confidence", 0.0)),
                "ai_analysis": f"{image_result.get('analysis', '')}\n\nText Analysis: {text_result.get('analysis', '')}",
                "manipulation_tactics": image_result.get("tactics", []) + tactics_result.get("tactics", []),
                "fact_checks": image_result.get("fact_checks", []) + text_result.get("fact_checks", []),
                "source_links": [],
                "reporting_emails": []
            }
            
            # Add sources if requested
            if include_sources:
                source_result = await self.source_tracker.find_sources(extracted_text, language)
                result["source_links"] = source_result.get("sources", [])
            
            # Add reporting emails if requested
            if include_reporting:
                result["reporting_emails"] = self._get_reporting_emails(result["verdict"])
            
            return result
            
        except Exception as e:
            raise Exception(f"Image analysis failed: {str(e)}")
    
    async def _analyze_url(self, url: str, language: str, include_sources: bool, include_reporting: bool) -> Dict[str, Any]:
        """Analyze URL content"""
        try:
            # Extract content from URL
            url_result = await self.source_tracker.extract_url_content(url)
            content = url_result.get("content", "")
            title = url_result.get("title", "")
            
            if not content:
                return {
                    "verdict": "UNVERIFIED",
                    "risk_score": 0,
                    "confidence": 0.0,
                    "ai_analysis": "Unable to extract content from URL",
                    "manipulation_tactics": [],
                    "fact_checks": [],
                    "source_links": [],
                    "reporting_emails": []
                }
            
            # Analyze extracted content
            text_result = await self.text_analyzer.analyze(content, language)
            context_result = await self.context_analyzer.analyze(content, language)
            tactics_result = await self.tactics_analyzer.analyze(content, language)
            
            # Combine results
            result = {
                "verdict": text_result.get("verdict", "UNVERIFIED"),
                "risk_score": text_result.get("risk_score", 0),
                "confidence": text_result.get("confidence", 0.0),
                "ai_analysis": f"URL: {url}\nTitle: {title}\n\n{text_result.get('analysis', '')}",
                "manipulation_tactics": tactics_result.get("tactics", []),
                "fact_checks": text_result.get("fact_checks", []),
                "source_links": [],
                "reporting_emails": []
            }
            
            # Add sources if requested
            if include_sources:
                source_result = await self.source_tracker.find_sources(content, language)
                result["source_links"] = source_result.get("sources", [])
            
            # Add reporting emails if requested
            if include_reporting:
                result["reporting_emails"] = self._get_reporting_emails(result["verdict"])
            
            return result
            
        except Exception as e:
            raise Exception(f"URL analysis failed: {str(e)}")
    
    async def _analyze_document(self, analysis_data: Dict[str, Any], language: str, include_sources: bool, include_reporting: bool) -> Dict[str, Any]:
        """Analyze document content"""
        try:
            file_path = analysis_data.get("file_path")
            content_type = analysis_data.get("content_type", "")
            
            # Extract text from document
            if content_type == "application/pdf":
                # PDF extraction logic would go here
                content = "PDF content extraction not implemented yet"
            elif content_type == "text/plain":
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            else:
                content = "Document type not supported"
            
            # Analyze extracted content
            text_result = await self.text_analyzer.analyze(content, language)
            tactics_result = await self.tactics_analyzer.analyze(content, language)
            
            # Combine results
            result = {
                "verdict": text_result.get("verdict", "UNVERIFIED"),
                "risk_score": text_result.get("risk_score", 0),
                "confidence": text_result.get("confidence", 0.0),
                "ai_analysis": text_result.get("analysis", ""),
                "manipulation_tactics": tactics_result.get("tactics", []),
                "fact_checks": text_result.get("fact_checks", []),
                "source_links": [],
                "reporting_emails": []
            }
            
            # Add sources if requested
            if include_sources:
                source_result = await self.source_tracker.find_sources(content, language)
                result["source_links"] = source_result.get("sources", [])
            
            # Add reporting emails if requested
            if include_reporting:
                result["reporting_emails"] = self._get_reporting_emails(result["verdict"])
            
            return result
            
        except Exception as e:
            raise Exception(f"Document analysis failed: {str(e)}")
    
    def _get_reporting_emails(self, verdict: str) -> list:
        """Get appropriate reporting emails based on verdict"""
        base_emails = [
            {"description": "Report to Facebook", "email": "report@facebook.com"},
            {"description": "Report to Twitter/X", "email": "report@twitter.com"},
            {"description": "Report to Snopes", "email": "tips@snopes.com"},
            {"description": "Report to FactCheck.org", "email": "info@factcheck.org"},
            {"description": "Report to Google", "email": "report@google.com"}
        ]
        
        if verdict in ["FALSE INFORMATION", "MISLEADING"]:
            return base_emails
        else:
            return base_emails[:2]  # Only basic reporting for other verdicts
