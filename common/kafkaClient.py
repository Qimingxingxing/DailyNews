import logging
from confluent_kafka import Producer, Consumer, KafkaError
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class KafkaProducer:
    """Kafka client to handle message queue operations using confluent-kafka"""

    def __init__(self, servers, topic):
        """
        Initialize a Kafka client
        :param servers: Comma separated Kafka bootstrap servers (e.g. 'localhost:9092')
        :param topic: Kafka topic to produce/consume messages
        """
        self.topic = topic
        logger.info(f"Connecting to Kafka at {servers}")
        self.producer = Producer(
            {
                "bootstrap.servers": servers,
                "client.id": "news_pipeline",
            }
        )
        logger.info(f"Producing to topic {topic}")

    def sendMessage(self, message):
        """
        Send message to Kafka
        :param message: message to be sent
        """
        try:
            self.producer.produce(
                self.topic,
                value=json.dumps(message).encode("utf-8"),
                callback=self._delivery_report,
            )
            # Wait for messages to be delivered
            self.producer.flush()
        except Exception as e:
            logger.error(f"Error sending message: {e}")

    def close(self):
        """
        Close Kafka connections
        """
        if self.producer:
            self.producer.flush()
            self.producer.close()

    def _delivery_report(self, err, msg):
        """
        Callback for message delivery reports
        """
        if err is not None:
            logger.error(f"Message delivery failed: {err}")
        else:
            logger.info(f"Message delivered to {msg.topic()} [{msg.partition()}]")


class KafkaConsumer:
    """Kafka client to handle message queue operations using confluent-kafka"""

    def __init__(self, servers, topic):
        """
        Initialize a Kafka client
        :param servers: Comma separated Kafka bootstrap servers (e.g. 'localhost:9092')
        :param topic: Kafka topic to produce/consume messages
        """
        self.topic = topic
        logger.info(f"Connecting to Kafka at {servers}")

        self.consumer = Consumer(
            {
                "bootstrap.servers": servers,
                "group.id": "news_pipeline_group",
                "enable.auto.commit": True,
                "auto.offset.reset": "earliest",
            }
        )
        logger.info(f"Subscribing to topic {topic}")
        self.consumer.subscribe([topic])

    def getMessage(self):
        """
        Get message from Kafka
        :return: message object
        """
        try:
            msg = self.consumer.poll(1.0)
            if msg is None:
                return None
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    logger.info("Reached end of partition")
                else:
                    logger.error(f"Error: {msg.error()}")
                return None

            return json.loads(msg.value().decode("utf-8"))
        except Exception as e:
            logger.error(f"Error receiving message: {e}")
            return None

    def close(self):
        """
        Close Kafka connections
        """
        if self.consumer:
            self.consumer.close()
