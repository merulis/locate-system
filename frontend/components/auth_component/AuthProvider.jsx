import { createContext, useContext } from "react";
import AuthStore from'../../store/store'
import { observer } from "mobx-react-lite";


const authStore = new AuthStore()
 
const AuthContext = createContext(authStore);

function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={authStore}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used whitin an AuthProvider')
    }
    return context
}

export default observer(AuthProvider)
