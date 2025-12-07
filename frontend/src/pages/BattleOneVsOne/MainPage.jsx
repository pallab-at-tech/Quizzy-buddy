import React, { useEffect, useState } from "react";
import { FaPlus, FaSignInAlt, FaBookOpen } from "react-icons/fa";
import CreateRoom from "../../components/BattleOneVOne/CreateRoom";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import JoinRoom from "../../components/BattleOneVOne/JoinRoom";
import { useNavigate } from "react-router-dom";

const MainPage = () => {

    const [createRoomOpen, setCreateRoomOpen] = useState(false)
    const [joinRoomOpen, setjoinRoomOpen] = useState(false)

    const [route, setRoute] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const loc = location.pathname.split("/")
        setRoute(loc[loc.length - 1])
    }, [location])

    console.log("cvcvcv",localStorage.getItem("left"))

    return (
        <section className="h-[calc(100vh-70px)] bg-gradient-to-br from-[#eef2ff] to-[#f8fafc]  page-scroll">

            {
                route && route !== "battle-1v1" ? (
                    <Outlet />
                ) : (
                    <div className="w-full max-w-5xl mx-auto py-8">

                        {/* Page Heading */}
                        <div className="text-center mb-14">
                            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                Quiz Battle <span className="text-indigo-600">1 vs 1</span>
                            </h1>
                            <p className="text-gray-600 mt-3 text-lg">
                                Challenge your opponent and prove your knowledge in real time.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 mb-14">
                            {/* Create Room */}
                            <button onClick={() => setCreateRoomOpen(true)} className="bg-white border border-gray-200 p-10 rounded-3xl shadow-sm hover:shadow-xl
                                hover:scale-[1.02] transition-all flex flex-col items-center text-center cursor-pointer">
                                <div className="bg-indigo-600 text-white p-4 rounded-full text-3xl mb-4">
                                    <FaPlus />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Create Room</h2>
                                <p className="text-gray-500 mt-2">Generate a private room & invite your opponent.</p>
                            </button>

                            {/* Join Room */}
                            <button onClick={() => setjoinRoomOpen(true)} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl cursor-pointer
                                border border-gray-200 hover:scale-[1.02] transition-all flex flex-col items-center text-center">
                                <div className="bg-emerald-600 text-white p-4 rounded-full text-3xl mb-4">
                                    <FaSignInAlt />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Join Room</h2>
                                <p className="text-gray-500 mt-2">Enter the room code to start the battle.</p>
                            </button>
                        </div>

                        {/* Rules Section (fixed spacing) */}
                        <div className="mb-4 bg-white rounded-3xl shadow-md px-10 py-10 border border-gray-200">

                            {/* Sub-Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <FaBookOpen className="text-3xl text-indigo-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Quiz Rules</h2>
                            </div>

                            {/* Other content */}
                            <ul className="text-gray-700 text-lg space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    Each question carries <b>5 marks</b>.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    Wrong answer deducts <b>1.5 marks</b>.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    You get <b>10 seconds</b> to answer each question.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    Total <b>10 questions</b> will be provided.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    Faster correct answers give a competitive advantage.
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
