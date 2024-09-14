import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios'
import { API_URL } from '../api/api'

class AuthStore {
    isAuth = false
    isLoading = false
    user = null

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool_flag) {
        this.isAuth = bool_flag
    }

    setLoading(bool_flag) {
        this.isLoading = bool_flag
    }

    setUser(user) {
        this.user = user
    }

    async sign_up(login, password) {
        try {
            const response = await AuthService.sign_up(login, password)
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('refresh-token', response.data.refresh_token)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async sign_in(login, password) {
        try {
            const response = await AuthService.sign_in(login, password)
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async checkAuth() {
        const refreshURL = `${API_URL}/auth/refresh`
        const refreshConfig = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
            }
        }
        try {
            const response = await axios.post(refreshURL, {}, refreshConfig)
            localStorage.setItem('token', response.data.access_token)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e)
        }
    }
}

export default AuthStore