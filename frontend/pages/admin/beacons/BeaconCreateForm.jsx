import { useState } from "react"

function BeaconCreate({ sendBeacon, setShow }) {
  const [form, setForm] = useState({
    'device': '',
    'mqtt': '',
  })
  const [message, setMessage] = useState('')

  function handleSubmit(e) {
    e.preventDefault();

    if (form.device == '' && form.mqtt == '') {
      setMessage('Заполните поля')
      return
    }
    sendBeacon(form.device, form.mqtt)
    setForm({
      device: '',
      mqtt: ''
    })
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <>
      <h2>Регистрация маяка</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="device">Код прибора</label>
          <input
            type="text"
            name="device"
            value={form.device}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="mqtt"> Код MQTT</label>
          <input
            type="text"
            name="mqtt"
            value={form.mqtt}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Зарегистрировать маяк</button>
        <button type="button" onClick={handleCancel}>Отмена</button>
      </form>
      {message && <div>{message}</div>}
    </>
  )
}

export default BeaconCreate