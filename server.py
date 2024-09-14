import sys
import signal
import threading
from init import app
from app.mqtt_client.mqtt import client_connect

stop_event = threading.Event()


def signal_handler(signal, frame):
    print("End treading")
    stop_event.set()
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

if __name__ == "__main__":
    with app.app_context():
        mqtt_thread = threading.Thread(
            target=client_connect, args=(stop_event,), daemon=True
        )
        mqtt_thread.start()
    app.run(debug=True)
