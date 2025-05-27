from datetime import datetime, timedelta
from config.constants import NEWS_API_KEY
from newsapi import NewsApiClient
from config.db import daily_articles_collection, topics_collection, users_collection
import logging

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uuid


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_news_client():
    try:
        newsapi = NewsApiClient(api_key=NEWS_API_KEY)
        logger.info("NewsAPI client initialized")
        return newsapi
    except Exception as e:
        logger.error(f"Failed to initialize NewsAPI client: {e}")
        raise

def store_articles(date_str, country, topic, articles):
    for article in articles:
        try:
            title = article.get("title")
            if not title:
                logger.warning(f"Article missing title, skipping: {article}")
                continue
            if daily_articles_collection.find_one({"title": title}):
                logger.info(f"Duplicate article found, skipping: {title}")
                continue
            id_uuid = str(uuid.uuid4())
            document = {
                "article_id" : id_uuid,
                "date": date_str,
                "country": country,
                "topic": topic,
                "article": article,
                "title": title
            }
            daily_articles_collection.insert_one(document)
            logger.info(f"Stored article: {title}")
        except Exception as e:
            logger.error(f"Error storing article: {e}")

def fetch_and_store_articles(date_str, country, topics, page_size):
    to_param = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
    from_param = date_str
    articles_list = []
    for topic in topics:
        try:
            newsapi = get_news_client()
            logger.info(f"Fetching news for topic={topic}, date={date_str}")
            response = newsapi.get_everything(
                q=topic,
                from_param=from_param,
                to=to_param,
                language="en",
                sort_by="relevancy",
                page=1,
                page_size=page_size,
            )
            articles = response.get("articles", [])
            store_articles(date_str, country, topic, articles)
            articles_list.extend(articles)
        except Exception as e:
            logger.error(f"Failed to fetch/store news for topic={topic}, country={country}: {e}")
                
def custom_search_articles(params: dict):
    try:
        newsapi = get_news_client()
        logger.info(f"Executing custom search with params: {params}")
        response = newsapi.get_everything(
            q=params.get("q"),
            language=params.get("language", "en"),
            sort_by="popularity",
            page_size=15,
            page=1
        )
        articles = response.get("articles", [])

        exact_matches = []
        similar_matches = []
        normal_matches = []

        for article in articles:
            article['uuid'] = str(uuid.uuid4())
            title = article.get("title")
            author = article.get("author")
            publishedAt = article.get("publishedAt")

            if not title:
                continue

            exact = daily_articles_collection.find_one({
                "title": title,
                "article.author": author,
                "article.publishedAt": publishedAt
            })

            if exact:
                article["alreadyAdded"] = True
                exact_matches.append(article)
                continue

            desc_title = (article.get("title") or "") + " " + (article.get("description") or "")
            query = params.get("q") or ""

            tfidf = TfidfVectorizer().fit_transform([query, desc_title])
            score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0] * 100

            if score >= 60:
                article["match"] = True
                article["similarity_score"] = score
                similar_matches.append(article)
                try:
                    if not daily_articles_collection.find_one({"title": title}):
                        daily_articles_collection.insert_one({"title": title, "article": article})
                except Exception as e:
                    logger.error(f"Failed inserting similar article: {e}")
            else:
                normal_matches.append(article)

        sorted_articles = exact_matches + similar_matches + normal_matches
        logger.info(f"Custom search: {len(exact_matches)} exact, {len(similar_matches)} similar, {len(normal_matches)} normal")
        return sorted_articles

    except Exception as e:
        logger.error(f"Custom search failed: {e}")
        raise
    
async def get_all_articles_util():
    try:
        articles = daily_articles_collection.find({}, {"_id" : 0})
        return list(articles)
    except Exception as e:
        logger.error(f"Failed to fetch all articles: {e}")
        raise
    
async def get_todays_news_util():
    try:
        today = datetime.utcnow().date()
        cursor = daily_articles_collection.find({}, {"_id": 0})
        results = []
        for record in cursor:
            published_at = record.get("article", {}).get("publishedAt")
            if published_at:
                try:
                    published_date = datetime.strptime(published_at, "%Y-%m-%dT%H:%M:%SZ").date()
                    if published_date == today:
                        results.append(record)
                except ValueError:
                    continue
        return results
    except Exception as e:
        logger.error(f"Failed to fetch today's news: {e}")
        raise
    
async def fetch_topics(email: str):
    try:
        user = users_collection.find_one({"email": email}, {"_id": 0, "topics": 1})
        if not user or "topics" not in user:
            logger.info(f"No topics found for user: {email}")
            return []

        user_topics = user["topics"]

        db_topics_cursor = topics_collection.find({}, {"_id": 0, "name": 1})
        db_topics = set(topic["name"] for topic in db_topics_cursor)

        matched_topics = [topic for topic in user_topics if topic in db_topics]
        return matched_topics
    except Exception as e:
        logger.error(f"Failed to fetch topics: {e}")
        raise