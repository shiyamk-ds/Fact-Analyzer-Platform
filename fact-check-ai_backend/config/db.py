from pymongo import MongoClient
from config.constants import MONGO_URI, DB_NAME, DAILY_ARTICLES, USER_COLLECTION, TOPICS_COLLECTION, REPORT_COLLECTION

try:
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client[DB_NAME]
    users_collection = db[USER_COLLECTION]
    daily_articles_collection = db[DAILY_ARTICLES]
    topics_collection = db[TOPICS_COLLECTION]
    report_collection = db[REPORT_COLLECTION]
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    raise