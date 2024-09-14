import { observer } from "mobx-react-lite"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../../components/auth_component/AuthProvider"

const setActive = ({ isActive }) => ({ color: isActive ? 'blue' : 'black' })

function AdminLayout() {
  const user = useAuth()
  return (
    <>
    <p>Вы зашли под пользователем: {user.user}</p>
      <nav>
        <ul>
          <li><NavLink to='/admin/beacons' style={setActive}>Панель маяков</NavLink></li>
          <li><NavLink to='/admin/seance' style={setActive}>Панель сеансов</NavLink></li>
          <li><NavLink to='/admin/users' style={setActive}>Панель пользователей</NavLink></li>
          <li><NavLink to='/admin/roles' style={setActive}>Панель ролей</NavLink></li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>Admin panel</footer>
    </>
  )
}

export default observer(AdminLayout)