import $api from "../api/api";

export default class MapService {
    static async get_position() {
        return $api.get('/v1/api/get_positions')
    }

    static async get_all_last_position() {
        return $api.get('/v1/api/get_all_last_position')
    }
}