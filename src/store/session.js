import { createSelector, createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        authToken: null,
        refreshToken: null,
        authTimestamp: null,
        refreshAuthTimestamp: null
    },
    reducers: {
        login(state, action) {
            const { authToken, refreshToken } = action.payload
            state.authToken = authToken
            state.refreshToken = refreshToken
            state.authTimestamp = Date.now()
            state.refreshAuthTimestamp = Date.now()
            localStorage.setItem("refreshToken", refreshToken)
            localStorage.setItem("refreshAuthTimestamp", Date.now())
        },
        refreshAuthToken(state, action) {
            const { authToken, refreshToken, refreshAuthTimestamp } = action.payload
            state.authToken = authToken
            state.authTimestamp = Date.now()
            state.refreshToken = refreshToken
            state.refreshAuthTimestamp = refreshAuthTimestamp
        },
        logout(state) {
            Object.keys(state).forEach(x => delete state[x])
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("refreshAuthTimestamp")
            localStorage.removeItem("username")
        },
    },
})

const getters = {
    isUserLogged: createSelector((state) => state.session.authToken, (authToken) => Boolean(authToken))
}

export const { login, refreshAuthToken, logout } = sessionSlice.actions
export const { isUserLogged } = getters

export default sessionSlice.reducer