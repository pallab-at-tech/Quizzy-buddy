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
    saved_changes: {
        url: "/api/host/saved-changes",
        method: "post"
    },
    host_details_update: {
        url: "/api/host/host-update",
        method: "post"
    },
    host_time_update: {
        url: "/api/host/host-time-update",
        method: "post"
    },
    fetch_participants_quiz_details: {
        url: "/api/host/participants-details",
        method: "get"
    },
    check_canParticipate: {
        url: "/api/host/check-canParticipate",
        method: "post"
    },
    fetch_questionDetails: {
        url: "/api/host/get-question-details",
        method: "post"
    },
    fetch_leaderBoard_details: {
        url: "/api/leaderboard/fetch-leaderboard",
        method: "get"
    },
    particular_participants_details: {
        url: "/api/particular-Particiapants-details",
        method: "get"
    },
    startQuiz: {
        url: "/api/daily-quiz/fetch-daily-quiz",
        method: "get"
    },
    submitQuiz: {
        url: "/api/daily-quiz/submit-daily-quiz",
        method: "post"
    },
    daily_leaderBoard: {
        url: "/api/leaderboard/fetch-daily-leaderboard",
        method: "get"
    },
    room_details: {
        url: "/api/battle/room-details",
        method: "get"
    },
    add_about: {
        url: "/api/about-update",
        method: "post"
    },
    add_background: {
        url: "/api/background-update",
        method: "post"
    },
    add_profile: {
        url: "/api/profile-update",
        method: "post"
    },
    get_unread_notify: {
        url: "/api/notification/unread-notify",
        method: "post"
    },
    marked_one: {
        url: "/api/notification/marked-one",
        method: "post"
    },
    get_all_notify: {
        url: "/api/notification/get-all-notify",
        method: "get"
    },
    marked_all: {
        url: "/api/notification/marked-all",
        method: "post"
    },
    daily_top2: {
        url: "/api/leaderboard/fetch-top2-daily",
        method: "get"
    }
}

export default SummaryApi