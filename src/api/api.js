import axios from "axios";
import store from "../store";
import { login as loginAction, refreshAuthToken as refreshAuthTokenAction, logout as logoutAction } from "../store/session";

const authTokenValidTime = 300000 /* 5 min in ms */
const refreshAuthTokenValidTime = 86400000 /* 24 h in ms */
const backendUrl = 'https://aparkapp-s3.herokuapp.com/'

async function checkAuthTokenIsValid(authTimestamp) {
    return authTimestamp + authTokenValidTime > Date.now()
}

async function checkRefreshAuthTokenIsValid(refreshAuthTimestamp) {
    return parseInt(refreshAuthTimestamp) + refreshAuthTokenValidTime > Date.now()
}

export async function refreshAuthToken(refreshToken, refreshAuthTimestamp) {
    if (! await checkRefreshAuthTokenIsValid(refreshAuthTimestamp)) {
        return null
    }
    const newAuthToken = await apiPost('api/refresh-token/', { "refresh": refreshToken }, false)
    const authToken = newAuthToken.data["access"]
    store.dispatch(refreshAuthTokenAction({ authToken, refreshToken, refreshAuthTimestamp }))
    return authToken
}

async function getAuthToken() {
    let authToken = store.getState().session.authToken
    const authTimestamp = store.getState().session.authTimestamp
    const refreshToken = store.getState().session.refreshToken
    const refreshAuthTimestamp = store.getState().session.refreshAuthTimestamp
    if (! await checkAuthTokenIsValid(authTimestamp)) {
        authToken = await refreshAuthToken(refreshToken, refreshAuthTimestamp)
        if (!authToken) {
            store.dispatch(logoutAction())
        }
    }
    return authToken
}

async function apiGet(endpoint, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.get(`${backendUrl}${endpoint}`, { headers })
}

async function apiPut(endpoint, body, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.put(`${backendUrl}${endpoint}`, body, { headers })
}

async function apiPost(endpoint, body, authRequired = true) {
    const headers = authRequired ? {
        'Authorization': `Bearer ${await getAuthToken()}`
    } : {}
    return await axios.post(`${backendUrl}${endpoint}`, body, { headers })
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
    } catch (e) {
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

export async function getUserAnnouncements() {
    const response = await apiGet('api/announcement/user/', true)
    if (response.status === 200) return response.data
    return false
}

export async function getAnnouncement(a_id) {
    const response = await apiGet('api/announcement/' + a_id + '/', true)
    if (response.status === 200) return response.data
    return false
}

export async function getReservationUser(r_id) {
    const response = await apiGet('api/reservation/anouncement/' + r_id + "/", true)
    if (response.status === 200) return response.data
    return false
}

export async function getVehicles() {
    const response = await apiGet('api/users/vehicles/', true)
    if (response.status === 200) return response.data
}

export async function getUser() {
    const response = await apiGet('api/users/', true)
    if (response.status === 200) return response.data
}

export async function getOneUser(id) {
    const response = await apiGet('api/users/' + id + '/', true)
    if (response.status === 200) return response.data
}

export async function getUserRatings(id) {
    const response = await apiGet('api/rating/' + id + '/', true)
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

export async function getAnnouncements() {
    const response = await apiGet('api/announcements/', true)
    if (response.status === 200) return response.data
}

export async function reserve(reserveData) {
    const response = await apiPost('api/reservations/', reserveData, true)
    if (response.status !== 200) return false
    return true
}

export async function updateStatusAnnouncement(a_id, announcement_data) {
    const response = await apiPut('api/announcements/status/' + a_id + "/", announcement_data, true)
    if (response.status === 200) return true
    return false
}

export async function getBookings() {
    const response = await apiGet('api/reservations/', true)
    if (response.status === 200) return response.data
}

export async function getMyAnnnouncements() {
    const response = await apiGet('api/myAnnouncements/', true)
    if (response.status === 200) return response.data
}

export async function editAnnouncement(announcement) {
    try {
        await apiPut('api/announcement/' + announcement.id + "/", announcement, true)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function addCredit(amount) {
    const response = await apiPost('api/userBalanceRecharge/', amount, true)
    if (response.status === 200) return response.data
    return false
}

export async function getMyBalance() {
    const response = await apiGet('api/userAccountBalance/', true)
    if (response.status === 200) return response.data
}

export async function withdrawCredit(amount) {
    try {
        await apiPut('api/userAccountBalance/', amount, true)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function transaction(a_id) {
    try {
        await apiPut('api/balanceTransactions/' + a_id + "/", true)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function register(registerFields) {
    try {
        await apiPost('api/register/', registerFields, false)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function addressToCoordinates(address) {
    const response = await apiPost('api/geolocatorToCoordinates/', address, true)
    if (response.status === 200) return response.data
    return false
}

export async function cancelAnnouncement(a_id, announcement_data) {
    try {
        await apiPut('api/cancel/announcement/' + a_id + '/', announcement_data, true)
    } catch (error) {
        return error.response.data
    }
    return true
}

export async function cancelReservation(a_id, announcement_data) {
    const response = await apiPut('api/cancel/reservation/' + a_id + '/', announcement_data, true)
    if (response.status === 200) return true
    return false
}

export async function registerVehicle(dataVehicle) {
    const response = await apiPost('api/vehicles/', dataVehicle, true)
    if (response.status === 200) return response.data
    return false
}
