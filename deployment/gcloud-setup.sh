#!/bin/bash

# TruthLens Google Cloud Setup Script
# This script sets up the necessary Google Cloud services for TruthLens

set -e

echo "🚀 Setting up TruthLens on Google Cloud..."

# Set project variables
PROJECT_ID="truthlens-project"
REGION="us-central1"
SERVICE_NAME="truthlens-api"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable language.googleapis.com
gcloud services enable translate.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable firestore.googleapis.com

# Create Firestore database
echo "🗄️ Creating Firestore database..."
gcloud firestore databases create --region=$REGION

# Deploy the API to Cloud Run
echo "🚀 Deploying API to Cloud Run..."
cd ../backend
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10

# Get the API URL
API_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
echo "✅ API deployed at: $API_URL"

# Deploy the frontend to Firebase Hosting
echo "🌐 Deploying frontend to Firebase Hosting..."
cd ../frontend

# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting

echo "🎉 TruthLens deployment completed!"
echo "📱 Frontend: https://$PROJECT_ID.web.app"
echo "🔗 API: $API_URL"
echo "📊 Monitoring: https://console.cloud.google.com/monitoring"
