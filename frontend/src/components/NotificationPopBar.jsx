import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { PiDotOutlineFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios';
import SummaryApi from '../common/SumarryApi';
import { useDispatch } from 'react-redux';
import { markedOneNotification, setNotificationEmpty } from '../store/notificationSlice';
import toast from 'react-hot-toast';

const NotificationPopBar = ({ close }) => {

    const notifyData = useSelector(state => state?.notification)

    const [markedAllLoading, setMarkedAllLoading] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const markedOne = async (notifyId) => {
        if (!notifyId) return

        try {
            const response = await Axios({
                ...SummaryApi.marked_one,
                data: {
                    notifyId: notifyId
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                dispatch(markedOneNotification({
                    notifyId: notifyId
                }))
            }
        } catch (error) {
            console.log("Notification marked error", error)
        }
    }

    const markedAllRead = async () => {
        try {
            setMarkedAllLoading(true)

            const response = await Axios({
                ...SummaryApi.marked_all
            })

            const { data: responseData } = response

            if (responseData?.success) {
                toast.success("Marked All Read")
                dispatch(setNotificationEmpty())
            }

            setMarkedAllLoading(false)
        } catch (error) {
            setMarkedAllLoading(false)
            console.log("markedAllRead error", error)
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()} className={`${!notifyData?.notification || notifyData?.notification?.length === 0 ? "h-[180px]" : "h-[250px] sm:h-[250px]"}  w-[250px] sm:w-[350px] grid grid-rows-[40px_1fr_30px] bg-white text-gray-900 absolute -left-[230px] sm:-left-[300px] top-9 rounded-md sm:px-5 px-3 py-2 shadow-lg overflow-y-auto`}>

            <div className="sm:flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-700">Notifications</h1>
                <button disabled={markedAllLoading} onClick={() => markedAllRead()} className={`text-[15px] text-blue-600 hover:text-blue-500 ${markedAllLoading ? "cursor-not-allowed" : "cursor-pointer"} ${!notifyData?.notification || notifyData?.notification?.length === 0 ? "hidden" : "hidden sm:block"}`}>Marked all read</button>
            </div>

            {!notifyData?.notification || notifyData?.notification?.length === 0 && (
                <div className="relative">
                    <div className="text-gray-500 flex flex-col justify-center items-center h-[60px] sm:h-[80px] pb-4">
                        <p className="select-none">No New Notifications!</p>
                    </div>
                    <p onClick={() => {
                        navigate("/notification")
                        close()
                    }}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 underline absolute text-[11px] sm:text-sm -bottom-4 sm:-bottom-2 right-2 cursor-pointer">
                        See old notification
                    </p>
                </div>
            )}

            <ul className="overflow-y-auto decrease-Width-slidebar">
                {notifyData?.notification && notifyData?.notification?.map((n) => (
                    <li
                        key={n._id}
                        className="px-2 py-2.5 rounded-md bg-blue-50 hover:bg-cyan-100 transition-colors duration-200 cursor-pointer flex justify-between gap-y-2 items-start  mb-1.5"
                    >
                        <PiDotOutlineFill size={20} className="text-blue-600" />

                        <div
                            className="max-w-[180px] sm:max-w-[190px] leading-[1.1] text-[15px]"
                            onClick={() => {
                                if (n?.navigation_link) {
                                    navigate(n?.navigation_link)
                                }
                            }}
                        >
                            {n.content}
                        </div>
                        <button
                            className="text-sm text-blue-600 ml-2 cursor-pointer sm:block hidden sm:self-center hover:underline"
                            onClick={() => markedOne(n._id)}
                        >
                            Mark read
                        </button>
                    </li>
                ))}
            </ul>

            {notifyData?.notification && notifyData?.notification?.length > 0 && (
                <div className="flex justify-between sm:justify-center items-center px-2 text-sm">
                    <button
                        className="text-blue-600 hover:text-blue-500 font-semibold block underline cursor-pointer"
                        onClick={() => {
                            navigate("/notification")
                            close()
                        }}
                    >
                        See more
                    </button>

                    <button className="sm:hidden block text-blue-600 hover:text-blue-500 font-semibold underline cursor-pointer">Marked all read</button>
                </div>
            )}
        </div>
    )
}

export default NotificationPopBar
