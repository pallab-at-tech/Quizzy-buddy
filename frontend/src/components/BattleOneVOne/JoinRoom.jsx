import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useGlobalContext } from '../../provider/GlobalProvider'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const JoinRoom = ({ close }) => {

    const [quizJoinLoader, setQuizJoinLoader] = useState(false)
    const [quizCode, setQuizCode] = useState("")
    const navigate = useNavigate()

    const user = useSelector(state => state?.user)

    const { socketConnection } = useGlobalContext()

    const handleJoinedQuiz = () => {

        if (!socketConnection || !user) return
        if (!quizCode.trim()) {
            toast.error("Joined code required!")
            return
        }

        setQuizJoinLoader(true)

        try {
            socketConnection.once("battle_ready_adF", (data) => {
                console.log("socket adf",data)
                toast.success(data?.message)
                const url = `/battle-1v1/${data?.battleId}-${data?.roomId}`
                setQuizJoinLoader(false)
                close()

                navigate(url, {
                    state: {
                        roomId: data?.roomId,
                        topic: data?.topic,
                        player: data?.player
                    }
                })
            })

            // socketConnection.once("battle_ready_adT", (data) => {
            //     console.log("socket adt",data)
            //     toast.success(data?.message)
            //     const url = `/battle-1v1/${data?.battleId}-${data?.roomId}`
            //     setQuizJoinLoader(false)
            //     close()

            //     navigate(url, {
            //         state: {
            //             roomId: data?.roomId,
            //             topic: data?.topic,
            //             player: data?.player
            //         }
            //     })
            // })

            socketConnection.once("Battle_joinErr", (data) => {
                toast.error(data?.message)
                setQuizJoinLoader(false)
            })

            socketConnection.emit("Join_room1v1", {
                roomId: quizCode,
                user_nanoId: user?.nanoId,
                userName: user?.name
            })

        } catch (error) {
            console.log("joinQuiz controller", error)
            setQuizJoinLoader(false)
        }

        // socketConnection.emit("Join_room1v1", {
        //     roomId: quizCode,
        //     user_nanoId: user?.nanoId,
        //     userName: user?.name
        // });
    }

    return (
        <section className='fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50'>

            <div className='bg-white min-w-[500px] max-w-[500px] p-8 rounded-2xl shadow-2xl border border-gray-200 relative'>

                <div className='absolute top-5 right-8'>
                    <RxCross2 onClick={() => close()} size={26} className='hover:text-blue-500 cursor-pointer' />
                </div>

                {/* Header */}
                <div className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    Join Quiz
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-5">
                    Enter the <span className="font-medium text-blue-600">Join Code</span> provided by your quiz host to participate.
                </p>

                {/* Input Field */}
                <div className="mb-6">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                        <i className="ri-hashtag text-gray-400 text-xl pl-3"></i>
                        <input
                            type="text"
                            placeholder="Enter join code..."
                            value={quizCode}
                            onChange={(e) => setQuizCode(e.target.value)}
                            className="flex-1 px-3 py-2 outline-none text-gray-800 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => close()}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={quizJoinLoader}
                        onClick={() => handleJoinedQuiz()}
                        className={`px-5 py-2 ${quizJoinLoader ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}  text-white rounded-lg  transition flex items-center gap-2`}
                    >
                        <i className="text-lg"></i>
                        Join
                    </button>
                </div>
            </div>



        </section>
    )
}

export default JoinRoom
