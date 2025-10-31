from typing import Dict, Any
import asyncio
import os
import datetime
from PIL import Image
import cv2
import numpy as np

class ImageForensics:
    """
    Image forensics and manipulation detection
    """

    def __init__(self):
        pass
    
    async def analyze_file(self, file_path: str, language: str = "en") -> Dict[str, Any]:
        """
        Analyze image file for manipulation and misinformation
        """
        try:
            # Load image
            image = Image.open(file_path)
            
            # Run various analyses
            metadata_analysis = await self._analyze_metadata(file_path)
            manipulation_analysis = await self._detect_manipulation(file_path)
            ocr_analysis = await self._extract_text(image)
            reverse_search = await self._reverse_image_search(file_path)
            
            # Combine results
            result = {
                "verdict": "UNVERIFIED",
                "risk_score": 0,
                "confidence": 0.0,
                "analysis": "",
                "tactics": [],
                "fact_checks": [],
                "extracted_text": ocr_analysis.get("text", ""),
                "metadata": metadata_analysis,
                "manipulation_detected": manipulation_analysis.get("manipulated", False),
                "reverse_search_results": reverse_search
            }
            
            # Determine verdict based on analysis
            if manipulation_analysis.get("manipulated", False):
                result["verdict"] = "FALSE INFORMATION"
                result["risk_score"] = 90
                result["confidence"] = 0.85
                result["analysis"] = "Image appears to be digitally manipulated or altered."
                result["tactics"] = ["Image manipulation", "Digital alteration"]
            elif ocr_analysis.get("text"):
                # If text is extracted, analyze it
                text_analysis = await self._analyze_extracted_text(ocr_analysis["text"])
                result.update(text_analysis)
            else:
                result["verdict"] = "UNVERIFIED"
                result["risk_score"] = 30
                result["confidence"] = 0.40
                result["analysis"] = "Unable to determine image authenticity with current methods."
            
            return result
            
        except Exception as e:
            return {
                "verdict": "ERROR",
                "risk_score": 0,
                "confidence": 0.0,
                "analysis": f"Image analysis failed: {str(e)}",
                "tactics": [],
                "fact_checks": [],
                "extracted_text": "",
                "metadata": {},
                "manipulation_detected": False,
                "reverse_search_results": []
            }
    
    async def analyze_file_obj(self, file_obj, language: str = "en") -> Dict[str, Any]:
        """
        Analyze image file object
        """
        # Save file object to temporary location and analyze
        temp_path = f"temp_{int(datetime.datetime.now().timestamp())}.jpg"
        try:
            with open(temp_path, "wb") as f:
                content = await file_obj.read()
                f.write(content)
            
            result = await self.analyze_file(temp_path, language)
            return result
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    async def _analyze_metadata(self, file_path: str) -> Dict[str, Any]:
        """Analyze image metadata for signs of manipulation"""
        try:
            image = Image.open(file_path)
            metadata = image.getexif()
            
            analysis = {
                "has_metadata": len(metadata) > 0,
                "creation_software": metadata.get(271, "Unknown"),
                "creation_date": metadata.get(306, "Unknown"),
                "camera_make": metadata.get(271, "Unknown"),
                "camera_model": metadata.get(272, "Unknown"),
                "suspicious_indicators": []
            }
            
            # Check for suspicious indicators
            if not analysis["creation_software"] or analysis["creation_software"] == "Unknown":
                analysis["suspicious_indicators"].append("No creation software metadata")
            
            if not analysis["creation_date"] or analysis["creation_date"] == "Unknown":
                analysis["suspicious_indicators"].append("No creation date metadata")
            
            return analysis
            
        except Exception as e:
            return {"error": str(e)}
    
    async def _detect_manipulation(self, file_path: str) -> Dict[str, Any]:
        """Detect digital manipulation using computer vision"""
        try:
            # Load image with OpenCV
            image = cv2.imread(file_path)
            if image is None:
                return {"manipulated": False, "confidence": 0.0}
            
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Simple manipulation detection (this is a basic implementation)
            # In a real system, you'd use more sophisticated algorithms
            
            # Check for duplicate regions (copy-paste detection)
            duplicate_regions = self._find_duplicate_regions(gray)
            
            # Check for inconsistent lighting
            lighting_consistency = self._check_lighting_consistency(gray)
            
            # Check for edge inconsistencies
            edge_consistency = self._check_edge_consistency(gray)
            
            # Determine if manipulated
            manipulation_score = 0
            if duplicate_regions > 0.1:  # 10% duplicate regions
                manipulation_score += 0.3
            if lighting_consistency < 0.7:  # Low lighting consistency
                manipulation_score += 0.3
            if edge_consistency < 0.6:  # Low edge consistency
                manipulation_score += 0.4
            
            return {
                "manipulated": manipulation_score > 0.5,
                "confidence": manipulation_score,
                "duplicate_regions": duplicate_regions,
                "lighting_consistency": lighting_consistency,
                "edge_consistency": edge_consistency
            }
            
        except Exception as e:
            return {"manipulated": False, "confidence": 0.0, "error": str(e)}
    
    def _find_duplicate_regions(self, image):
        """Find duplicate regions in image (simplified)"""
        # This is a simplified implementation
        # Real implementation would use more sophisticated algorithms
        return 0.05  # Mock value
    
    def _check_lighting_consistency(self, image):
        """Check lighting consistency across image"""
        # This is a simplified implementation
        # Real implementation would analyze lighting patterns
        return 0.8  # Mock value
    
    def _check_edge_consistency(self, image):
        """Check edge consistency across image"""
        # This is a simplified implementation
        # Real implementation would analyze edge patterns
        return 0.7  # Mock value
    
    async def _extract_text(self, image) -> Dict[str, Any]:
        """Extract text from image using OCR"""
        from google.cloud import vision
        import io
        try:
            client = vision.ImageAnnotatorClient()
            # Convert PIL Image to bytes
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            content = img_byte_arr.getvalue()
            image_vision = vision.Image(content=content)
            response = client.text_detection(image=image_vision)
            texts = response.text_annotations
            if response.error.message:
                raise Exception(response.error.message)
            if texts:
                return {
                    "text": texts[0].description,
                    "confidence": None,  # Google Vision API does not provide confidence in text_detection
                    "language": None
                }
            else:
                return {
                    "text": "",
                    "confidence": 0.0,
                    "language": None
                }
        except Exception as e:
            return {"text": "", "confidence": 0.0, "error": str(e)}
    
    async def _reverse_image_search(self, file_path: str) -> list:
        """Perform reverse image search"""
        try:
            # This is a mock implementation
            # Real implementation would use Google Images API or similar
            await asyncio.sleep(1.0)  # Simulate API call
            
            return [
                {
                    "url": "https://example.com/similar-image1.jpg",
                    "similarity": 0.85,
                    "source": "Google Images"
                },
                {
                    "url": "https://example.com/similar-image2.jpg", 
                    "similarity": 0.72,
                    "source": "Bing Images"
                }
            ]
            
        except Exception as e:
            return []
    
    async def _analyze_extracted_text(self, text: str) -> Dict[str, Any]:
        """Analyze extracted text for misinformation"""
        # This would integrate with the text analyzer
        return {
            "verdict": "UNVERIFIED",
            "risk_score": 40,
            "confidence": 0.50,
            "analysis": "Text extracted from image requires further analysis."
        }
