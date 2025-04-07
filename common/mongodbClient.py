from pymongo import MongoClient

MONGO_DB_HOST = "localhost"
MONGO_DB_PORT = "27017"
DB_NAME = "test"

client = MongoClient(f"mongodb://{MONGO_DB_HOST}:{MONGO_DB_PORT}/")


def get_db(db=DB_NAME):
    return client[db]
