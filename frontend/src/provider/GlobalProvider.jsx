import React, { useEffect, useState } from 'react'
import { createContext, useContext } from "react";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SumarryApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { io } from 'socket.io-client'
import toast from 'react-hot-toast';
import { setNotificationState } from '../store/notificationSlice';


export const GlobalContext = createContext(null)
export const useGlobalContext = () => useContext(GlobalContext)

export let setLoginGlobal = () => { }

const GlobalProvider = ({ children }) => {

    const [isLogin, setIsLogin] = useState(localStorage.getItem("log") === "true")
    const dispatch = useDispatch()
    const user = useSelector(state => state?.user)

    const [socketConnection, setSocketConnection] = useState(null)

    const fetchUserDetails = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.user_Details
            })

            const { data: responseData } = response

            if (responseData?.success) {
                dispatch(setUserDetails(responseData?.data))
                localStorage.setItem('log', 'true')
                setIsLogin(true)
            }
            else {
                localStorage.setItem('log', 'false')
                setIsLogin(false)
            }

        } catch (error) {
            localStorage.setItem('log', 'false')
            setIsLogin(false)
            console.log("error from user details from global provider", error)
        }
    }

    const fetchNotification = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.get_unread_notify
            })

            const { data: responseData } = response
            
            if (responseData?.success) {
                dispatch(setNotificationState({
                    notification: responseData?.notification || []
                }))
            }
        } catch (error) {
            console.log("fetchNotification error", error)
        }
    }

    const loginUser = () => {
        localStorage.setItem("log", "true");
        setIsLogin(true);
    };

    const logoutUser = () => {
        localStorage.removeItem("log");
        setIsLogin(false);
    };

    useEffect(() => {
        setLoginGlobal = setIsLogin
    }, [setIsLogin])

    useEffect(() => {
        fetchUserDetails()
        fetchNotification()
    }, [])


    // socket configure
    useEffect(() => {
        if (user?._id && localStorage.getItem("accesstoken")) {

            const token = localStorage.getItem("accesstoken")

            const socket = io(import.meta.env.VITE_BACKEND_API_URL,
                { auth: { token: token } }
            )

            socket.once("session_expired", (data) => {
                toast.error(data?.message)
                localStorage.clear()
                window.location.href = "/"
            })

            setSocketConnection(socket)
            socket.emit("join_room", user?._id)

            return () => {
                socket.off('session_expired')
                socket.disconnect()
            }
        }
    }, [user?._id, dispatch])


    return (
        <GlobalContext.Provider
            value={{
                fetchUserDetails,
                isLogin,
                loginUser,
                logoutUser,
                socketConnection
            }}>

            {
                children
            }

        </GlobalContext.Provider>
    )
}

export default GlobalProvider
