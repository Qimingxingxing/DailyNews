from jsonrpcclient import request
import logging

URL = "http://recommendation-service:5050/"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_preference_for_user(user_id):
    response = request(URL, "get_preference_for_user", user_id)
    logger.info("Response: %s", response)
    preference = response.get('result', [])
    logger.info("Preference list: %s", str(preference))
    return preference
