import os
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from .models import NoteModel, UserModel, db

notes = Blueprint("notes", __name__)


@notes.route("/getAllNotes", methods=["GET"])
@jwt_required()
def getNotes():
    notes = (
        db.session.query(NoteModel)
        .filter(NoteModel.user_id == get_jwt_identity())
        .all()
    )
    return jsonify(notes)


@notes.route("/addNote", methods=["POST"])
@jwt_required()
def addNote():
    if request.is_json:
        data = request.json
        iv = data["iv"]
        note = data["note"]
        id = data["id"]
        user = (
            db.session.query(UserModel).filter(UserModel.id == get_jwt_identity()).one()
        )
        note = NoteModel(iv, note, id)
        user.notes.append(note)
        db.session.add(note)
        db.session.commit()
        return jsonify(note)
    else:
        return "Request Content-Type must be JSON", 400


@notes.route("/deleteNote/<id>", methods=["DELETE"])
@jwt_required()
def deleteNote(id):
    note = db.session.query(NoteModel).filter(NoteModel.id == id).one()
    if note.user_id == get_jwt_identity():
        db.session.delete(note)
        db.session.commit()
        return ""
    else:
        return "Incorrect Note User ID"


@notes.route("/getNote/<id>", methods=["GET"])
@jwt_required()
def getNote(id):
    note = db.session.query(NoteModel).filter(NoteModel.id == id).one()
    if note.user_id == get_jwt_identity():
        return jsonify(note)
    else:
        return "Incorrect Note User ID"


@notes.route("/updateNote", methods=["PUT"])
@jwt_required()
def updateNote():
    if request.is_json:
        note = (
            db.session.query(NoteModel).filter(NoteModel.id == request.json["id"]).one()
        )
        if note.user_id == get_jwt_identity():
            note.data = request.json["data"]
            note.iv = request.json["iv"]
            db.session.commit()
            return ""
        else:
            return "Incorrect Note User ID"
    else:
        return "Request Content-Type must be JSON", 400