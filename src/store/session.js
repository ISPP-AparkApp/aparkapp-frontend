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
            localStorage.setItem("authToken", authToken)
        },
        refreshAuthToken(state, action) {
            state.refreshToken = action.payload
            state.authTimestamp = Date.now()
        },
        logout(state) {
            Object.keys(state).forEach(x => delete state[x])
            localStorage.removeItem("authToken")
        }
    },
})

const getters = {
    isUserLogged: createSelector((state) => state.session.authToken, (authToken) => Boolean(authToken))
}

export const { login, refreshAuthToken, logout } = sessionSlice.actions
export const { isUserLogged } = getters

export default sessionSlice.reducer