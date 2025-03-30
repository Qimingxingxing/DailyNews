import os
import sys

from newspaper import Article

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from common.kafkaClient import KafkaClient
from flask import Flask
app = Flask(__name__)

# TODO: use your own queue.
DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://nlgunvmq:q3TbyLERkJ_-4TFtpZYRKDGIbO71pK6i@elephant.rmq.cloudamqp.com/nlgunvmq"
DEDUPE_NEWS_TASK_QUEUE_NAME = "ming"
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://kmeuftuc:TcE9KYA2slDOG-ozMN2zVkGVrJ8pu7j4@spider.rmq.cloudamqp.com/kmeuftuc"
SCRAPE_NEWS_TASK_QUEUE_NAME = "news"

SLEEP_TIME_IN_SECONDS = 5

dedupe_news_queue_client = KafkaClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = KafkaClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

# Replace CloudAMQP initialization with Kafka
KAFKA_SERVERS = 'localhost:9092'  # Update with your Kafka servers
SCRAPE_NEWS_TASK_QUEUE = 'scrape_news_task_queue_topic'

kafka_client = KafkaClient(KAFKA_SERVERS, SCRAPE_NEWS_TASK_QUEUE)

def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print('message is broken')
        return

    task = msg
    text = None

    article = Article(task['url'])
    article.download()
    article.parse()
    task['text'] = article.text
    dedupe_news_queue_client.sendMessage(task)

def run():
    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
            print("hello")            
            if msg is not None:
                try:
                    handle_message(msg)
                except Exception as e:
                    pass
            scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)

app.run(host='0.0.0.0', port=3001)
