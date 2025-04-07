import os
import logging
import sys
from openai import OpenAI
client = OpenAI(api_key="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")

# Add the parent directory of 'common' to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

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


# Define allowed categories
ALLOWED_CATEGORIES = ["Politics", "Sports", "Technology", "Health", "Entertainment", "Business", "Science"]


def get_news_category(article_text):
    prompt = f"""Classify the following news article into one of the following categories:
{', '.join(ALLOWED_CATEGORIES)}. If none fit, return "Other".

Article:
{article_text}

Category:"""

    try:
        # Create a completion using the new client style
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or "gpt-3.5-turbo" depending on your access
            messages=[
                {"role": "system", "content": "You are a news article classifier."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=10
        )

        category = completion.choices[0].message.content.strip()
        logger.info("shit", category)  # Log the category for debugging purposes
        if category not in ALLOWED_CATEGORIES:
            category = "Other"
        return category

    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return "Other"


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
        task["class"] = get_news_category(article.text)
        dedupe_news_queue_client.sendMessage(task)
        logger.info("Processed and sent message: %s", task["url"])
    except Exception as e:
        logger.error("Error processing message: %s", e)


def run():
    while True:
        logger.info("Waiting for messages...")
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
            if msg is not None:
                try:
                    handle_message(msg)
                    logger.info("Handled message")
                except Exception as e:
                    logger.error("Error handling message: %s", e)
            else:
                logger.info("No message received")
        else:
            logger.warning("Scrape news queue client is None")


if __name__ == "__main__":
    run()
