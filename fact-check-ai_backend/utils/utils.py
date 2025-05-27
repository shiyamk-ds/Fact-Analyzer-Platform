import ast
import json
import logging

logger = logging.getLogger(__name__)

def format_response(response):
    response_json = response['message']['content']
    logger.info(f"Raw response JSON: {response_json}")
    try:
        parsed_response = json.loads(response_json)
        logger.info("Response parsed as JSON.")
        return parsed_response
    except json.JSONDecodeError:
        logger.warning("Failed to parse as JSON, attempting literal eval.")
        try:
            parsed_response = ast.literal_eval(response_json)
            logger.info("Response parsed using literal_eval.")
            return parsed_response
        except (SyntaxError, ValueError):
            logger.error("Failed to parse as JSON or literal_eval. Returning raw response.")
            return response_json