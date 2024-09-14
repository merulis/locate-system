import { useEffect } from "react";
import { NavLink, Outlet } from 'react-router-dom'
import { observer } from "mobx-react-lite";
import { useAuth } from "../components/auth_component/AuthProvider";

const setActive = ({ isActive }) => ({ color: isActive ? 'blue' : 'black' })

function Layout() {
  const store = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  return (
    <>
      <h3>Radiobeacon locate system</h3>
      <nav>
        <ul>
          <li><NavLink to="/" style={setActive}>Главная страница</NavLink></li>
          {store.isAuth ? (<li><NavLink to="/map" style={setActive}>Карта</NavLink></li>
          ) : (
            null
          )}
        </ul>
        <ul>
          {store.isAuth ? (
            <>
              <p>Пользователь: {store.user}</p>
              <li><button onClick={() => store.logout()}>Выйти</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/sign_in" style={setActive}>Войти</NavLink></li>
              <li><NavLink to="/sign_up" style={setActive}>Регистрация</NavLink></li>
            </>
          )}
        </ul>
        <ul><li><NavLink to='/admin' style={setActive}> Административная панель</NavLink></li></ul>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>2024</footer>
    </>
  )
}

export default observer(Layout)