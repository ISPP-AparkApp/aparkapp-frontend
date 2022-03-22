import axios from "axios";
import store from "../store";
import { login as loginAction, refreshAuthToken as refreshAuthTokenAction } from "../store/session";

const authTokenValidTime = 300000 /* 5 min in ms */
const refreshAuthTokenValidTime = 86400000 /* 24 h in ms */
const backendUrl = 'http://127.0.0.1:8000/'

async function checkAuthTokenIsValid() {
    const authTimestamp = await store.getState().session.authTimestamp
    return authTimestamp + authTokenValidTime > Date.now()
}

async function checkRefreshAuthTokenIsValid() {
    const refreshAuthTimestamp = await store.getState().session.refreshAuthTimestamp
    return refreshAuthTimestamp + refreshAuthTokenValidTime > Date.now()
}

async function refreshAuthToken() {
    const refreshToken = await store.getState().session.refreshToken
    if (!refreshToken) {
        throw new Error("No refreshToken provided")
    } else if (!await checkRefreshAuthTokenIsValid()) {
        throw new Error("Refresh token expired")
    }

    const newAuthToken = await apiPost('api/refresh-token/', { "refresh": refreshToken }, false)
    const authToken = newAuthToken.data["access"]
    store.dispatch(refreshAuthTokenAction(authToken))
    return authToken
}

async function getAuthToken() {
    let authToken = await store.getState().session.authToken
    if (!authToken) {
        throw new Error("No authToken provided")
    } else if (!await checkAuthTokenIsValid()) {
        authToken = await refreshAuthToken()
        store.dispatch(refreshAuthTokenAction(authToken))
    }
    return authToken
}

async function apiGet(endpoint, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.get(`${backendUrl}${endpoint}`, { headers })
}

async function apiPost(endpoint, body, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.post(`${backendUrl}${endpoint}`, body, { headers })
}

async function apiPut(endpoint, body, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.put(`${backendUrl}${endpoint}`, body, { headers })
}

async function apiDelete(endpoint, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.delete(`${backendUrl}${endpoint}`, { headers })
}

// The idea is to export the functions used in the views
export async function login(username, password) {
    let response
    try {
        response = await apiPost('api/login/', { "username": username, "password": password }, false)
    } catch(e) {
        return false
    }
    const { refresh: refreshToken, access: authToken } = response.data
    store.dispatch(loginAction({ authToken, refreshToken }))

    return true
}

export async function publish(announcementData) {
    try {
        await apiPost('api/announcements/', announcementData, true)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function getVehicles() {
    const response = await apiGet('api/users/vehicles/', true)
    if (response.status === 200) return response.data
}

export async function getUser() {
    const response = await apiGet('api/users/', true)
    if (response.status === 200) return response.data
}

export async function getProfile() {
    const response = await apiGet('api/profiles/', true)
    if (response.status === 200) return response.data
}

export async function deleteVehicle(v_id) {
    const response = await apiDelete('api/vehicles/' + v_id + "/", true)
    if (response.status === 204) return true
    return false
}

export async function updateVehicle(v_id, vehicle_data) {
    const response = await apiPut('api/vehicles/' + v_id + "/", vehicle_data, true)
    if (response.status === 204) return true
    return false
}

export async function updateUser(user_data) {
    const response = await apiPut('api/users/', user_data, true)
    if (response.status === 200) return true
    return false
}

export async function updateProfile(profile_data) {
    const response = await apiPut('api/profiles/', profile_data, true)
    if (response.status === 200) return true
    return false
}
