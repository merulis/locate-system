import { useState } from "react"
import { observer } from "mobx-react-lite";
import { useAuth } from "./AuthProvider";


function Sign_up() {
  const [form, setForm] = useState({
    login: "",
    password: "",
    confirmPassword: "",
  });

  const store = useAuth()

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }
    else {
      store.sign_up(form.login, form.password)
    }
  };

  if (store.isAuth) {
    return null
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login">Ваше имя:</label>
          <input
            type="text"
            name="login"
            value={form.login}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Введите пароль:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Подтвердите пароль:</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <div>{message}</div>}
    </>
  )
}

export default observer(Sign_up)