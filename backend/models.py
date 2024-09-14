from init import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class Radiobeacon(db.Model):
    __tablename__ = "radiobeacon"

    id = db.Column(db.Integer, primary_key=True)
    id_mqtt = db.Column(db.String(30), unique=True, nullable=False)
    id_device = db.Column(db.String(30), unique=True, nullable=False)

    @staticmethod
    def create(**data):
        new_radiobeacon = Radiobeacon(
            id_mqtt=data.get("id_mqtt"), id_device=data.get("id_device")
        )
        try:
            db.session.add(new_radiobeacon)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def update(**data):
        beacon = Radiobeacon.query.get(data.get("id"))
        beacon.id_device = data.get("id_device")
        beacon.id_mqtt = data.get("id_mqtt")
        try:
            db.session.add(beacon)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def delete(id):
        beacon = Radiobeacon.query.get(id)
        try:
            db.session.delete(beacon)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return None

    def to_json(self):
        return {
            "id": self.id,
            "id_mqtt": self.id_mqtt,
            "id_device": self.id_device,
        }


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(30), unique=True, nullable=False)
    pass_hash = db.Column(db.String(162), nullable=False)

    @staticmethod
    def check_login(login: str) -> bool:
        if User.query.filter(User.login == login).first() is None:
            return True
        else:
            return False

    @staticmethod
    def create(**data):
        if User.check_login(data.get("login")):
            new_user = User(
                login=data.get("login"),
                pass_hash=generate_password_hash(data.get("password")),
            )
            try:
                db.session.add(new_user)
                db.session.commit()
                return new_user
            except Exception as e:
                return e
        else:
            return None

    @staticmethod
    def authorization(**data):
        login = data.get("login")
        password = data.get("password")
        user = User.query.filter(User.login == login).first()
        if check_password_hash(user.pass_hash, password):
            return user
        else:
            return None

    @staticmethod
    def get_json_users():
        json_users = []
        users = User.query.with_entities(User.id, User.login).all()
        for user in users:
            json_users.append({"id": user.id, "login": user.login})
        return json_users


class Seance(db.Model):
    __tablename__ = "seance"

    id = db.Column(db.Integer, primary_key=True)
    id_beacon = db.Column(db.Integer, db.ForeignKey(Radiobeacon.id), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey(User.id))
    date_start = db.Column(db.DateTime, nullable=False)
    date_end = db.Column(db.DateTime, nullable=False)

    @staticmethod
    def create(**data):
        new_link = Seance(
            id_beacon=data.get("id_beacon"),
            id_user=data.get("id_user"),
            date_start=datetime.fromisoformat(data.get("date_start")),
            date_end=datetime.fromisoformat(data.get("date_end")),
        )
        try:
            db.session.add(new_link)
            db.session.commit()
            return True
        except Exception as e:
            print(e)

    @staticmethod
    def update(**data):
        seance = Seance.query.get(data.get("id"))
        seance.id_beacon = data.get("id_beacon")
        seance.id_user = data.get("id_user")
        seance.date_start = data.get("date_start")
        seance.date_end = data.get("date_end")
        try:
            db.session.add(seance)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def delete(id):
        seance = Seance.query.get(id)
        try:
            db.session.delete(seance)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return None

    def to_json_for_ex_app(self):
        login = (
            User.query.with_entities(User.login)
            .filter(User.id == self.id_user).first()
        )

        beacon = (
            Radiobeacon.query.with_entities(Radiobeacon.id_device, Radiobeacon.id_mqtt)
            .filter(Radiobeacon.id == self.id_beacon)
            .first()
        )
        return {
            "id": self.id,
            "id_device": beacon[0],
            "id_mqtt": beacon[1],
            "user_login": login[0],
            "date_start": self.date_start.strftime("%Y-%m-%d, %H:%M"),
            "date_end": self.date_end.strftime("%Y-%m-%d, %H:%M"),
        }

    def to_json(self):
        return {
            "id": self.id,
            "id_beacon": self.id_beacon,
            "id_user": self.id_user,
            "date_start": self.date_start.strftime("%Y-%m-%d, %H:%M"),
            "date_end": self.date_end.strftime("%Y-%m-%d, %H:%M"),
        }


class Position(db.Model):
    __tablename__ = "position"

    id = db.Column(db.Integer, primary_key=True)
    id_seance = db.Column(db.Integer, db.ForeignKey(Seance.id), nullable=False)
    latitude = db.Column(db.Double, nullable=False)
    longitude = db.Column(db.Double, nullable=False)
    date_upload = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False)

    @staticmethod
    def create(**data):
        new_position = Position(
            id_seance=data.get("id_seance"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            date_upload=data.get("date_upload"),
            is_active=data.get("is_active"),
        )
        try:
            db.session.add(new_position)
            db.session.commit()
        except Exception as e:
            print(e)
            return None
        finally:
            return True

    def to_json(self):
        return {
            "id": self.id,
            "id_seance": self.id_seance,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "date_upload": self.date_upload,
            "is_active": self.is_active,
        }


class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    def create(**data):
        new_role = Position(name=data.get("name"))
        try:
            db.session.add(new_role)
            db.session.commit()
        except Exception as e:
            print(e)
            return None
        finally:
            return True


class UserRole(db.Model):
    __tablename__ = "user_role"

    id = db.Column(db.Integer, primary_key=True)
    id_role = db.Column(db.Integer, db.ForeignKey(Role.id), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

    def create(**data):
        new_user_role = Position(
            id_role=data.get("id_role"), id_user=data.get("id_user")
        )
        try:
            db.session.add(new_user_role)
            db.session.commit()
        except Exception as e:
            print(e)
            return None
        finally:
            return True
