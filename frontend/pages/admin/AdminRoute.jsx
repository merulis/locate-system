import { useEffect } from "react"
import { useAuth } from "../../components/auth_component/AuthProvider"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"


function AdminRoute({ children }) {
    const user = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user.isAuth) {
            navigate('/sign_in', { replace: true })
        }
    }, [navigate,user])
    return children
}

export default observer(AdminRoute)