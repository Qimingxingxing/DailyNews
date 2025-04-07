import requests
import json
import logging

URL = "http://localhost:5050/"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_preference_for_user(user_id):
    payload = {
        "jsonrpc": "2.0",
        "method": "get_preference_for_user",
        "params": [user_id],
        "id": 1
    }
    try:
        response = requests.post(URL, json=payload)
        response.raise_for_status()
        result = response.json()
        logger.info("Response: %s", result)
        preference = result.get('result', [])
        logger.info("Preference list: %s", str(preference))
        return preference
    except requests.exceptions.RequestException as e:
        logger.error("Request failed: %s", e)
        return None
