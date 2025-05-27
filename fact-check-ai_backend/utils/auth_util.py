import datetime
import hashlib
import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth, exceptions
from config.constants import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from config.db import users_collection
from models.models import TokenData
from config.auth import firebase_app
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def check_user_exists(email: str) -> bool:
    try:
        auth.get_user_by_email(email)
        return True
    except exceptions.NotFoundError:
        return False

def get_user_from_db(email: str):
    return users_collection.find_one({"email": email})

def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.datetime.utcnow()})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        uid = payload.get("uid")
        email = payload.get("email")
        if not uid or not email:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return TokenData(uid=uid, email=email)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
async def check_email_verification(email: str):
    try:
        user = auth.get_user_by_email(email)
        if not user.email_verified:
            return False
        return True
    except exceptions.FirebaseError as e:
        raise HTTPException(status_code=500, detail=f"Firebase error: {str(e)}")
    

async def update_user_profile(uid: str, display_name: str):
    try:
        auth.update_user(
            uid=uid,
            display_name=display_name,
        )
    except exceptions.FirebaseError as e:
        logger.error(f"Firebase error updating user {uid}: {e}")
        raise HTTPException(status_code=500, detail=f"Firebase error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error updating user {uid}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
