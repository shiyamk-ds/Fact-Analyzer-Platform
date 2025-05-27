from firebase_admin import credentials, initialize_app
import json
from firebase_admin import credentials, initialize_app
from utils.utils import get_secret_key
from utils.utils import download_pdf


container_name = get_secret_key("SA-CONTAINERNAME")
blob_name = get_secret_key("SA-BLOBNAME")

    
data = download_pdf(blob_name, container_name)

data.seek(0)
json_content = json.load(data)



cred = credentials.Certificate(json_content)
firebase_app = initialize_app(cred)
print("Firebase initialized")