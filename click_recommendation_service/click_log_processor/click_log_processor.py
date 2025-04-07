import logging
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from common.mongodbClient import get_db
from common.kafkaClient import KafkaConsumer, KafkaProducer
from constants import NEWS_CLASSES

# Don't modify this value unless you know what you are doing.
NUM_OF_CLASSES = 17
INITIAL_P = 1.0 / NUM_OF_CLASSES
ALPHA = 0.1

SLEEP_TIME_IN_SECONDS = 1

KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")
LOG_CLICKS_TASK_QUEUE_TOPIC = "tap-news-log-clicks-task-queue"

PREFERENCE_MODEL_TABLE_NAME = "user_preference_model"
NEWS_TABLE_NAME = "news"

kafka_consumer_client = KafkaConsumer(KAFKA_SERVERS, LOG_CLICKS_TASK_QUEUE_TOPIC)
kafka_producer_client = KafkaProducer(KAFKA_SERVERS, LOG_CLICKS_TASK_QUEUE_TOPIC)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        return

    if "userId" not in msg or "newsId" not in msg or "timestamp" not in msg:
        return

    user_id = msg["userId"]
    news_id = msg["newsId"]

    # Update user's preference
    db = get_db()
    model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({"userId": user_id})

    # If model not exists, create a new one
    if model is None:
        model = {"userId": user_id, "preference": {news_class: INITIAL_P for news_class in NEWS_CLASSES}}

    logger.info("Updating preference model for user: %s", user_id)

    # Update model using time decaying method
    news = db[NEWS_TABLE_NAME].find_one({"digest": news_id})
    if news is None or "class" not in news or news["class"] not in NEWS_CLASSES:
        return

    click_class = news["class"]

    # Update the clicked one.
    old_p = model["preference"][click_class]
    model["preference"][click_class] = float((1 - ALPHA) * old_p + ALPHA)

    # Update not clicked classes.
    for news_class in model["preference"]:
        if news_class != click_class:
            old_p = model["preference"][news_class]
            model["preference"][news_class] = float((1 - ALPHA) * old_p)

    db[PREFERENCE_MODEL_TABLE_NAME].replace_one({"userId": user_id}, model, upsert=True)


def run():
    while True:
        msg = kafka_consumer_client.getMessage()
        if msg is not None:
            try:
                handle_message(msg)
            except Exception as e:
                logger.error("Error handling message: %s", e)
        kafka_consumer_client.consumer.poll(SLEEP_TIME_IN_SECONDS)


if __name__ == "__main__":
    run()
