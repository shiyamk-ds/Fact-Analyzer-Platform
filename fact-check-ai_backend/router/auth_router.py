from fastapi import APIRouter, HTTPException, status, Depends, Form
from firebase_admin import auth
from fastapi.security import OAuth2PasswordRequestForm
from models.models import UserCreate, Token, TopicSelection
from utils.auth_util import hash_password, check_user_exists, get_user_from_db, create_access_token, verify_token, update_user_profile
from config.db import users_collection
import datetime
import logging

logger = logging.getLogger(__name__)

auth_router = APIRouter()

@auth_router.post("/register")
async def register_user(user: UserCreate):
    logger.info(f"Attempting to register user with email: {user.email}")
    try:
        # firebase_user = auth.create_user(email=user.email, password=user.password)
        logger.info(f"Firebase user created with UID: {user.firebase_uid}")
        user_data = {
            "uid": user.firebase_uid,
            "email": user.email,
            "hashed_password": hash_password(user.password),
            "created_at": datetime.datetime.utcnow()
        }
        users_collection.insert_one(user_data)
        logger.info(f"User data inserted into MongoDB for UID: {user.firebase_uid}")
        access_token = create_access_token({"uid": user.firebase_uid, "email": user.email})
        logger.info(f"Access token created for UID: {user.firebase_uid}")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Registration failed for email {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    
@auth_router.get('/verified')
async def is_verified(email : str):
    try:
        user = auth.get_user_by_email(email=email)
        return {"is_verified" : user.email_verified}
    except Exception as e:
        logger.error(f"Login failed for user {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@auth_router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"Attempting login for user: {form_data.username}")
    try:
        firebase_user = auth.get_user_by_email(form_data.username)
        user_data = get_user_from_db(form_data.username)
        if not user_data or hash_password(form_data.password) != user_data["hashed_password"]:
            logger.warning(f"Login failed for user {form_data.username}: Invalid credentials")
            print(hash_password(form_data.password))
            print(user_data["hashed_password"])
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token({"uid": firebase_user.uid, "email": firebase_user.email})
        logger.info(f"Login successful for user: {form_data.username}")
        return {"access_token": token, "user_name" : user_data['name'], "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Login failed for user {form_data.username}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@auth_router.put("/topic_selection")
async def update_topic_selection(topics_model : TopicSelection):
    logger.info(f"Attempting to update topic selection for email: {topics_model.email}")
    try:
        user_data = get_user_from_db(topics_model.email)
        if not user_data:
            logger.warning(f"Update topic selection failed: User not found: {topics_model.email}")
            raise HTTPException(status_code=404, detail="User not found")
        users_collection.update_one({"email": topics_model.email}, {"$set": {"topics": topics_model.topics}})
        logger.info(f"Topic selection updated successfully for email: {topics_model.email}")
        return {"message": "Topic selection updated successfully"}
    except Exception as e:
        logger.error(f"Failed to update topic selection for email {topics_model.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")
    
@auth_router.put("/country_selection")
async def update_country_selection(countries: str = Form(...), email: str = Form(...)):
    logger.info(f"Attempting to update country selection for email: {email}")
    try:
        user_data = get_user_from_db(email)
        if not user_data:
            logger.warning(f"Update country selection failed: User not found: {email}")
            raise HTTPException(status_code=404, detail="User not found")
        users_collection.update_one({"email": email}, {"$set": {"countries": countries}})
        logger.info(f"Country selection updated successfully for email: {email}")
        return {"message": "Country selection updated successfully"}
    except Exception as e:
        logger.error(f"Failed to update country selection for email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")
    
@auth_router.put("/update_profile")
async def update_profile(email: str = Form(...), display_name: str = Form(...)):
    logger.info(f"Attempting to update profile for email: {email}")
    try:
        user_data = get_user_from_db(email)
        if not user_data:
            logger.warning(f"Update profile failed: User not found: {email}")
            raise HTTPException(status_code=404, detail="User not found")
        update_user_profile(user_data["uid"], display_name)
        users_collection.update_one({"email": email}, {"$set": {"name": display_name}})
        logger.info(f"Profile updated successfully for email: {email}")
        return {"message": "Profile updated successfully"}
    except Exception as e:
        logger.error(f"Failed to update profile for email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")
    
# @auth_router.get("/verify_token")
# async def verify_user_token(token: str = Depends(verify_token)):
#     try:
#         user_data = get_user_from_db(token.email)
#         if not user_data:
#             raise HTTPException(status_code=404, detail="User not found")
#         return {"message": "Token is valid", "user": user_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")