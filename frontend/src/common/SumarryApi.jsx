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
    forgot_password : {
        url : "/api/forgot-password",
        method : "put"
    },
    otp_verification : {
        url : "/api/verify-forgot-password",
        method : "put"
    },
    reset_password : {
        url : "/api/reset-password",
        method : "put"
    },
    user_Details : {
        url : "/api/user-details",
        method : "get"
    }
}

export default SummaryApi