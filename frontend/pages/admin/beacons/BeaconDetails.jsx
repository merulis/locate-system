import { useState } from "react";

function BeaconDetail({beacon, updateBeacon, deleteBeacon}) {
  const [form, setForm] = useState({
    'device': `${beacon.id_device}`,
    'mqtt': `${beacon.id_mqtt}`,
  })
  const [message, setMessage] = useState('')

  function handleUpdate(e){
    e.preventDefault();

    if (form.device == '' && form.mqtt == '') {
      setMessage('Заполните поля')
      return
    }
    
    const updatedBeacon = { 
      'id': beacon.id, 
      'id_device':form.device, 
      'id_mqtt': form.mqtt
    }
    console.log(updatedBeacon);
    updateBeacon(updatedBeacon)
  };

  function handleDelete () {
    deleteBeacon(beacon.id);
  };

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function handleCancel () {
    setShow(false);
  };

  return (
    <>
      <h2>Детали радиомаяка</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="device">Код прибора:</label>
          <input
            id="device"
            name="device"
            type="text"
            value={form.device}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Код MQTT:</label>
          <input
            id="mqtt"
            name="mqtt"
            type="text"
            value={form.mqtt}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Изменить</button>
      </form>
      <button onClick={handleDelete}>Удалить</button>
    </>
  )
}

export default BeaconDetail