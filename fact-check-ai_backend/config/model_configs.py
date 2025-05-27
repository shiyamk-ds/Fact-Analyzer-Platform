SONAR_PRO_MODEL_DEFAULTS = {
    "max_tokens": 4096,
    "temperature": 0.2,
    "top_p": 0.9,
    "stream": False,
    "return_images": False,
    "return_related_questions": False,
    "response_format": {
        "type": "json_schema",
        "json_schema": {"schema": None},
    },
    "web_search_options": {
        "search_context_size": "low",
    }
}
