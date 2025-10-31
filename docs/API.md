# TruthLens API Documentation

## Overview

TruthLens is an AI-powered misinformation detection system that provides comprehensive analysis of text, images, and URLs to identify false information and manipulation tactics.

## Base URL

```
https://api.truthlens.com
```

## Authentication

Most endpoints require authentication. Include your API key in the header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Analysis

#### POST /api/analyze

Analyze content for misinformation.

**Request Body:**
```json
{
  "text": "Content to analyze",
  "analysis_type": "text|image|url",
  "language": "en",
  "include_sources": true,
  "include_reporting": true
}
```

**Response:**
```json
{
  "id": "analysis_1234567890",
  "verdict": "FALSE INFORMATION|MISLEADING|TRUE|UNVERIFIED",
  "risk_score": 85,
  "confidence": 0.92,
  "ai_analysis": "Detailed analysis...",
  "manipulation_tactics": ["Emotional language", "Cherry-picked data"],
  "fact_checks": ["Fact-checked by Snopes: FALSE"],
  "source_links": [
    {
      "name": "WHO COVID-19 Information",
      "description": "Official WHO guidance",
      "url": "https://www.who.int/..."
    }
  ],
  "reporting_emails": [
    {
      "description": "Report to Facebook",
      "email": "report@facebook.com"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "analysis_time": 2.3
}
```

#### POST /api/analyze/text

Analyze text content specifically.

#### POST /api/analyze/image

Analyze image content specifically.

#### POST /api/analyze/url

Analyze URL content specifically.

### Archive

#### GET /api/archive

Get archived analyses with filtering.

**Query Parameters:**
- `search`: Search term
- `risk_level`: low|medium|high
- `verdict`: FALSE INFORMATION|MISLEADING|TRUE|UNVERIFIED
- `analysis_type`: text|image|url
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)
- `limit`: Number of results (default: 50)
- `offset`: Number to skip (default: 0)

#### GET /api/archive/{analysis_id}

Get specific analysis by ID.

#### GET /api/archive/stats

Get archive statistics.

### Reports

#### POST /api/report

Submit a report for false information.

**Request Body:**
```json
{
  "content_id": "analysis_1234567890",
  "content_type": "text|image|url",
  "report_type": "false_information|misleading|harmful",
  "priority": "low|medium|high|critical",
  "reporter_name": "John Doe",
  "reporter_email": "john@example.com",
  "additional_info": "Additional context...",
  "evidence": ["evidence1", "evidence2"]
}
```

#### GET /api/report/{report_id}

Get report status by ID.

#### GET /api/reports

List reports with filtering.

### Upload

#### POST /api/upload/image

Upload and analyze an image file.

#### POST /api/upload/document

Upload and analyze a document file.

#### POST /api/upload/batch

Upload multiple files for batch analysis.

### Dashboard

#### GET /api/dashboard

Get dashboard analytics data.

**Query Parameters:**
- `time_range`: 1d|7d|30d|90d|1y (default: 7d)

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limits

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1,000 requests/hour
- **Enterprise**: Custom limits

## SDKs

### Python
```bash
pip install truthlens-sdk
```

```python
from truthlens import TruthLensClient

client = TruthLensClient(api_key="your-api-key")
result = client.analyze_text("Content to analyze")
```

### JavaScript
```bash
npm install truthlens-sdk
```

```javascript
import { TruthLensClient } from 'truthlens-sdk';

const client = new TruthLensClient('your-api-key');
const result = await client.analyzeText('Content to analyze');
```

## Webhooks

Configure webhooks to receive real-time notifications:

- `analysis.completed`: When analysis is finished
- `report.submitted`: When a new report is submitted
- `report.resolved`: When a report is resolved

## Support

- **Documentation**: https://docs.truthlens.com
- **Support Email**: support@truthlens.com
- **Status Page**: https://status.truthlens.com
