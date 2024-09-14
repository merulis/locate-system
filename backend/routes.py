from datetime import datetime
from sqlalchemy import func, and_
from flask import jsonify, request
from init import app, db
from app import models as m

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
)


@app.route("/v1/api/get_all_last_position", methods=["GET"])
@jwt_required()
def get_all_last_position():
    subquery = (
        db.session.query(
            m.Position.id_seance,
            func.max(m.Position.date_upload).label("max_date_upload"),
        )
        .group_by(m.Position.id_seance)
        .subquery()
    )

    positions = (
        db.session.query(m.Position)
        .join(m.Seance, m.Seance.id == m.Position.id_seance)
        .join(
            subquery,
            and_(
                m.Position.id_seance == subquery.c.id_seance,
                m.Position.date_upload == subquery.c.max_date_upload,
            ),
        )
        .all()
    )

    json_position = list(map(lambda x: x.to_json(), positions))
    print(f"### DATA: {json_position} ###")
    return json_position


@app.route("/v1/api/get_positions_for_user", methods=["GET"])
@jwt_required()
def get_positions_for_user():
    current_user = get_jwt_identity()
    positions = (
        db.session.query(m.Position)
        .join(m.Seance, m.Seance.id == m.Position.id_seance)
        .filter(m.Seance.id_user == current_user.get("id"))
        .order_by(m.Position.date_upload.desc())
        .first()
    )
    json_position = positions.to_json()
    return json_position


@app.route("/v1/api/get_positions_by_select", methods=["POST"])
@jwt_required()
def get_positions_by_select():
    json_data = request.get_json()
    seance = json_data.get("id_seance")
    date_start = datetime.fromisoformat(json_data.get("date_start"))
    date_end = datetime.fromisoformat(json_data.get("date_end"))

    positions = (
        db.session.query(m.Position)
        .join(m.Seance, m.Seance.id == m.Position.id_seance)
        .filter(m.Seance.id == seance)
        .filter(m.Position.date_upload >= date_start)
        .filter(m.Position.date_upload <= date_end)
        .order_by(m.Position.date_upload)
        .all()
    )

    json_position = list(map(lambda x: x.to_json(), positions))
    return json_position


@app.route("/auth/sign_up", methods=["POST"])
def sign_up():
    json_data = request.get_json()
    login = json_data.get("login")

    if m.User.check_login(login):
        current_user = m.User.create(**json_data)
        access_token = create_access_token(
            identity={"id": current_user.id, "login": current_user.login}
        )
        response = jsonify({"access_token": access_token, "user": login})

        return response, 200
    else:
        return jsonify(
            {"sign_up": False, "message": "User already exist"}
            ), 400


@app.route("/auth/sign_in", methods=["POST"])
def sign_in():
    json_data = request.get_json()
    login = json_data.get("login")
    auth_user = m.User.authorization(**json_data)
    if auth_user is not None:
        identity_data = {"id": auth_user.id, "login": auth_user.login}
        access_token = create_access_token(identity=identity_data)
        refresh_token = create_refresh_token(identity=identity_data)
        response = jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": login,
            }
        )
        return response, 200
    else:
        return jsonify({"sign_in": False}), 400


@app.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    response = jsonify(
        {"access_token": access_token, "user": current_user.get("login")}
    )
    return response, 200


@app.route("/auth/logout", methods=["POST"])
def logout():
    response = jsonify({"logout": True})
    return response


@app.route("/v1/api/create_role", methods=["POST"])
def create_role():
    json_data = request.get_json()

    if m.Role.create(**json_data):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/create_user_role", methods=["POST"])
def create_user_role():
    json_data = request.get_json()

    if m.UserRole.create(**json_data):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/create_beacon", methods=["POST"])
def create_beacon():
    json_data = request.get_json()

    if m.Radiobeacon.create(**json_data):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/beacon/<int:id_beacon>", methods=["DELETE"])
def delete_beacon(id_beacon):
    if m.Radiobeacon.delete(id_beacon):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/beacon", methods=["PUT"])
def update_beacon():
    json_data = request.get_json()

    if m.Radiobeacon.update(**json_data):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/beacon/<int:beacon_id>", methods=["GET"])
def get_beacon(beacon_id):
    beacon = m.Radiobeacon.query.get(beacon_id)
    return jsonify(beacon.to_json())


@app.route("/v1/api/get_beacons", methods=["GET"])
def get_beacons():
    beacons = m.Radiobeacon.query.all()
    json_beacons = list(map(lambda x: x.to_json(), beacons))
    print(json_beacons)
    return json_beacons


@app.route("/v1/api/create_seance", methods=["POST"])
def create_seance():
    json_data = request.get_json()
    print(f"### Seacne create data: {json_data} ###")
    if m.Seance.create(**json_data):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/get_seances", methods=["GET"])
def get_seances():
    seances = m.Seance.query.all()
    json_seance = list(map(lambda x: x.to_json_for_ex_app(), seances))
    return json_seance


@app.route("/v1/api/seance/<int:id_seance>", methods=["GET"])
def get_seance(id_seance):
    seance = m.Seance.query.get(id_seance)
    return jsonify(seance.to_json())


@app.route("/v1/api/seance/<int:id_seance>", methods=["DELETE"])
def delete_seance(id_seance):
    if m.Seance.delete(id_seance):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/seance", methods=["PUT"])
def update_seance():
    json_data = request.get_json()
    print(f"### Data {json_data} ###")
    if m.Seance.update(**json_data):
        return jsonify(message="OK"), 200
    else:
        return jsonify(message="Error"), 400


@app.route("/v1/api/get_users", methods=["GET"])
def get_users():
    users = m.User.get_json_users()
    return users
