from flask import Blueprint, request, jsonify
from models import Artwork, Order
from bson import ObjectId
import json

api = Blueprint("api", __name__)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)


def serialize_artwork(art):
    return {
        "id": str(art["_id"]),
        "title": art.get("title", {"en": "", "it": ""}),
        "description": art.get("description", {"en": "", "it": ""}),
        "price": art.get("price", 0),
        "image": art.get("image", ""),
        "category": art.get("category", ""),
    }


@api.route("/artworks", methods=["GET"])
def get_artworks():
    artworks = Artwork.get_all()
    return jsonify([serialize_artwork(a) for a in artworks])


@api.route("/artworks/<artwork_id>", methods=["GET"])
def get_artwork(artwork_id):
    art = Artwork.get_by_id(artwork_id)
    if not art:
        return jsonify({"error": "Artwork not found"}), 404
    return jsonify(serialize_artwork(art))


@api.route("/orders", methods=["GET"])
def get_orders():
    orders = Order.get_all()
    for o in orders:
        o["_id"] = str(o["_id"])
        o["items"] = [
            {**item, "artwork_id": str(item["artwork_id"])}
            for item in o.get("items", [])
        ]
    return jsonify(orders)


@api.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json()
    if not data or "items" not in data:
        return jsonify({"error": "Invalid order data"}), 400
    result = Order.create(data)
    return jsonify({"order_id": str(result.inserted_id)}), 201


@api.route("/orders/<order_id>/status", methods=["PATCH"])
def update_order_status(order_id):
    data = request.get_json()
    if not data or "status" not in data:
        return jsonify({"error": "Status required"}), 400
    Order.update_status(order_id, data["status"])
    return jsonify({"message": "Order updated"})
