import { useEffect } from "react"
import { useAuth } from "./AuthProvider"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

    
function ProtectedRoute({ children }) {
    const user = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user.isAuth) {
            navigate('/sign_in', { replace: true })
        }
    }, [user])
    return children
}
export default observer(ProtectedRoute)