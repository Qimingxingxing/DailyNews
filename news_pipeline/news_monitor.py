import datetime
import hashlib
import redis
import os
import sys
import base64
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import news_api_client
from cloudAMQPClient import CloudAMQPClient
from flask import Flask
app = Flask(__name__)

SLEEP_TIME_IN_SECONDS = 10
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

# TODO: use your own queue
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://kmeuftuc:TcE9KYA2slDOG-ozMN2zVkGVrJ8pu7j4@spider.rmq.cloudamqp.com/kmeuftuc"
SCRAPE_NEWS_TASK_QUEUE_NAME = "news"
NEWS_SOURCES = [
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'cnn',
    'entertainment-weekly',
    'espn',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post'
]

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
cloudAMQP_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
app.run(host='0.0.0.0', port=3002)
while True:
    news_list = news_api_client.getNewsFromSource(NEWS_SOURCES)

    num_of_news_news = 0

    for news in news_list:
        news_digest = news['title'].encode('utf-8')
        m = hashlib.md5()
        m.update((news_digest))
        news_digest = m.hexdigest()
        res = redis_client.get(news_digest)
        if res is None:
            num_of_news_news = num_of_news_news + 1
            news['digest'] = news_digest

            if news['publishedAt'] is None:
                news['publishedAt'] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

            redis_client.set(news_digest, "True")
            redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)

            cloudAMQP_client.sendMessage(news)

    print ("Fetched %d news." % num_of_news_news)

    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)
