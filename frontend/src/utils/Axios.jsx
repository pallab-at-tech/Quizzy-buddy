import axios from 'axios'
import SummaryApi, { baseURL } from '../common/SumarryApi'
import { setLoginGlobal } from '../provider/GlobalProvider'

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

// sending access token in the header
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accesstoken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    }, (error) => {
        return Promise.reject(error);
    }
)

// extend the life span of access token with the  help of refresh token

Axios.interceptors.response.use(
    (response) => {
        return response
    }, async (error) => {
        let originalRequest = error.config

        if (error.response.status === 401 && !originalRequest.retry) {

            originalRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken)

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originalRequest)
                }

                localStorage.clear();
                localStorage.setItem("log", "false")
                setLoginGlobal(false)
                window.location.href = "/sign-in";
            }
            else {
                localStorage.setItem("log", "false")
                setLoginGlobal(false)
            }

        }

        return Promise.reject(error)
    }
)

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refresh_token,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        const accessToken = response.data.data.accessToken
        localStorage.setItem('accesstoken', accessToken)
        localStorage.setItem("log", "true")
        setLoginGlobal(false)
        return accessToken
    } catch (error) {
        console.log(error);
    }
}

export default Axios