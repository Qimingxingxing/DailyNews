import datetime
import os
import logging
from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer
from common.kafkaClient import KafkaConsumer
from common.mongodbClient import get_db

# Kafka configuration
KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")
DEDUPE_NEWS_TASK_QUEUE_TOPIC = "dedupe_task"

SLEEP_TIME_IN_SECONDS = 1

NEWS_TABLE_NAME = "news"

SAME_NEWS_SIMILARITY_THRESHOLD = 0.9

dedupe_news_queue_client = KafkaConsumer(KAFKA_SERVERS, DEDUPE_NEWS_TASK_QUEUE_TOPIC)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        logger.warning("Received invalid message: %s", msg)
        return
    task = msg
    text = task["text"]
    if text is None:
        logger.warning("Message text is None: %s", task)
        return

    published_at = parser.parse(task["publishedAt"])
    published_at_day_begin = datetime.datetime(
        published_at.year, published_at.month, published_at.day, 0, 0, 0, 0
    )
    published_at_day_end = published_at_day_begin + datetime.timedelta(days=1)
    db = get_db()
    same_day_news_list = list(
        db[NEWS_TABLE_NAME].find(
            {
                "publishedAt": {
                    "$gte": published_at_day_begin,
                    "$lt": published_at_day_end,
                }
            }
        )
    )

    if same_day_news_list is not None and len(same_day_news_list) > 0:
        documents = [news["text"] for news in same_day_news_list]
        documents.insert(0, text)

        tfidf = TfidfVectorizer().fit_transform(documents)
        pairwise_sim = tfidf * tfidf.T

        logger.info("Pairwise similarity matrix: %s", pairwise_sim)

        rows, _ = pairwise_sim.shape

        for row in range(1, rows):
            if pairwise_sim[row, 0] > SAME_NEWS_SIMILARITY_THRESHOLD:
                logger.info(
                    "Duplicated news detected. Ignoring message: %s", task["url"]
                )
                return

    task["publishedAt"] = parser.parse(task["publishedAt"])
    db[NEWS_TABLE_NAME].replace_one({"digest": "abc"}, task, upsert=True)
    logger.info("Inserted/Updated news in database: %s", task["url"])


while True:
    if dedupe_news_queue_client is not None:
        msg = dedupe_news_queue_client.getMessage()
        if msg is not None:
            # Parse and process the task
            try:
                logger.info("Received message: %s", msg)
                handle_message(msg)
            except Exception as e:
                logger.error("Error handling message: %s", e)
                pass
        else:
            logger.info("No message received")
    else:
        logger.warning("Dedupe news queue client is None")
