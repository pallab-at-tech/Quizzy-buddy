import React, { useEffect, useState } from 'react'
import { createContext, useContext } from "react";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SumarryApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';


export const GlobalContext = createContext(null)
export const useGlobalContext = () => useContext(GlobalContext)

export let setLoginGlobal = () => { }

const GlobalProvider = ({ children }) => {

    const [isLogin, setIsLogin] = useState(localStorage.getItem("log") === "true")
    const dispatch = useDispatch()

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
    }, [])


    return (
        <GlobalContext.Provider
            value={{
                fetchUserDetails,
                isLogin,
                loginUser,
                logoutUser
            }}>

            {
                children
            }

        </GlobalContext.Provider>
    )
}

export default GlobalProvider
