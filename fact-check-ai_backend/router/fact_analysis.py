from fastapi import APIRouter, HTTPException
from datetime import datetime
from utils.fact_analysis import fact_analysis_base
from config.db import daily_articles_collection
import logging

logger = logging.getLogger(__name__)


fact_analysis_router = APIRouter()

@fact_analysis_router.post("/fact-analysis")
def fact_analysis(article_id : str, email : str):
    start_time = datetime.now()
    logger.info(f"Fact analysis started at {start_time} for article_id: {article_id}")
    try:
        article = daily_articles_collection.find_one({"article_id": article_id})
        if article is None:
            raise HTTPException(status_code=404, detail="Article not found")

        report_id = fact_analysis_base(article)

        daily_articles_collection.update_one(
            {"article_id": article_id},
            {
            "$push": {
                "reports": {
                "report_id": report_id,
                "analyzed": True,
                "user_email": email
                }
            }
            }
        )

        end_time = datetime.now()
        duration = end_time - start_time
        logger.info(f"Fact analysis completed at {end_time} for article_id: {article_id}. Duration: {duration}")

        return {"report_id": report_id}

    except Exception as e:
        end_time = datetime.now()
        duration = end_time - start_time
        logger.exception(f"Fact analysis failed after :: {duration} : {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@fact_analysis_router.put('/set-save')
async def update_save_settings(settings: str, article_id: str, report_id: str):
    try:
        # Find the article by article_id
        article = daily_articles_collection.find_one({"article_id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")

        # Update the settings for the specific report in the reports array
        result = daily_articles_collection.update_one(
            {
                "article_id": article_id,
                "reports.report_id": report_id
            },
            {
                "$set": {
                    "reports.$.settings": settings
                }
            }
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")

        return {"message": "Settings updated successfully"}
    
    except Exception as e:
        logger.exception(f"Error occurred while saving settings, {e}")
        raise HTTPException(status_code=500, detail=str(e))   