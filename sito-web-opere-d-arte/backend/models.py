from pymongo import MongoClient
from bson import ObjectId
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
client = MongoClient(MONGO_URI)
db = client.art_shop

class Artwork:
    collection = db.artworks

    @staticmethod
    def get_all():
        return list(Artwork.collection.find())

    @staticmethod
    def get_by_id(artwork_id):
        return Artwork.collection.find_one({"_id": ObjectId(artwork_id)})

    @staticmethod
    def create(data):
        return Artwork.collection.insert_one(data)

    @staticmethod
    def delete(artwork_id):
        return Artwork.collection.delete_one({"_id": ObjectId(artwork_id)})


class Order:
    collection = db.orders

    @staticmethod
    def get_all():
        return list(Order.collection.find())

    @staticmethod
    def create(data):
        data["status"] = "pending"
        return Order.collection.insert_one(data)

    @staticmethod
    def update_status(order_id, status):
        return Order.collection.update_one(
            {"_id": ObjectId(order_id)}, {"$set": {"status": status}}
        )
