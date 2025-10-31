# TruthLens Deployment Guide

## Overview

This guide covers deploying TruthLens to Google Cloud Platform using Cloud Run, Firebase Hosting, and Firestore.

## Prerequisites

- Google Cloud Platform account
- Node.js 18+ installed
- Python 3.11+ installed
- gcloud CLI installed
- Firebase CLI installed

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/truthlens.git
   cd truthlens
   ```

2. **Run the setup script**
   ```bash
   chmod +x deployment/gcloud-setup.sh
   ./deployment/gcloud-setup.sh
   ```

## Manual Deployment

### 1. Backend (FastAPI) to Cloud Run

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Deploy to Cloud Run
gcloud run deploy truthlens-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10
```

### 2. Frontend (React) to Firebase Hosting

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### 3. Database (Firestore)

```bash
# Create Firestore database
gcloud firestore databases create --region=us-central1

# Deploy security rules
firebase deploy --only firestore:rules
```

## Environment Variables

### Backend (.env)

```env
# API Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false

# Google Cloud APIs
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GEMINI_API_KEY=your-gemini-api-key
FACT_CHECK_API_KEY=your-fact-check-api-key

# Database
FIRESTORE_PROJECT_ID=your-project-id

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin
ADMIN_EMAIL=admin@truthlens.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://your-api-url.run.app
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## Google Cloud Services Setup

### 1. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable language.googleapis.com
gcloud services enable translate.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable firestore.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create truthlens-service \
  --display-name="TruthLens Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:truthlens-service@your-project-id.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:truthlens-service@your-project-id.iam.gserviceaccount.com" \
  --role="roles/vision.admin"

# Create and download key
gcloud iam service-accounts keys create service-account.json \
  --iam-account=truthlens-service@your-project-id.iam.gserviceaccount.com
```

### 3. Configure Firestore

```bash
# Create Firestore database
gcloud firestore databases create --region=us-central1

# Deploy security rules
firebase deploy --only firestore:rules
```

## Docker Deployment

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Monitoring and Logging

### 1. Cloud Monitoring

```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime create \
  --display-name="TruthLens API" \
  --http-check-path="/api/health" \
  --hostname="your-api-url.run.app"
```

### 2. Logging

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Create log-based metrics
gcloud logging metrics create truthlens_errors \
  --description="TruthLens API errors" \
  --log-filter="resource.type=cloud_run_revision AND severity>=ERROR"
```

## Scaling Configuration

### Cloud Run Scaling

```yaml
# cloud-run-config.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: truthlens-api
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "100"
        autoscaling.knative.dev/minScale: "1"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 100
      timeoutSeconds: 300
      containers:
      - image: gcr.io/your-project/truthlens-api
        resources:
          limits:
            cpu: "2"
            memory: "2Gi"
```

## Security Configuration

### 1. CORS Settings

```python
# In main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analyses/{analysisId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **API not responding**
   - Check Cloud Run logs
   - Verify environment variables
   - Check service account permissions

2. **Frontend not loading**
   - Check Firebase Hosting deployment
   - Verify API URL configuration
   - Check browser console for errors

3. **Database connection issues**
   - Verify Firestore is enabled
   - Check service account permissions
   - Verify project ID configuration

### Debug Commands

```bash
# Check Cloud Run status
gcloud run services list

# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 100

# Test API endpoint
curl https://your-api-url.run.app/api/health

# Check Firestore
gcloud firestore databases list
```

## Performance Optimization

### 1. Caching

```python
# Add Redis caching
from redis import Redis
import json

redis_client = Redis(host='redis-host', port=6379, db=0)

async def get_cached_analysis(text_hash):
    cached = redis_client.get(f"analysis:{text_hash}")
    if cached:
        return json.loads(cached)
    return None
```

### 2. CDN Configuration

```yaml
# firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|svg|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Backup and Recovery

### 1. Firestore Backup

```bash
# Create backup
gcloud firestore export gs://your-backup-bucket/backup-$(date +%Y%m%d)

# Restore backup
gcloud firestore import gs://your-backup-bucket/backup-20240115
```

### 2. Cloud Run Backup

```bash
# Export service configuration
gcloud run services describe truthlens-api --region=us-central1 --format=export > service-backup.yaml
```

## Cost Optimization

### 1. Cloud Run Optimization

- Set appropriate CPU and memory limits
- Use request-based scaling
- Implement proper caching

### 2. Firestore Optimization

- Use composite indexes efficiently
- Implement pagination
- Monitor read/write operations

## Support

For deployment issues:

- **Documentation**: https://docs.truthlens.com
- **Support Email**: support@truthlens.com
- **GitHub Issues**: https://github.com/your-org/truthlens/issues
