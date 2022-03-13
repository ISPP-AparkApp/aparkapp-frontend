import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        username: null,
    },
    reducers: {
        updateUsername(state, action) {
            state.username = action.payload
        },
    },
})

export const { updateUsername } = sessionSlice.actions

export default sessionSlice.reducer