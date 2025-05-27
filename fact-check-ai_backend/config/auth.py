from firebase_admin import credentials, initialize_app
from pymongo import MongoClient

# Firebase Init
cred = credentials.Certificate(r"D:\ACC\fact_check\fact-check-ai_backend\config\fact-check257-firebase-adminsdk-fbsvc-a886426072.json")
firebase_app = initialize_app(cred)
print("Firebase initialized")