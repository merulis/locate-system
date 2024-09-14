import $api from "../api/api";

export default class AdminService {
    static async get_beacons() {
        return $api.get('/v1/api/get_beacons')
    }

    static async get_beacon(id) {
        return $api.get(`/v1/api/beacon/${id}`)
    }

    static async create_beacon(id_device, id_mqtt) {
        return $api.post('/v1/api/create_beacon', {id_device, id_mqtt})
    }

    static async update_beacon(beacon) {
        return $api.put('/v1/api/beacon', beacon)
    }

    static async delete_beacon(id) {
        return $api.delete(`/v1/api/beacon/${id}`)
    }
}   