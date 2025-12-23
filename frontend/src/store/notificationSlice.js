import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification: []
}

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setNotificationState: (state, action) => {
            state.notification = action.payload?.notification
        },
        logOut: (state, action) => {
            state.notification = []
        },
        addNotification: (state, action) => {
            const { notifyData } = action.payload

            if(notifyData){
                const notifyId = state.notification.some((n) => notifyData?._id === n?._id)
                if(!notifyId){
                    state.notification = [notifyData , ...state.notification]
                }
            }
        }

    }
})

export const { setNotificationState, logOut, addNotification } = notificationSlice.actions
export default notificationSlice.reducer