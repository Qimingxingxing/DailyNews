import os
import logging

from newspaper import Article
from common.kafkaClient import KafkaProducer, KafkaConsumer

SLEEP_TIME_IN_SECONDS = 5

# Kafka configuration
KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")
DEDUPE_NEWS_TASK_QUEUE_TOPIC = "dedupe_task"
SCRAPE_NEWS_TASK_QUEUE_TOPIC = "scrape_task"

dedupe_news_queue_client = KafkaProducer(KAFKA_SERVERS, DEDUPE_NEWS_TASK_QUEUE_TOPIC)
scrape_news_queue_client = KafkaConsumer(KAFKA_SERVERS, SCRAPE_NEWS_TASK_QUEUE_TOPIC)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        logger.error("Message is broken")
        return

    task = msg

    try:
        article = Article(task["url"])
        article.download()
        article.parse()
        task["text"] = article.text
        dedupe_news_queue_client.sendMessage(task)
        logger.info("Processed and sent message: %s", task["url"])
    except Exception as e:
        logger.error("Error processing message: %s", e)


def run():
    while True:
        logger.info("Waiting for messages...")
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
            logger.info("Received message: %s", msg)
            if msg is not None:
                try:
                    handle_message(msg)
                    logger.info("Handled message: %s", msg)
                except Exception as e:
                    logger.error("Error handling message: %s", e)
            else:
                logger.info("No message received")
        else:
            logger.warning("Scrape news queue client is None")


if __name__ == "__main__":
    run()
