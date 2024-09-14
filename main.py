import threading
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.mqtt_client import mqtt
from config import Config


app = Flask(__name__)

cors = CORS(
    app=app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

app.config.from_object(Config)

jwt = JWTManager(app)

db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)


if __name__ == "__main__":
    with app.app_context():
        mqtt_thread = threading.Thread(
            target=mqtt.client_connect, daemon=True
        )
        mqtt_thread.start()
    app.run(debug=True)


from app import routes, models
