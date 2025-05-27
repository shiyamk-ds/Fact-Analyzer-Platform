from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional 
import datetime

class NewsRequest(BaseModel):
    country: str
    topics: List[str]
    date_str : str
    page_size : int
    
class CustomSearchRequest(BaseModel):
    q: Optional[str] = None
    from_param: Optional[str] = None  # YYYY-MM-DD
    to: Optional[str] = None          # YYYY-MM-DD
    language: str = Field(default="en")

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    firebase_uid : str

class UserInDB(BaseModel):
    uid: str
    email: EmailStr
    hashed_password: str
    name: Optional[str] = None
    created_at: datetime.datetime

class Token(BaseModel):
    access_token: str
    user_name : str
    token_type: str

class TokenData(BaseModel):
    uid: str
    email: str
    
class TopicSelection(BaseModel):
    topics: List[str]
    email: str