import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

next_artwork_id = 7
next_order_id = 1
next_user_id = 1

artworks = [
    {
        "id": "1",
        "title": {"en": "Jägermeister No. 5", "it": "Jägermeister Opera N. 5"},
        "description": {"en": "A bold composition of Jägermeister bottle fragments, their deep amber glass arranged in a dynamic explosion frozen in time within crystal-clear resin.", "it": "Una coraggiosa composizione di bottiglie di Jägermeister in frantumi, i cui frammenti di vetro ambrato sono disposti in un'esplosione dinamica congelata nel tempo all'interno di resina cristallina."},
        "price": 100,
        "image": "/images/Jagermeister_Opera_N5.jpeg",
        "category": "whiskey",
        "available": True
    },
    {
        "id": "2",
        "title": {"en": "Campari No. 4", "it": "Campari Opera N. 4"},
        "description": {"en": "Vibrant red shards of Campari bottles create a passionate, fiery visual rhythm. The iconic bitter aperitif transformed into a permanent kaleidoscope of colour.", "it": "Frammenti rossi vibranti di bottiglie di Campari creano un ritmo visivo passionale e infuocato. L'iconico aperitivo amaro trasformato in un caleidoscopio di colore permanente."},
        "price": 100,
        "image": "/images/Campari_Opera_N4.jpeg",
        "category": "aperitivo",
        "available": True
    },
    {
        "id": "3",
        "title": {"en": "Absolut No. 7", "it": "Absolut Opera N. 7"},
        "description": {"en": "Crystal-clear Absolut vodka fragments catch and refract light like ice sculptures. A study in transparency and the beauty of simplicity.", "it": "Frammenti di Absolut vodka cristallina catturano e rifrangono la luce come sculture di ghiaccio. Uno studio sulla trasparenza e la bellezza della semplicità."},
        "price": 100,
        "image": "/images/absolut.jpeg",
        "category": "vodka",
        "available": True
    },
    {
        "id": "4",
        "title": {"en": "Jack Daniel's No. 2", "it": "Jack Daniel's Opera N. 2"},
        "description": {"en": "The unmistakable square bottle of Jack Daniel's broken apart and reassembled in a raw, Tennessee-inspired composition.", "it": "L'inconfondibile bottiglia quadrata di Jack Daniel's frantumata e riassemblata in una composizione grezza ispirata al Tennessee."},
        "price": 100,
        "image": "/images/jack-daniels.jpeg",
        "category": "whiskey",
        "available": True
    },
    {
        "id": "5",
        "title": {"en": "Hendrick's No. 3", "it": "Hendrick's Opera N. 3"},
        "description": {"en": "Pale green shards of Hendrick's gin bottles evoke a whimsical Victorian garden. Cucumber and rose notes imagined through fractured glass.", "it": "Frammenti verde pallido delle bottiglie di gin Hendrick's evocano un giardino vittoriano stravagante. Note di cetriolo e rosa immaginate attraverso il vetro frantumato."},
        "price": 100,
        "image": "/images/hendricks.jpeg",
        "category": "gin",
        "available": True
    },
    {
        "id": "6",
        "title": {"en": "Martini No. 1", "it": "Martini Opera N. 1"},
        "description": {"en": "Elegant Martini bottle fragments arranged in a sophisticated dance of light and shadow. A tribute to Italian design.", "it": "Eleganti frammenti di bottiglie Martini disposti in una danza sofisticata di luce e ombra. Un tributo al design italiano."},
        "price": 100,
        "image": "/images/martini.jpeg",
        "category": "aperitivo",
        "available": True
    },
]

orders = []
users = []

ADMIN_USER = "admin"
ADMIN_PASS = "password"


@app.route("/api/artworks")
def get_artworks():
    return jsonify(artworks)


@app.route("/api/artworks/<artwork_id>")
def get_artwork(artwork_id):
    for a in artworks:
        if a["id"] == artwork_id:
            return jsonify(a)
    return jsonify({"error": "Not found"}), 404


@app.route("/api/artworks/<artwork_id>/sell", methods=["PATCH"])
def sell_artwork(artwork_id):
    for a in artworks:
        if a["id"] == artwork_id:
            a["available"] = False
            return jsonify({"message": "Marked as sold", "id": artwork_id})
    return jsonify({"error": "Not found"}), 404


@app.route("/api/users/register", methods=["POST"])
def register():
    global next_user_id
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password required"}), 400
    for u in users:
        if u["username"] == data["username"]:
            return jsonify({"error": "Username already taken"}), 409
    user = {
        "id": str(next_user_id),
        "username": data["username"],
        "password": data["password"],
        "name": data.get("name", ""),
        "surname": data.get("surname", ""),
        "address": data.get("address", ""),
    }
    users.append(user)
    next_user_id += 1
    return jsonify({"success": True, "user": {k: v for k, v in user.items() if k != "password"}}), 201


@app.route("/api/users/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password required"}), 400
    if data["username"] == ADMIN_USER and data["password"] == ADMIN_PASS:
        return jsonify({"success": True, "is_admin": True, "token": "admin-session"})
    for u in users:
        if u["username"] == data["username"] and u["password"] == data["password"]:
            return jsonify({"success": True, "is_admin": False, "user": {k: v for k, v in u.items() if k != "password"}})
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/orders/user/<user_id>")
def get_user_orders(user_id):
    user_orders = [o for o in orders if o.get("user_id") == user_id]
    return jsonify(user_orders)


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    if data and data.get("username") == ADMIN_USER and data.get("password") == ADMIN_PASS:
        return jsonify({"success": True, "token": "admin-session"})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route("/api/admin/artworks", methods=["POST"])
def admin_add_artwork():
    global next_artwork_id
    data = request.get_json()
    if not data or not data.get("title") or not data.get("price"):
        return jsonify({"error": "Title and price required"}), 400
    artwork = {
        "id": str(next_artwork_id),
        "title": data["title"],
        "description": data.get("description", {"en": "", "it": ""}),
        "price": data["price"],
        "image": data.get("image", ""),
        "category": data.get("category", ""),
        "available": True
    }
    artworks.append(artwork)
    next_artwork_id += 1
    return jsonify(artwork), 201


@app.route("/api/admin/artworks/<artwork_id>", methods=["DELETE"])
def admin_delete_artwork(artwork_id):
    for i, a in enumerate(artworks):
        if a["id"] == artwork_id:
            artworks.pop(i)
            return jsonify({"message": "Deleted", "id": artwork_id})
    return jsonify({"error": "Not found"}), 404


@app.route("/api/orders", methods=["GET"])
def get_orders():
    return jsonify(orders)


@app.route("/api/orders", methods=["POST"])
def create_order():
    global next_order_id
    data = request.get_json()
    order = {"id": str(next_order_id), "status": "confirmed", **data}
    orders.append(order)
    next_order_id += 1
    return jsonify({"order_id": order["id"]}), 201


@app.route("/api/orders/<order_id>/status", methods=["PATCH"])
def update_order(order_id):
    data = request.get_json()
    for o in orders:
        if o["id"] == order_id:
            o["status"] = data.get("status", o["status"])
            return jsonify({"message": "Updated"})
    return jsonify({"error": "Not found"}), 404


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
    if path and os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Server running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
