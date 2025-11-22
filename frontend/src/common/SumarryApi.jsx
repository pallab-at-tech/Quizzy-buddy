export const baseURL = import.meta.env.VITE_BACKEND_API_URL

const SummaryApi = {
    register: {
        url: "/api/register",
        method: "post"
    },
    login: {
        url: "/api/login",
        method: "post"
    },
    refresh_token: {
        url: "/api/refresh-token",
        method: "post"
    },
    forgot_password: {
        url: "/api/forgot-password",
        method: "put"
    },
    otp_verification: {
        url: "/api/verify-forgot-password",
        method: "put"
    },
    reset_password: {
        url: "/api/reset-password",
        method: "put"
    },
    user_Details: {
        url: "/api/user-details",
        method: "get"
    },
    logOut: {
        url: "/api/logout",
        meyhod: "get"
    },
    create_quiz: {
        url: "/api/host/create-quiz",
        method: "post"
    },
    fetch_hostDetails: {
        url: "/api/host/get-host-details",
        method: "post"
    },
    saved_changes : {
        url : "/api/host/saved-changes",
        method : "post"
    },
    host_details_update : {
        url : "/api/host/host-update",
        method : "post"
    },
    host_time_update : {
        url : "/api/host/host-time-update",
        method : "post"
    },
    fetch_participants_quiz_details : {
        url : "/api/host/participants-details",
        method : "get"
    },
    check_canParticipate : {
        url : "/api/host/check-canParticipate",
        method : "post"
    },
    fetch_questionDetails : {
        url : "/api/host/get-question-details",
        method : "post"
    },
    fetch_leaderBoard_details : {
        url : "/api/leaderboard/fetch-leaderboard",
        method : "get"
    },
    score_realised : {
        url : "/api/host/realised-score",
        method : "post"
    },
    particular_participants_details : {
        url : "/api/particular-Particiapants-details",
        method : "get"
    },
    startQuiz : {
        url : "/api/daily-quiz/fetch-daily-quiz",
        method : "get"
    },
    submitQuiz : {
        url : "/api/daily-quiz/submit-daily-quiz",
        method : "post"
    },
    daily_leaderBoard : {
        url : "/api/leaderboard/fetch-daily-leaderboard",
        method : "get"
    }
}

export default SummaryApi