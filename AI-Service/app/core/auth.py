import jwt
from fastapi import HTTPException, status
from datetime import datetime
import os
import base64

JWT_SECRET_KEY = os.getenv("JWT_KEY")
JWT_ALGORITHM = "HS256"

print(f"JWT_SECRET_KEY loaded: {JWT_SECRET_KEY is not None}")

def validate_jwt_token(token: str) -> dict:
    """
    Validate JWT token from ASP.NET Core backend.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authentication token provided"
        )
    
    try:
        decoded = jwt.decode(
            token, 
            JWT_SECRET_KEY, 
            algorithms=[JWT_ALGORITHM],
            options={
                "verify_signature": True,
                "verify_exp": True,  
                "verify_aud": False,       
                "verify_iss": False 
            }
        )
        
        print(f"✅ Token decoded successfully!")

        exp = decoded.get('exp')
        if exp and datetime.now().timestamp() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )

        user_id = decoded.get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier')
        email = decoded.get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress')
        
        if not user_id:
            user_id = decoded.get('nameidentifier')
        if not email:
            email = decoded.get('email')
        
        print(f"User ID: {user_id}")
        print(f"Email: {email}")
        
        return {
            "user_id": user_id,
            "email": email,
            "valid": True
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidSignatureError as e:
        print(f"Invalid signature: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature"
        )
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )