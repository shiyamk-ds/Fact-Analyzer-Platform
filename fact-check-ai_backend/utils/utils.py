import ast
import json
import logging
import os
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
from io import BytesIO


logger = logging.getLogger(__name__)

def format_response(response):
    response_json = response['message']['content']
    logger.info(f"Raw response JSON: {response_json}")
    try:
        parsed_response = json.loads(response_json)
        logger.info("Response parsed as JSON.")
        return parsed_response
    except json.JSONDecodeError:
        logger.exception("Failed to parse as JSON, attempting literal eval.")
        try:
            parsed_response = ast.literal_eval(response_json)
            logger.info("Response parsed using literal_eval.")
            return parsed_response
        except (SyntaxError, ValueError):
            logger.exception("Failed to parse as JSON or literal_eval. Returning raw response.")
            return response_json
        
def get_secret_key(key):
    try:
        KEYVAULT_URI = 'https://kvfactanalysis.vault.azure.net/'
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=KEYVAULT_URI, credential=credential)
        retrieved_secret = client.get_secret(key)
        logger.info(f"Successfully retrieved secret for key: {key}")
        return retrieved_secret.value
    except Exception as e:
        logger.exception(f"Error retrieving secret for key {key}: {e}")
        raise
    

def download_pdf(blob_name: str, container_name: str):
    try:
        AZURE_STORAGE_ACCOUNT_URL = get_secret_key("SA-ENDPOINT")
        AZURE_STORAGE_KEY = get_secret_key('SA-KEY')
        blob_service_client = BlobServiceClient(
            account_url=AZURE_STORAGE_ACCOUNT_URL, 
            credential=AZURE_STORAGE_KEY
        )
        container_client = blob_service_client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(blob_name)

        stream = BytesIO()
        blob_client.download_blob().readinto(stream)
        stream.seek(0) 
        return stream

    except Exception as e:
        raise