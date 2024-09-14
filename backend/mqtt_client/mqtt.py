import datetime
import json
import paho.mqtt.client as mqtt

from .mqtt_config import Config as c
from .position_handler import add_position_from_mqtt
from init import app


def on_connect(client: mqtt.Client, userdata, flags, reason_code, properties):
    print(f"### ({datetime.datetime.now()}) Connected ###")
    print(f"Connected with result code {reason_code}")
    client.subscribe(c.topics)


def on_subscribe(client, userdata, mid, reason_code_list, properties):
    print(f"Subscribe reason code: {reason_code_list}")


def on_message(client, userdata, message: mqtt.MQTTMessage):
    topic_part = message.topic.split("/")

    print(f"### ({datetime.datetime.now()}) Message id: {message.mid} ###")
    print(f"Topic: {message.topic}")
    print(f"info: {message.info}")
    print(f"State: {message.state}")
    print(f"dup: {message.dup}")
    print(f"Received message: {message.payload.decode()}")

    if topic_part[3] is not None and topic_part[3] == "json":
        payload = json.loads(message.payload.decode())
        if payload.get("type") == "position":
            data = payload.get("payload")
            print(f"Payload: {data}")
            with app.app_context():
                add_position_from_mqtt(str(payload.get("from")), data)


def on_unsubscribe(client, userdata, mid, reason_code_list, properties):
    if len(reason_code_list) == 0 or not reason_code_list[0].is_failure:
        print("unsubscribe succeeded (if SUBACK is received in MQTTv3 it success)")
    else:
        print(f"Broker replied with failure: {reason_code_list[0]}")
    client.disconnect()


def client_connect(stop_event):
    client = mqtt.Client(
        client_id="unique_client",
        callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
    )
    client.on_connect = on_connect
    client.on_subscribe = on_subscribe
    client.on_unsubscribe = on_unsubscribe
    client.on_message = on_message
    client.username_pw_set(c.username, c.password)
    client.connect(c.broker_address, c.port)

    while not stop_event.is_set():
        client.loop()

    client.disconnect()
