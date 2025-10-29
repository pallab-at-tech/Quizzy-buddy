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
    }
}

export default SummaryApi