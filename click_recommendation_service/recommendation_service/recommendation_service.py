import operator
import logging
import os

from jsonrpcserver import method, serve, Success
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))
from common.mongodbClient import get_db

PREFERENCE_MODEL_TABLE_NAME = "user_preference_model"

SERVER_PORT = 5050

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def is_close(a, b, rel_tol=1e-09, abs_tol=0.0):
    return abs(a - b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)



@method
def get_preference_for_user(user_id):
    logger.info("get_preference_for_user called with user_id: %s", user_id)
    db = get_db()
    model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId': user_id})
    if model is None:
        return Success([])

    sorted_tuples = sorted(model['preference'].items(), key=operator.itemgetter(1), reverse=True)
    sorted_list = [x[0] for x in sorted_tuples]
    sorted_value_list = [x[1] for x in sorted_tuples]

    # If the first preference is same as the last one, the preference makes
    # no sense.
    if is_close(float(sorted_value_list[0]), float(sorted_value_list[-1])):
        return Success([])
    return Success(sorted_list)



def main():
    logger.info("Starting JSON-RPC server on %d", SERVER_PORT)
    serve(port=SERVER_PORT)


if __name__ == "__main__":
    main()
