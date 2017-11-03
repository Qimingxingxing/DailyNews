from cloudAMQPClient import CloudAMQPClient

CLOUDAMQP_URL = "amqp://nlgunvmq:q3TbyLERkJ_-4TFtpZYRKDGIbO71pK6i@elephant.rmq.cloudamqp.com/nlgunvmq"
TEST_QUEUE_NAME = "ming"

def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)
    
    sentMsg = {"test":"test"}
    client.sendMessage(sentMsg)
    receivedMsg = client.getMessage()

    assert sentMsg == receivedMsg
    print ("test_basic passed.")

if __name__ == "__main__":
    test_basic()
