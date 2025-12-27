import React, { useEffect, useState } from "react";
import { FaPlus, FaSignInAlt, FaBookOpen } from "react-icons/fa";
import CreateRoom from "../../components/BattleOneVOne/CreateRoom";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import JoinRoom from "../../components/BattleOneVOne/JoinRoom";

const MainPage = () => {

    const [createRoomOpen, setCreateRoomOpen] = useState(false)
    const [joinRoomOpen, setjoinRoomOpen] = useState(false)

    const [route, setRoute] = useState(null)
    const location = useLocation()

    useEffect(() => {
        const loc = location.pathname.split("/")
        setRoute(loc[loc.length - 1])
    }, [location])

    // clear un-necessary local storage
    useEffect(() => {
        if (localStorage.getItem("left")) {
            localStorage.removeItem("left")
        }
        if (localStorage.getItem("questionSet")) {
            localStorage.removeItem("questionSet")
        }
        if (localStorage.getItem("scoreStats")) {
            localStorage.removeItem("scoreStats")
        }
        if (localStorage.getItem("wait-opp")) {
            localStorage.removeItem("wait-opp")
        }
        if (localStorage.getItem("battle_over")) {
            localStorage.removeItem("battle_over")
        }
        if(localStorage.getItem("data")){
            localStorage.removeItem("data")
        }
    }, [])

    return (
        <section className="h-[calc(100vh-70px)] bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] page-scroll">

            {
                route && route !== "battle-1v1" ? (
                    <Outlet />
                ) : (
                    <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-8">

                        {/* Page Heading */}
                        <div className="text-center mb-6 custom-sm:mb-10 custom-lg:mb-14">
                            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                Quiz Battle <span className="text-indigo-600">1 vs 1</span>
                            </h1>
                            <p className="text-gray-600 mt-2 sm:mt-3 text-lg px-8">
                                Challenge your opponent and prove your knowledge in real time.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid md:grid-cols-2 gap-5 custom-lg:gap-10 mb-6 custom-sm:mb-10 custom-lg:mb-14">
                            {/* Create Room */}
                            <button onClick={() => setCreateRoomOpen(true)} className="bg-white border border-gray-200 p-5 custom-sm:p-8 custom-lg:p-10 rounded-3xl shadow-sm hover:shadow-xl
                                hover:scale-[1.02] transition-all flex flex-col items-center text-center cursor-pointer">
                                <div className="bg-indigo-600 text-white p-4 rounded-full text-3xl mb-4">
                                    <FaPlus />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Create Room</h2>
                                <p className="text-gray-500 mt-2">Generate a private room & invite your opponent.</p>
                            </button>

                            {/* Join Room */}
                            <button onClick={() => setjoinRoomOpen(true)} className="bg-white p-5 custom-sm:p-8 custom-lg:p-10 rounded-3xl shadow-sm hover:shadow-xl cursor-pointer
                                border border-gray-200 hover:scale-[1.02] transition-all flex flex-col items-center text-center">
                                <div className="bg-emerald-600 text-white p-4 rounded-full text-3xl mb-4">
                                    <FaSignInAlt />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Join Room</h2>
                                <p className="text-gray-500 mt-2">Enter the room code to start the battle.</p>
                            </button>
                        </div>

                        {/* Rules Section (fixed spacing) */}
                        <div className="mb-4 bg-white rounded-3xl shadow-md p-6 custom-lg:px-10 custom-lg:py-10 border border-gray-200">

                            {/* Sub-Header */}
                            <div className="flex items-center justify-center gap-3 mb-6 custom-lg:mr-[100px]">
                                <FaBookOpen className="text-2xl sm:text-3xl text-indigo-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Quiz Rules</h2>
                            </div>

                            {/* Other content */}
                            <ul className="text-gray-700 text-base sm:text-lg grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 sm:gap-x-10">
                                
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    <span>
                                        Each question carries <b>5 marks</b>.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    <span>
                                        No <b>Negative</b> marks.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    <span>
                                        You get <b>10 seconds</b> to answer each question.
                                    </span>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    <span>
                                        Total <b>10 questions</b> will be provided.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )
            }

            {
                joinRoomOpen && (
                    <JoinRoom close={() => setjoinRoomOpen(false)} />
                )
            }

            {
                createRoomOpen && (
                    <CreateRoom close={() => setCreateRoomOpen(false)} />
                )
            }
        </section>
    );
};

export default MainPage;
