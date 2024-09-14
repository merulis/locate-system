from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

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

from app import routes, models
