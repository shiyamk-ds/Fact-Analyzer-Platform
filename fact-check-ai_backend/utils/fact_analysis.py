from llama_index.llms.perplexity import Perplexity
from llama_index.core.llms import ChatMessage

from config.model_configs import SONAR_PRO_MODEL_DEFAULTS
from prompts.fact_analysis_prompt import FACT_CHECK_SYSTEM_PROMPT, FACT_CHECK_USER_PROMPT
from prompts.source_ranker import SOURCE_ANALYSIS_SYSTEM_PROMPT, SOURCE_ANALYSIS_USER_PROMPT
from models.fact_analysis_model import report_format, source_format
from config.constants import PPLX_API_KEY
from utils.utils import format_response
from config.db import report_collection

from config.db import topics_collection
import logging
import tenacity
import uuid

logger = logging.getLogger(__name__)


def get_metadata(article):
    try:
        metadata = f"#{article.get('title')}\n\n"
        metadata += f"##{article.get('description')}\n\n"
        metadata += f"Source : {article.get('source', {}).get('name')}\n\n"
        metadata += f"Published At : {article.get('publishedAt')}\n\n"
        metadata += f"URL : {article.get('url', '')}"
        return metadata
    except Exception as e:
        logger.exception(f"Failed to get metadata from article: {str(e)}")
        raise e
    
@tenacity.retry(stop=tenacity.stop_after_attempt(3), wait=tenacity.wait_fixed(1))
def fact_analysis_build(metadata, model_default):
    try:
        messages_dict = [
            {"role": "system", "content": FACT_CHECK_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": FACT_CHECK_USER_PROMPT.format(article_metadata=metadata),
            },]

        messages = [ChatMessage(**msg) for msg in messages_dict]
        model_default['response_format']['json_schema']['schema'] = report_format
        model_default['return_images'] = True
        model_default['return_related_questions'] = True
        llm = Perplexity(api_key=PPLX_API_KEY, model="sonar-pro", additional_kwargs=model_default,)
        response = llm.chat(messages)
        images = response.model_dump()['raw']['images']
        questions = response.model_dump()['raw']['related_questions']
        citations = response.model_dump()['raw']['citations']
        print("****************************************************************************************")
        print(response.model_dump()['raw']['citations'])
        print("****************************************************************************************")
        formatted_response = format_response(response=response.model_dump())
        return formatted_response, images, questions, citations
    except Exception as e:
        logger.exception(f"Error during fact analysis: {str(e)}")
        return None, None, None, None
    
def get_sources(citations, article_url):
    try:
        source_data = []
        for idx, source in enumerate(citations):
            source_data.append({"id" : idx, "source" : source, 'type' : 'verification'})
            
        source_data.append({"id" : idx + 1, "source" : article_url, 'type' : 'target'})

        return source_data
    except Exception as e:
        logger.exception(f"Error during id'ing claims: {str(e)}")
        return []

def extract_domain(url):
    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]
    domain = url.split("/")[0]
    return domain

@tenacity.retry(stop=tenacity.stop_after_attempt(3), wait=tenacity.wait_fixed(1))
def source_analysis(sources, model_default, article_url):
    try:
        messages_dict = [
            {"role": "system", "content": SOURCE_ANALYSIS_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": SOURCE_ANALYSIS_USER_PROMPT.format(sources=sources),
            },]
        print("**********************************************************************")
        print(sources)
        print("**********************************************************************")

        messages = [ChatMessage(**msg) for msg in messages_dict]
        model_default['response_format']['json_schema']['schema'] = source_format
        model_default['search_domain_filter'] = [f"-{extract_domain(article_url)}"]
        llm = Perplexity(api_key=PPLX_API_KEY, model="sonar-pro", additional_kwargs=model_default)
        response = llm.chat(messages)
        formatted_response = format_response(response=response.model_dump())
        return formatted_response['sources']
    except Exception as e:
        logger.exception(f"Error during fact analysis: {str(e)}")
        return None
    
def store_report(fact_analysis_report, images, questions, source_report, title):
    try:
        report_id = uuid.uuid4()
        report_data = {
            "report_id": str(report_id),
            "title": title,
            "fact_check_report": fact_analysis_report,
            'images' : images,
            'questions' : questions,
            "source_report" : source_report,
            
        }
        report_collection.insert_one(report_data)
        logger.info(f"Report stored successfully with ID: {report_id}")
        return str(report_id)
    except Exception as e:
        logger.exception(f"Failed to store report: {str(e)}")
        return None

def fact_analysis_base(article):
    try:
        article = article['article']
        metadata = get_metadata(article=article)
        
        fact_analysis_report, images, questions, citations = fact_analysis_build(metadata=metadata, model_default=SONAR_PRO_MODEL_DEFAULTS)
        article_url = article.get("url", "")
        source_list = get_sources(citations, article_url)
        source_report = source_analysis(sources=source_list, model_default=SONAR_PRO_MODEL_DEFAULTS, article_url=article_url)
        report_id = store_report(fact_analysis_report, images, questions, source_report, article['title'])
        logger.info(f"Fact analysis base completed")
        return report_id
         
    except Exception as e:
        logger.exception(f"failed to process request : {str(e)}")
        raise e