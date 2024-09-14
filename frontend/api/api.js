import axios from "axios";

export const API_URL = 'http://127.0.0.1:5000'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await axios.post(url = `${API_URL}/auth/refresh`,
                headers = { 'Authorization': `Bearer ${localStorage.getItem('refresh_token')}` },
                config = { withCredentials: true })
            localStorage.setItem('token', response.data.access_token)
            return $api.request(originalRequest)
        } catch (error) {
            console.log(error);
        }
    }
    throw error
})

export default $api;