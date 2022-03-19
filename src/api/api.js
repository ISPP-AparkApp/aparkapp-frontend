import axios from "axios";
import store from "../store";
import { updateAuthToken, updateRefreshToken, updateAuthTimestamp, updateRefreshAuthTimestamp } from "../store/session";

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
    store.dispatch(updateAuthToken(authToken))
    store.dispatch(updateAuthTimestamp(Date.now()))
    return authToken
}

async function getAuthToken() {
    let authToken = await store.getState().session.authToken
    if (!authToken) {
        throw new Error("No authToken provided")
    } else if (!await checkAuthTokenIsValid(authToken)) {
        authToken = await refreshAuthToken()
        store.dispatch(updateAuthToken(authToken))
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

// The idea is to export the functions used in the views
export async function login(username, password) {
    const response = await apiPost('api/login/', { "username": username, "password": password }, false)
    if (response.status !== 200) return false

    const { refresh: refreshToken, access: authToken } = response.data
    store.dispatch(updateAuthToken(authToken))
    store.dispatch(updateRefreshToken(refreshToken))
    store.dispatch(updateAuthTimestamp(Date.now()))
    store.dispatch(updateRefreshAuthTimestamp(Date.now()))

    return true
}

export async function publish(announcementData) {
    let response
    try {
        response = await apiPost('api/announcements/', announcementData, true)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function getVehicles() {
    const response = await apiGet('api/users/vehicles/', true)
    if (response.status === 200) return response.data
}

