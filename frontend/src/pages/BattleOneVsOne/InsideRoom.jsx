import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useBlocker } from 'react-router-dom'
import { MdOutlineExitToApp } from "react-icons/md";
import { GiDervishSwords } from "react-icons/gi";
import { useGlobalContext } from '../../provider/GlobalProvider';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SumarryApi';
import toast from 'react-hot-toast';

const InsideRoom = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const { socketConnection } = useGlobalContext()

    const user = useSelector(state => state?.user)

    const [isAdminIam, setIsAdminIam] = useState(null)
    const [data, setData] = useState(null)

    const [leftRoomLoading, setLeftRoomLoading] = useState(false)
    const [count, setCount] = useState(null)
    const [startLoading, setStartLoading] = useState(false)

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) => {
            return currentLocation.pathname !== nextLocation.pathname && !localStorage.getItem("left")
        }
    )

    const fetchRoomDetail = async () => {
        if (!location.state) return
        try {
            const response = await Axios({
                ...SummaryApi.room_details,
                params: {
                    roomId: location.state?.roomId
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                const x = {
                    player: responseData?.data?.player,
                    roomId: responseData?.data?.roomId,
                    topic: responseData?.data?.topic
                }
                localStorage.setItem("data", JSON.stringify(x))
                setData(x)
            }

        } catch (error) {
            console.log("Fetch room details Error", error)
        }
    }

    const leftRoom = async () => {
        if (!socketConnection || !data || leftRoomLoading) return

        setLeftRoomLoading(true)

        socketConnection.once("i_left", (leftData) => {
            toast.success(leftData?.message)
            setLeftRoomLoading(false)
            localStorage.setItem("left", "done")
            navigate("/battle-1v1")
        })

        socketConnection.once("battle_leftError", (leftData) => {
            toast.error(leftData?.message)
            setLeftRoomLoading(false)
        })

        socketConnection.emit("battle_left1v1", {
            roomId: data?.roomId,
            user_nano: user?.nanoId
        })
    }

    const startQuiz = () => {

        if (!socketConnection || !data) return

        setStartLoading(true)

        socketConnection.once("battle_start", (startData) => {
            toast.success(startData?.message)
            setStartLoading(false)
        })

        socketConnection.once("battle_startErr", (startData) => {
            toast.error(startData?.message)
            setStartLoading(false)
        })

        socketConnection.emit("battle_start1v1", {
            roomId: data?.roomId
        })
    }

    useEffect(() => {
        if (!user || !data) return

        console.log("admin compute")

        for (let index = 0; index < data?.player?.length; index++) {

            const p = data?.player[index]

            if (user._id === p?.userId) {
                setIsAdminIam(() => {
                    return p?.admin === true
                })
            }
        }
    }, [data, user])

    useEffect(() => {
        fetchRoomDetail()

        const clearLeft = () => {
            localStorage.removeItem("left")
        }

        window.addEventListener("beforeunload", clearLeft)

        return () => {
            clearLeft()
            window.removeEventListener("beforeunload", clearLeft)
        }
    }, [])

    useEffect(() => {
        if (!socketConnection || !location.state?.roomId) return;

        const handleConnect = () => {
            socketConnection.emit("reConnect-room", {
                roomId: location.state.roomId
            });
        };

        socketConnection.on("connect", handleConnect);

        return () => {
            socketConnection.off("connect", handleConnect);
        };
    }, [socketConnection, location.state?.roomId]);

    useEffect(() => {

        if (!socketConnection) return

        socketConnection.once("reconnected_success", (recData) => {
            toast.success(recData?.message)
        })

        socketConnection.once("battle_ready_adT", (socData) => {
            setData((prev) => {
                const updated = {
                    ...prev,
                    player: socData?.player || []
                };

                // Always update localStorage inside the same callback
                localStorage.setItem("data", JSON.stringify(updated));

                return updated;
            })
        })

        socketConnection.once("u_left", (leftData) => {
            toast(leftData?.message, {
                style: {
                    border: '1px solid #713200',
                    padding: '12px',
                    color: '#713200'
                },
                iconTheme: {
                    primary: '#713200',
                    secondary: '#FFFAEE'
                },
                icon: '🤖'
            })
            setData(() => {
                return leftData?.data
            })
        })

        socketConnection.on("battle_countdown", (countData) => {
            console.log("count", countData)
            setCount(countData?.secound_left || null)
        })

        socketConnection.once("battle_started", (startData) => {
            toast.success(startData?.message)
            localStorage.setItem("left","done")
            navigate("/battle-1v1/start",{
                state : {
                    roomId : location.state?.roomId
                }
            })
        })

        return () => {
            socketConnection.off("battle_ready_adT")
            socketConnection.off("u_left")
            socketConnection.off("battle_countdown")
            socketConnection.off("battle_started")
            socketConnection.off("reconnected_success")
        }

    }, [socketConnection])


    return (
        <section className="grid grid-cols-[40%_60%] h-[calc(100vh-70px)] px-12 bg-gray-50">

            {/* LEFT PANEL — Room Details */}
            <div className="px-4 pt-[40px]">

                <div className="p-8 w-full">

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
                        Battle Room Overview
                    </h2>

                    {/* Room ID */}
                    <div className="mb-5">
                        <p className="text-gray-600 text-sm font-medium">Room ID</p>
                        <div className="mt-2 bg-gray-100 p-3 rounded-lg border font-mono text-lg text-gray-800 shadow-inner">
                            {data?.roomId || "N/A"}
                        </div>
                    </div>

                    {/* Topic */}
                    <div className="mb-5">
                        <p className="text-gray-600 text-sm font-medium">Topic</p>
                        <div className="mt-2 bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-gray-900 font-semibold shadow-inner">
                            {data?.topic || "Unknown Topic"}
                        </div>
                    </div>

                    {/* Optional Footer */}
                    {
                        isAdminIam && <div className="pt-6">
                            <button  onClick={() => startQuiz()} className="w-full cursor-pointer flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition">
                                <p>{startLoading ? "Starting..." : "Start Battle"}</p>
                                <GiDervishSwords size={18} />
                            </button>
                        </div>
                    }
                </div>
            </div>

            {/* RIGHT PANEL — Member Details */}
            <div className="px-[150px] pt-[74px] border-l-2 border-l-gray-200">

                <div className='flex justify-between'>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Members
                    </h1>
                    <MdOutlineExitToApp size={28} className='cursor-pointer' onClick={() => leftRoom()} title='Left Room' />
                </div>

                <div className="w-full max-w-lg space-y-4 bg-white shadow-lg border border-gray-200 py-6 px-6 rounded-xl">

                    {data && data?.player?.map((v, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center bg-gray-50 shadow-sm border border-gray-300 rounded-xl p-4 hover:shadow-lg transition"
                        >
                            {/* User Info */}
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-lg">
                                    {v?.userName}
                                </span>
                                <span className="text-sm text-gray-500 font-mono">
                                    {v?.user_nanoId}
                                </span>
                            </div>

                            {/* Admin / Kick / Leave */}
                            <div>
                                {isAdminIam ? (
                                    v?.admin ? (
                                        <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full shadow-sm">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full shadow-sm cursor-pointer hover:bg-red-200">
                                            Kick
                                        </span>
                                    )
                                ) : (
                                    v?.admin ? (
                                        <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full shadow-sm">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full shadow-sm cursor-pointer hover:bg-gray-300">
                                            You
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* NOTE SECTION max-w-lg*/}
                <div className={`${data && data?.player?.length > 1 ? "pt-6 mr-8" : "pt-10"}`}>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-sm">
                        <p className="font-semibold">Note:</p>
                        <p className="text-sm mt-1">
                            Only the room admin can start the battle, remove players, and control room settings.
                            Players may leave the room at any time before the battle begins.
                        </p>
                    </div>
                </div>
            </div>

            {
                blocker.state === "blocked" && (
                    <div className='fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50'>

                        <div className="bg-white min-w-[500px] max-w-[500px] p-8 rounded-3xl shadow-xl border border-gray-100 relative">

                            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                                Are you sure you want to leave?
                            </h1>

                            <h2 className="text-gray-500 mb-6">
                                Leaving will cause you to exit the room.
                            </h2>

                            <div className="flex items-center justify-end gap-4">

                                <button
                                    onClick={() => blocker.reset()}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        leftRoom()
                                        blocker.proceed()
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm transition-all"
                                >
                                    Proceed
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

            {
                count && (
                    <section className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                        <div className="bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-6 animate-scaleIn">

                            {/* Countdown */}
                            <div className="text-6xl font-bold text-blue-600 tracking-wide">
                                {count}
                            </div>

                            {/* Message */}
                            <p className="text-gray-600 text-lg">Quiz starts in {count} seconds...</p>

                            {/* Cancel Button */}
                            <button
                                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </section>
                )
            }
        </section>
    )
}

export default InsideRoom
