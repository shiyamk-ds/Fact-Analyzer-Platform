from utils.utils import get_secret_key

NEWS_API_KEY = "NEWSAPI-APIKEY-1"
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "news_db"
DAILY_ARTICLES = "daily_articles"
TOPICS_COLLECTION = "topics"
REPORT_COLLECTION = "fact_check_reports"

USER_COLLECTION = "users"

JWT_SECRET = get_secret_key("JWT-SECRET")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 360

PPLX_API_KEY = get_secret_key("PERPLEXITY-APIKEY-1")
