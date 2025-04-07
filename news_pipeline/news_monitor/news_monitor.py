import datetime
import hashlib
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

import redis
import time
import logging
from common.news_api_client import get_news_from_source
from common.kafkaClient import KafkaProducer

SLEEP_TIME_IN_SECONDS = 5
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3

# Get configuration from environment variables
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Kafka configuration
KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")
SCRAPE_NEWS_TASK_QUEUE_TOPIC = "scrape_task"

NEWS_SOURCES = [
    "bbc-news",
    "bbc-sport",
    "bloomberg",
    "cnn",
    "entertainment-weekly",
    "espn",
    "ign",
    "techcrunch",
    "the-new-york-times",
    "the-wall-street-journal",
    "the-washington-post",
]

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
kafka_client = KafkaProducer(KAFKA_SERVERS, SCRAPE_NEWS_TASK_QUEUE_TOPIC)


def run():
    while True:
        logger.info("Fetching news")
        news_list = get_news_from_source(NEWS_SOURCES)

        num_of_news_news = 0

        for news in news_list:
            news_digest = news["title"].encode("utf-8")
            m = hashlib.md5()
            m.update((news_digest))
            news_digest = m.hexdigest()
            res = redis_client.get(news_digest)
            # if res is None:
            num_of_news_news = num_of_news_news + 1
            news["digest"] = news_digest

            if news["publishedAt"] is None:
                news["published_at"] = datetime.datetime.utcnow().strftime(
                    "%Y-%m-%dT%H:%M:%SZ"
                )
            else:
                news["published_at"] = datetime.datetime.strptime(news["publishedAt"], "%Y-%m-%dT%H:%M:%SZ").strftime(
                    "%Y-%m-%dT%H:%M:%SZ"
                )
                news.pop("publishedAt", None)
            redis_client.set(news_digest, "True")
            redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)

            kafka_client.sendMessage(news)

        logger.info("Fetched %d news.", num_of_news_news)
        # Sleep for a while before next fetch
        time.sleep(SLEEP_TIME_IN_SECONDS)


if __name__ == "__main__":
    run()
