from fastapi import APIRouter, HTTPException
from models.models import NewsRequest, CustomSearchRequest
from utils.fetch_news import fetch_and_store_articles, custom_search_articles, get_all_articles_util, get_todays_news_util, fetch_topics
from config.db import report_collection, daily_articles_collection
import logging
from datetime import datetime, timedelta


logger = logging.getLogger(__name__)


fetch_news_router = APIRouter()

@fetch_news_router.post("/fetch-news")
def fetch_news(req: NewsRequest):
    logger.info(f"Initiating daily news fetch for date {req.date_str}")
    try:
        fetch_and_store_articles(req.date_str, req.country, req.topics, req.page_size)
    except Exception as e:
        logger.error(f"Fetch process failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch and store articles")
    logger.info("News fetch and store operation completed")
    return {"status": "success", "message": "Articles fetched and stored for today."}

@fetch_news_router.post("/custom-search")
def custom_search(req: CustomSearchRequest):
    try:
        params = req.dict(exclude_none=True)
        articles = custom_search_articles(params)
        return {"status": "success", "count": len(articles), "articles": articles}
    except Exception as e:
        logger.error(f"Custom search API failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to perform custom search")
    
@fetch_news_router.get("/get-all-articles")
async def get_all_articles():
    try:
        articles = await get_all_articles_util()
        logger.info(f"Fetched {len(articles)} articles from the database")
        if not articles:
            logger.info("No articles found in the database")
            return {"status": "success", "message": "No articles found"}
        return {"status": "success", "articles": articles}
    except Exception as e:
        logger.error(f"Get all articles API failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch all articles")
    
    
@fetch_news_router.get("/get-todays-news")
async def get_todays_news():
    try:
        articles = await get_todays_news_util()
        logger.info(f"Fetched {len(articles)} articles from the database for today")
        if not articles:
            logger.info("No articles found in the database for today")
            return {"status": "success", "message": "No articles found for today"}
        return {"status": "success", "articles": articles}
    except Exception as e:
        logger.error(f"Get today's news API failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch today's news")
    
    
@fetch_news_router.get('/get-topics')
async def get_topics(email):
    try:
        topics = await fetch_topics(email)
        
        return {"topics" : topics}
    except Exception as e:
        logger.exception("Error fetching topics")
        raise HTTPException(status_code=500, detail="Failed to fetch topics")
    
    
@fetch_news_router.get('/get-news-by-topic')
async def get_news_by_topics(topic: str):
    try:
        articles = await get_all_articles_util()
        if topic.lower() == "all":
            filtered_articles = articles
        else:
            filtered_articles = [article for article in articles if topic.lower() == article.get("topic", "").lower()]
        
        result_articles = [
            {**article["article"], "article_id": article["article_id"], "analyzed": article.get("analyzed", False), "reports": article.get("reports", [])}
            for article in filtered_articles
        ]
        
        return {"status": "success", "articles": result_articles}
    except Exception as e:
        logger.error(f"Get news by topic API failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch news by topic")


@fetch_news_router.get('/get-report')
async def get_report(report_id: str, article_id : str):
    try:
        article = daily_articles_collection.find_one(
            {"article_id" : article_id},
            {"_id" : 0}
        )
        report = report_collection.find_one(
            {"report_id": report_id},
            {"_id" : 0}
            )
                    
        return {'report': report, "article" : article}
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch report: {str(e)}"
        )

@fetch_news_router.get('/fetch-report-summary')
async def get_report_summary(email: str):
    articles = list(daily_articles_collection.find({
        "reports": {
            "$elemMatch": {
                "analyzed": True,
                "user_email": email
            }
        }
    }, {'_id': 0}))
    
    summaries = []

    for article in articles:
        reports = article.get('reports', [])
        for report_info in reports:
            if not (report_info.get('analyzed') and report_info.get('user_email') == email):
                continue
                
            report_id = report_info.get('report_id')
            if not report_id:
                continue
                
            report = report_collection.find_one({"report_id": report_id}, {'_id': 0})

            if report:
                claims = report.get('fact_check_report', {}).get('claims', [])
                claim_counts = {
                    "True": 0,
                    "False": 0,
                    "Unverifiable": 0,
                    "Misleading": 0
                }

                for claim in claims:
                    category = claim.get('fact_check_category')
                    if category in claim_counts:
                        claim_counts[category] += 1

                summary = {
                    "article": article,
                    "report_id": report_id,
                    "title": report.get('title'),
                    "overall_category": report.get('fact_check_report', {}).get('overall_category'),
                    "claim_counts": claim_counts,
                    "notes": report.get('fact_check_report', {}).get('notes'),
                    "category": report.get('fact_check_report', {}).get('category')
                }
                summaries.append(summary)

    return {"status": "success", "articles": summaries}

@fetch_news_router.get('/get-published-reports')
async def get_published_reports():
    try:
        public_reports_cursor = daily_articles_collection.find(
            {"reports.settings": "public"},
            {"reports": 1, "article_id": 1, "article": 1, "_id": 0}
        )

        result = []
        
        for doc in public_reports_cursor:
            if "reports" in doc:
                for report in doc["reports"]:
                    if report.get("settings") == "public":
                        report_data = report_collection.find_one(
                            {"report_id": report["report_id"]},
                            {
                                "fact_check_report": 1,
                                "source_report": 1,
                                "title": 1,
                                "questions": 1,
                                "images": 1,
                                "_id": 0
                            }
                        )
                        
                        if report_data:
                            result.append({
                                "report_id": report["report_id"],
                                "article_id": doc.get("article_id"),
                                "article": doc.get("article"),
                                "user_email": report.get("user_email"),
                                "settings": report.get("settings"),
                                "title": report_data.get("title"),
                                "fact_check_report": report_data.get("fact_check_report"),
                                "source_report": report_data.get("source_report") or [],
                                "questions": report_data.get("questions") or [],
                                "images": report_data.get("images") or []
                            })

        return {"reports": result}
    except Exception as e:
        logger.error(f"Get public reports failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch public reports")


@fetch_news_router.get('/check-latest-news')
async def check_latest_news(topic: str):
    try:
        # Query to find all articles for the given topic
        articles = daily_articles_collection.find(
            {"topic": topic},
            {"article.publishedAt": 1, "_id": 0}
        )

        # Get current UTC time and calculate the threshold (3 days ago)
        current_date = datetime.utcnow()
        three_days_ago = current_date - timedelta(days=3)

        # Check if any article is within the last 3 days
        has_recent_article = False
        for article in articles:
            if not article.get("article", {}).get("publishedAt"):
                continue
            published_date = datetime.strptime(
                article["article"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"
            )
            if published_date >= three_days_ago:
                has_recent_article = True
                break

        # Return response with is_latest and fetch_enabled flags
        response = {
            "is_latest": has_recent_article,
            "is_oldest": not has_recent_article
        }

        if not has_recent_article:
            logger.info(f"No recent articles found for topic: {topic}, fetch enabled")
        return response

    except Exception as e:
        logger.error(f"Check latest news failed for topic {topic}: {e}")
        raise HTTPException(status_code=500, detail="Failed to check latest news")