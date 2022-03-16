import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        username: null,
        authToken: null,
        refreshToken: null,
        authTimestamp: null,
        refreshAuthTimestamp: null
    },
    reducers: {
        updateUsername(state, action) {
            state.username = action.payload
        },
        updateAuthToken(state, action) {
            state.authToken = action.payload
        },
        updateRefreshToken(state, action) {
            state.refreshToken = action.payload
        },
        updateAuthTimestamp(state, action) {
            state.authTimestamp = action.payload
        },
        updateRefreshAuthTimestamp(state, action) {
            state.refreshAuthTimestamp = action.payload
        },
    },
})

export const { updateUsername, updateAuthToken, updateRefreshToken, updateAuthTimestamp, updateRefreshAuthTimestamp } = sessionSlice.actions

export default sessionSlice.reducer