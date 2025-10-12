import { createSlice } from '@reduxjs/toolkit'

const initialValue = {

    _id: "",
    name: "",
    nanoId : "",
    email: "",
    avatar: "",
    verify_email: false,
    curr_participant_info: [],
    old_participant_info: []

}

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.nanoId = action.payload?.nanoId
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.verify_email = action.payload?.verify_email
            state.curr_participant_info = [...action.payload?.curr_participant_info]
            state.old_participant_info = [...action.payload?.old_participant_info]
        },

        setLogOut: (state, action) => {
            state._id = ""
            state.name = ""
            state.nanoId = ""
            state.email = ""
            state.avatar = ""
            state.verify_email = false
            state.curr_participant_info = []
            state.old_participant_info = []
        }

    }
})

export const { setUserDetails , setLogOut } = userSlice.actions
export default userSlice.reducer