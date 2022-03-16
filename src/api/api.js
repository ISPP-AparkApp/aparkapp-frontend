import axios from "axios";
import store from "../store";
import { updateAuthToken, updateRefreshToken, updateAuthTimestamp, updateRefreshAuthTimestamp } from "../store/session";

const authTokenValidTime = 900000 /* 15 min in ms */
const refreshAuthTokenValidTime = 86400000 /* 24 h in ms */
const backendUrl = 'http://127.0.0.1:8000/'

function checkAuthTokenIsValid() {
    const authTimestamp = store.getState().session.authTimestamp
    return authTimestamp + authTokenValidTime > Date.now()
}

function checkRefreshAuthTokenIsValid() {
    const refreshAuthTimestamp = store.getState().session.refreshAuthTimestamp
    return refreshAuthTimestamp + refreshAuthTokenValidTime > Date.now()
}

async function refreshAuthToken() {
    const refreshToken = store.getState().session.refreshToken
    if (!refreshToken) {
        throw new Error("No refreshToken provided")
    } else if (!checkRefreshAuthTokenIsValid) {
        throw new Error("Refresh token expired")
    }

    const newAuthToken = await apiPost('/api/refresh-token', { "refresh": refreshToken })
    const authToken = newAuthToken.data["access"]
    store.dispatch(updateAuthToken(authToken))
    store.dispatch(updateAuthTimestamp(Date.now()))
    return authToken
}

function getAuthToken() {
    let authToken = store.getState().session.authToken
    if (!authToken) {
        throw new Error("No authToken provided")
    } else if (!checkAuthTokenIsValid(authToken)) {
        authToken = refreshAuthToken()
        store.dispatch(updateAuthToken(authToken))
    }
    return authToken
}

async function apiGet(endpoint, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${getAuthToken}`
    } : {}
    return await axios.get(`${backendUrl}${endpoint}`, { headers })
}

async function apiPost(endpoint, body, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${getAuthToken}`
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