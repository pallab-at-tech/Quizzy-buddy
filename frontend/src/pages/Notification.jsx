import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios';
import SummaryApi from '../common/SumarryApi';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setNotificationEmpty } from '../store/notificationSlice';

const Notification = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [data, setData] = useState(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [markedAllLoading, setMarkedAllLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [markLoadSet, setMarkLoadSet] = useState(new Set())

    const fetch_all_notify = async (page = 1) => {
        try {
            setPageLoading(true)

            const response = await Axios({
                ...SummaryApi.get_all_notify,
                params: {
                    page: page,
                    limit: 10
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                setData({
                    notifications: responseData?.notifications,
                    total: responseData?.total,
                    total_page: responseData?.total_page,
                    curr_page: responseData?.curr_page
                })
            }

            setPageLoading(false)
        } catch (error) {
            setPageLoading(false)
            console.log("fetch all notification error", error)
        }
    }

    const fetch_unread_notify = async (page = 1) => {
        try {
            setPageLoading(true)

            const response = await Axios({
                ...SummaryApi.get_unread_notify,
                data: {
                    page: page,
                    limit: 10
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                setData({
                    notifications: responseData?.notification,
                    total: responseData?.count,
                    total_page: responseData?.total_page,
                    curr_page: responseData?.curr_page
                })
            }

            setPageLoading(false)

        } catch (error) {
            setPageLoading(false)
            console.log("fetchedUnread_notification error", error)
        }
    }

    function timeLeftFromNow(targetDate) {

        if (!targetDate) return "N/A"

        const now = new Date();
        const target = new Date(targetDate);
        let diff = target - now; // in ms

        const isPast = diff < 0;
        diff = Math.abs(diff);

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        let result;
        if (seconds < 60) result = `${seconds}s`;
        else if (minutes < 60) result = `${minutes}m`;
        else if (hours < 24) result = `${hours}h`;
        else if (days < 30) result = `${days}d`;
        else if (months < 12) result = `${months}Mon`;
        else result = `${years}Y`;

        return isPast ? `${result} ago` : `in ${result}`;
    }

    const markOneRead = async (notify_id) => {
        if (!notify_id || markLoadSet.has(notify_id)) return
        try {
            setMarkLoadSet((prev) => {
                const newSet = new Set(prev)
                newSet.add(notify_id)
                return newSet
            })

            const response = await Axios({
                ...SummaryApi.marked_one,
                data: {
                    notifyId: notify_id
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                setData((prev) => {
                    if (!prev) return prev

                    return {
                        ...prev,
                        notifications: prev?.notifications?.map((n) =>
                            n?._id === notify_id ? { ...n, isRead: true } : n
                        )
                    }
                })
            }

            setMarkLoadSet((prev) => {
                const newSet = new Set(prev)
                newSet.delete(notify_id)
                return newSet
            })

        } catch (error) {
            setMarkLoadSet((prev) => {
                const newSet = new Set(prev)
                newSet.delete(notify_id)
                return newSet
            })
            console.log("markOneRead error", error)
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
                setData((prev) => {
                    if (!prev) return prev

                    return {
                        ...prev,
                        notifications: prev?.notifications?.map((v) =>
                            v?.isRead ? v : { ...v, isRead: true }
                        )
                    }
                })
                toast.success("Marked All Read")
                dispatch(setNotificationEmpty())
            }

            setMarkedAllLoading(false)

        } catch (error) {
            setMarkedAllLoading(false)
            console.log("markedAllRead error", error)
        }
    }

    useEffect(() => {
        if (activeTab === "all") {
            fetch_all_notify()
        }
        else if (activeTab === "unread") {
            fetch_unread_notify()
        }
    }, [activeTab])

    return (
        <section className='bg-gray-300 relative min-h-[calc(100vh-70px)] max-h-[calc(100vh-70px)] px-4 sm:px-10 py-4 sm:grid sm:grid-cols-[200px_1fr]  gap-4'>

            {/* sideBar */}
            <div className=' mx-2 sm:mx-0'>
                <div className='bg-gray-100 sticky top-[70px] rounded-lg p-0 sm:p-4 flex sm:flex-col flex-row justify-around sm:justify-start w-full sm:gap-2 gap-4 text-gray-300 font-medium h-fit'>

                    {/* for tablet and desktop version */}
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-3 py-2 rounded-md hidden sm:block transition text-sm w-full cursor-pointer  ${activeTab === "all"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-500"
                            }`}
                    >
                        All Notifications
                    </button>

                    <button
                        onClick={() => setActiveTab("unread")}
                        className={`px-3 py-2 hidden sm:block rounded-md transition text-sm w-full cursor-pointer  ${activeTab === "unread"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-500"
                            }`}
                    >
                        Unread Notifications
                    </button>

                    {/* for mobile version */}
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-3 py-2 block sm:hidden rounded-[4px]  transition text-sm w-full cursor-pointer  ${activeTab === "all"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-500"
                            }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setActiveTab("unread")}
                        className={`px-3 py-2 block sm:hidden rounded-[4px] transition text-sm w-full cursor-pointer  ${activeTab === "unread"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-500"
                            }`}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {/* Notification list */}
            <div className={`bg-gray-100 rounded-lg p-5 mx-2 ${activeTab === "all" ? "sm:h-[calc(100vh-110px-32px)] h-[calc(100vh-150px-32px)] mt-4 sm:mt-0" : "sm:h-[calc(100vh-130px-32px)] h-[calc(100vh-175px-32px)] mt-10 sm:mt-8"} sm:mx-0 h-[calc(100vh-110px-32px)] overflow-y-auto`}>
                {
                    pageLoading ? (
                        <div className='flex flex-col gap-4 items-center justify-center mt-[180px]'>
                            <div className='smallSpinLoader'></div>
                            <div className='text-gray-400 sm:text-[22px] text-[18px] pl-2 font-medium select-none'>Fetching...</div>
                        </div>
                    ) : !data || data?.notifications.length === 0 ? (
                        <div className="w-full h-full flex justify-center items-center text-gray-400 sm:text-[22px] text-[18px] font-medium select-none">
                            No Notification have ?!
                        </div>
                    ) : (
                        <div>
                            {
                                activeTab === "unread" && (
                                    <div className="flex justify-start sm:justify-end items-center w-full text-blue-600 text-sm fixed top-[128px] sm:top-[80px] sm:right-14 -right-[22px]">
                                        <button disabled={markedAllLoading} onClick={() => markedAllRead()} className={`w-fit px-2 py-1 bg-white rounded-md ${markedAllLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                            Mark all read
                                        </button>
                                    </div>
                                )
                            }

                            {
                                data?.notifications?.map((v, i) => (
                                    <div key={v?._id} className='bg-gray-300 py-3.5 px-5 rounded-md mb-3 hover:bg-[#bbc2cc] transition flex justify-between'>

                                        <div
                                            onClick={() => {
                                                navigate(`${v?.navigation_link}`)
                                            }}
                                            className="text-gray-200 leading-[1.1] cursor-pointer"
                                        >

                                            <h1 className="font-bold text-[#074dff] text-lg">{v?.notification_type}</h1>
                                            <p className="text-gray-700 text-sm font-medium">
                                                {v?.content}
                                            </p>

                                        </div>

                                        <div className='flex flex-col-reverse sm:flex-row gap-3 items-center justify-end text-sm'>
                                            <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{timeLeftFromNow(v?.createdAt)}</span>
                                            {v?.isRead ? (
                                                <span className="text-gray-500 italic font-medium">Read</span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        markOneRead(v._id)
                                                    }}
                                                    className={`text-blue-700 hover:text-blue-600 font-medium bg-gray-100 w-[60px] h-[29px] px-2 py-1 rounded ${markLoadSet.has(v?._id) ? "cursor-not-allowed" : "cursor-pointer"} transition`}
                                                >
                                                    {
                                                        markLoadSet.has(v?._id) ? <div className='flex items-center justify-center'><div className='markLoader'></div></div> : <div className='flex items-center justify-center'>Mark</div>
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                            
                        </div>
                    )
                }
            </div>

            {
                data && data?.notifications.length !== 0 && (
                    <div className='text-gray-100 flex pl-0 sm:pl-[270px] items-center sm:justify-end w-full absolute right-5 sm:right-10 bottom-2.5 sm:bottom-3'>

                        <div className='flex justify-center items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 text-gray-500 font-medium text-xl'>
                            <FaAngleLeft
                                onClick={() => {
                                    if (Number(data.curr_page) <= 1 || pageLoading) {
                                        return
                                    }
                                    else {
                                        const newPage = Number(data.curr_page - 1)

                                        if (activeTab === "all") {
                                            fetch_all_notify(newPage)
                                        }
                                        else if (activeTab === "unread") {
                                            fetch_unread_notify(newPage)
                                        }
                                    }
                                }}
                                size={28}
                                className={`${Number(data?.curr_page) <= 1 ? "text-gray-500 cursor-none" : "cursor-pointer"}`}
                            />

                            <div className='font-bold text-lg'>
                                {`${data?.curr_page} / ${data?.total_page}`}
                            </div>

                            <FaAngleRight
                                onClick={() => {
                                    if (Number(data?.curr_page) >= Number(data?.total_page) || pageLoading) {
                                        return
                                    }
                                    else {
                                        const newPage = Number(data.curr_page + 1)
                                        if (activeTab === "all") {
                                            fetch_all_notify(newPage)
                                        }
                                        else if (activeTab === "unread") {
                                            fetch_unread_notify(newPage)
                                        }
                                    }
                                }}
                                size={28}
                                className={`${Number(data?.curr_page) >= Number(data?.total_page) ? "text-gray-500 cursor-none" : "cursor-pointer"}`}
                            />
                        </div>
                    </div>
                )
            }

        </section>
    )
}

export default Notification
