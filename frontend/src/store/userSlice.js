import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    _id: "",
    name: "",
    nanoId: "",
    email: "",
    avatar: "",
    verify_email: false,
    participant_info: [],
    host_info: [],
    participate_count: 0,
    host_count: 0
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
            state.participant_info = [...action.payload?.participant_info]
            state.host_info = [...action.payload?.host_info]
            state.participate_count = action.payload.participate_count
            state.host_count = action.payload.host_count
        },

        setLogOut: (state, action) => {
            state._id = ""
            state.name = ""
            state.nanoId = ""
            state.email = ""
            state.avatar = ""
            state.verify_email = false
            state.participant_info = []
            state.host_info = []
            state.participate_count = 0
            state.host_count = 0
        },
        setHostDetails: (state, action) => {
            const { data } = action.payload

            if (!data) return

            const isDataAlreadyhave = state.host_info.some((m) => m.quiz_id === data.quiz_id)

            if (!isDataAlreadyhave) {
                state.host_info.push(data)
            }
        },
        setUserFinishQuiz: (state, action) => {
            const { data, participate_count } = action.payload
            if (!data) return

            state.participant_info = [data, ...state.participant_info]
            state.participate_count = participate_count
        }
    }
})

export const { setUserDetails, setLogOut, setHostDetails, setUserFinishQuiz } = userSlice.actions
export default userSlice.reducer