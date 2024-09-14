import $api from "../api/api";

export default class AuthService {
    static async sign_up(login, password) {
        return $api.post('/auth/sign_up', {login, password})
    }

    static async sign_in(login, password) {
        return $api.post('/auth/sign_in', {login, password})
    }

    static async logout() {
        return $api.post('/auth/logout')
    }
}