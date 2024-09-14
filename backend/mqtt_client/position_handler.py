import datetime
from main import models as m


def add_position_from_mqtt(id_mqtt, message):
    # TODO: требуется отграничиваться одним запросом к БД
    # т.к. обращение к БД - ресурсоемкая операция
    beacon = m.Radiobeacon.query.filter(m.Radiobeacon.id_mqtt == id_mqtt).first()
    if beacon is not None:
        seance = m.Seance.query.filter(m.Seance.id_beacon == beacon.id).first()
        if seance is not None:
            lat = float(message.get("latitude_i")) / 10000000.0
            lng = float(message.get("longitude_i")) / 10000000.0
            date = datetime.datetime.fromtimestamp(message.get("time"))
            print(date)
            m.Position.create(
                latitude=lat,
                longitude=lng,
                id_seance=seance.id,
                date_upload=date,
                is_active=True,
            )
