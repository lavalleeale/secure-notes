from dataclasses import dataclass

from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy, sqlalchemy

from . import app

# sqlalchemy instance
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# models
@dataclass
class NoteModel(db.Model):
    __tablename__ = "note"

    id: int
    iv: str
    data: str

    id = db.Column(db.String, primary_key=True)
    iv = db.Column(db.String())
    data = db.Column(db.String())
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))

    def __init__(self, iv, data, id):
        self.iv = iv
        self.data = data
        self.id = id


@dataclass
class UserModel(db.Model):
    __tablename__ = "user"

    id: int
    name: str
    username: str
    password: str

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    username = db.Column(db.String(), unique=True)
    password = db.Column(db.String())
    notes = db.relationship("NoteModel")

    def __init__(self, name, username, password):
        self.name = name
        self.username = username
        self.password = password
        self.notes = []

    def __repr__(self):
        return f"<Class {self.name}>"
