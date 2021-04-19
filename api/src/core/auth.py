from flask import Blueprint, jsonify, request, current_app, make_response
from flask_jwt_extended import set_access_cookies, create_access_token
from datetime import timedelta
import bcrypt

from core.models import UserModel, db
import sqlalchemy

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    if request.is_json:
        data = request.json
        username = data["username"]
        password = data["password"]
        try:
            user = (
                db.session.query(UserModel).filter(UserModel.username == username).one()
            )
            if bcrypt.checkpw(password, user.password):
                resp = make_response({"name": user.name})
                set_access_cookies(
                    resp,
                    create_access_token(identity=user.id),
                    max_age=int(timedelta(days=30).total_seconds()),
                )
                return resp
            else:
                return "Incorrect Password", 401
        except sqlalchemy.exc.NoResultFound:
            if current_app.config["ENV"] != "production":
                resp = make_response({"name": "Tester"})
                set_access_cookies(
                    resp,
                    create_access_token(identity="tester"),
                    max_age=int(timedelta(days=30).total_seconds()),
                )
                return resp
            else:
                return "User Does Not Exist", 401

    else:
        return "Request Content-Type must be JSON", 400


@auth.route("/register", methods=["POST"])
def regester():
    if request.is_json:
        data = request.json
        username = data["username"]
        name = data["name"]
        password = data["password"]
        try:
            user = UserModel(name, username, bcrypt.hashpw(password, bcrypt.gensalt()))
            db.session.add(user)
            db.session.commit()
            resp = make_response({"name": user.name})
            set_access_cookies(
                resp,
                create_access_token(identity=user.id),
                max_age=int(timedelta(days=30).total_seconds()),
            )
            return resp
        except sqlalchemy.exc.IntegrityError:
            return "User Exists", 401

    else:
        return "Request Content-Type must be JSON", 400


@auth.route("/logout", methods=["GET"])
def logout():
    resp = make_response("", 204)
    resp.delete_cookie("access_token_cookie")
    return resp