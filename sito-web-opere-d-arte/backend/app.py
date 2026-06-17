import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import api

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

app.register_blueprint(api, url_prefix="/api")


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
