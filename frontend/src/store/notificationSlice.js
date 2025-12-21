import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification: []
}

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setNotificationState: (state, action) => {
            console.log("payload check",action.payload)
            state.notification = action.payload?.notification
        },
        logOut: (state, action) => {
            state.notification = []
        },

    }
})

export const { setNotificationState, logOut } = notificationSlice.actions
export default notificationSlice.reducer