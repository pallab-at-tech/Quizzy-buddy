import React, { useEffect } from 'react'
import { createContext, useContext } from "react";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SumarryApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';


export const GlobalContext = createContext(null)
export const useGlobalContext = () => useContext(GlobalContext)


const GlobalProvider = ({ children }) => {


    const user = useSelector(state => state?.user)
    const dispatch = useDispatch()

    const fetchUserDetails = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.user_Details
            })

            const { data: responseData } = response

            if (responseData?.success) {
                dispatch(setUserDetails(responseData?.data))
            }

        } catch (error) {
            console.log("error from user details from global provider", error)
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, [])

    console.log("user from global.jsx",user)


    return (
        <GlobalContext.Provider value={{ fetchUserDetails }}>

            {
                children
            }

        </GlobalContext.Provider>
    )
}

export default GlobalProvider
