from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from token (simplified for demo)"""
    # In a real implementation, you would validate the JWT token here
    if not credentials.credentials:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return {"user_id": "demo_user", "email": "demo@truthlens.com"}
