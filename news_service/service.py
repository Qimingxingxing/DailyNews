import logging
from jsonrpcserver import method, serve
import operations

SERVER_PORT = 4040

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@method
def get_news_summaries_for_user(user_id, page_num):
    logger.info("get_news_summaries_for_user called with user_id: %s, page_num: %s", user_id, page_num)
    return operations.get_news_summaries_for_user(user_id, page_num)


@method
def log_news_click_for_user(user_id, news_id):
    logger.info("log_news_click_for_user called with user_id: %s, news_id: %s", user_id, news_id)
    return operations.log_news_click_for_user(user_id, news_id)


def main():
    logger.info("Starting JSON-RPC server on:%d", SERVER_PORT)
    serve(port=SERVER_PORT)


if __name__ == "__main__":
    main()
