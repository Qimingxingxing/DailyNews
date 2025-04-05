import json
import os
import pickle
import redis
import logging
from bson.json_util import dumps
from datetime import datetime
import news_recommendation_service_client
from common.mongodbClient import get_db
from common.kafkaClient import KafkaProducer

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

NEWS_TABLE_NAME = "news"
CLICK_LOGS_TABLE_NAME = "click_logs"

NEWS_LIMIT = 1000
NEWS_LIST_BATCH_SIZE = 10
USER_NEWS_TIME_OUT_IN_SECONDS = 60

KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")
LOG_CLICKS_TASK_QUEUE_TOPIC = "tap-news-log-clicks-task-queue"

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)
kafka_producer_client = KafkaProducer(KAFKA_SERVERS, LOG_CLICKS_TASK_QUEUE_TOPIC)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_news_summaries_for_user(user_id, page_num):
    logger.info("get_news_summaries_for_user called with user_id: %s, page_num: %s", user_id, page_num)
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, this will return empty list;
        # If end_index is out of range (begin_index is within the range), this
        # will return all remaining news ids.
        sliced_news_digests = news_digests[begin_index:end_index]
        logger.info("Sliced news digests: %s", sliced_news_digests)
        db = get_db()
        sliced_news = list(
            db[NEWS_TABLE_NAME].find({"digest": {"$in": sliced_news_digests}})
        )
    else:
        db = get_db()
        total_news = list(
            db[NEWS_TABLE_NAME].find().sort([("publishedAt", -1)]).limit(NEWS_LIMIT)
        )
        total_news_digests = list(map(lambda x: x["digest"], total_news))
        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    # Get preference for the user
    preference = news_recommendation_service_client.get_preference_for_user(user_id)
    top_preference = None

    if preference is not None and len(preference) > 0:
        top_preference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        if news["class"] == top_preference:
            news["reason"] = "Recommend"
        if news["publishedAt"].date() == datetime.today().date():
            news["time"] = "today"
    return json.loads(dumps(sliced_news))


def log_news_click_for_user(user_id, news_id):
    logger.info("log_news_click_for_user called with user_id: %s, news_id: %s", user_id, news_id)
    message = {"userId": user_id, "newsId": news_id, "timestamp": datetime.utcnow()}

    db = get_db()
    db[CLICK_LOGS_TABLE_NAME].insert(message)

    # Send log task to machine learning service for prediction
    message = {
        "userId": user_id,
        "newsId": news_id,
        "timestamp": str(datetime.utcnow()),
    }
    kafka_producer_client.sendMessage(message)
