from cloudAMQPClient import CloudAMQPClient

CLOUDAMQP_URL = "amqp://kmeuftuc:TcE9KYA2slDOG-ozMN2zVkGVrJ8pu7j4@spider.rmq.cloudamqp.com/kmeuftuc"
TEST_QUEUE_NAME = "news"

def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)
    
    # sentMsg = {"test":"test"}
    # client.sendMessage(sentMsg)
    receivedMsg = client.getMessage()

    # assert sentMsg == receivedMsg
    # print ("test_basic passed.")

if __name__ == "__main__":
    test_basic()
