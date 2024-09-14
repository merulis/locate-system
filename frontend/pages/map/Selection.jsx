import { useState, useEffect } from 'react';


function Selection({ seances, fetchPositionBySelect, setShow }) {
  const [form, setForm] = useState({
    seance: '',
    date_start: '',
    date_end: ''
  })

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function handleSelect(e) {
    e.preventDefault();

    const seance = {
      id_seance: form.seance,
      date_start: form.date_start,
      date_end: form.date_end
    }

    fetchPositionBySelect(seance)
    setForm(null)
    setShow(false)
  }

  function handleClose() {
    setShow(false)
  }

  return (
    <>
      <form onSubmit={handleSelect}>
        <h2>Выборка</h2>

        <div>
          <label htmlFor="seance">Сеанс</label>
          <select
            id="seance"
            name="seance"
            value={form.seance}
            onChange={handleChange}
            required
          >

            <option value="">Выберите сеанс...</option>
            {seances?.map((seance) => (
              <option
                key={seance.id}
                value={seance.id}

              >
                Сеанс: {seance.id} | Пользователь: {seance.user_login} | Маяк: {seance.id_mqtt}
              </option>
            ))}
            {seances.length === 0 && (
              <option value="" disabled>Сеансы не загружены</option>
            )}
          </select>
          <small>
            Выберите сеанс из списка. Информация о пользователе и маяке, связанным с сеансом, доступна в подсказках.
          </small>
        </div>

        <div>
          <label htmlFor="date_start">Время начала выборки</label>
          <input
            type="datetime-local"
            name="date_start"
            value={form.date_start}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="date_end">Время окончания выборки</label>
          <input
            type="datetime-local"
            name="date_end"
            value={form.date_end}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Запросить</button>
        <button type="button" onClick={handleClose}>Закрыть</button>
      </form>
    </>
  )
}

export default Selection