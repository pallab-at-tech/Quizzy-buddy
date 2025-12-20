import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    _id: "",
    name: "",
    nanoId: "",
    email: "",
    avatar: "",
    institute: "",
    backgroundImg: "",
    about: "",
    verify_email: false,
    participant_info: [],
    host_info: [],
    participate_count: 0,
    host_count: 0,
    daily_strict_count: {},
    badge_collection: {}
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
            state.institute = action.payload?.institute
            state.backgroundImg = action.payload?.backgroundImg
            state.about = action.payload?.about
            state.verify_email = action.payload?.verify_email
            state.participant_info = [...action.payload?.participant_info]
            state.host_info = [...action.payload?.host_info]
            state.participate_count = action.payload.participate_count
            state.host_count = action.payload.host_count
            state.daily_strict_count = action.payload.daily_strict_count
            state.badge_collection = action.payload.badge_collection
        },

        setLogOut: (state, action) => {
            state._id = ""
            state.name = ""
            state.nanoId = ""
            state.email = ""
            state.avatar = ""
            state.institute = ""
            state.backgroundImg = ""
            state.about = ""
            state.verify_email = false
            state.participant_info = []
            state.host_info = []
            state.participate_count = 0
            state.host_count = 0
            state.daily_strict_count = {}
            state.badge_collection = {}
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
        },
        manageHostDetails: (state, action) => {
            const { hostId } = action.payload
            state.host_info = state.host_info.filter((h) => h._id !== hostId)
        },
        setDailyQuizFinish: (state, action) => {
            const { data } = action.payload
            state.daily_strict_count = data || {}
        },
        setStateAbout: (state, action) => {
            const { about } = action.payload
            state.about = about
        },
        setBackgroundImage: (state, action) => {
            const { bg } = action.payload
            state.backgroundImg = bg
        },
        setProfileAndData: (state, action) => {
            const { profileImg, name, institute } = action.payload
            state.avatar = profileImg || ""
            state.name = name
            state.institute = institute || ""
        }
    }
})

export const { setUserDetails, setLogOut, setHostDetails, setUserFinishQuiz, manageHostDetails, setDailyQuizFinish, setStateAbout, setBackgroundImage , setProfileAndData } = userSlice.actions
export default userSlice.reducer