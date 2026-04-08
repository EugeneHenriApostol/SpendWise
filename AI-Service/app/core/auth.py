from fastapi import HTTPException, status

def validate_jwt_token(token: str) -> dict:
    """
    Validate JWT token from your ASP.NET Core backend.
    Note: You'll need to share the same JWT secret key between services.
    """
    try:
        # For now, we'll just verify the token exists
        # In production, you should validate the signature
        # using your JWT_SECRET_KEY from appsettings.json
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        # You can decode to get user_id if needed
        # decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        # return decoded
        
        return {"valid": True}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )