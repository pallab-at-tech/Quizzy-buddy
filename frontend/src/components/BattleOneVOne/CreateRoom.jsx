import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useGlobalContext } from '../../provider/GlobalProvider';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateRoom = ({ close }) => {

    const { socketConnection } = useGlobalContext()
    const user = useSelector(state => state?.user)
    const navigate = useNavigate()

    const [quizTopicText, setQuizTopicText] = useState("")
    const [quiz_level, setQuiz_level] = useState("")

    const [createLoading, setCreateLoading] = useState(false)
    const [buttonText, setButtonText] = useState("Creating...")

    const Topic = [
        {
            id: 0,
            header: "General Knowledge",
            desc: "Covers world facts, inventions, capitals, politics, history."
        },
        {
            id: 1,
            header: "Science & Technology",
            desc: "Physics, chemistry, biology, gadgets, tech trends."
        },
        {
            id: 3,
            header: "Movies & Entertainment",
            desc: "Bollywood, Hollywood, actors, awards, famous scenes.",
        },
        {
            id: 2,
            header: "Sports",
            desc: "Cricket, football, Olympics, players, records."
        },
        {
            id: 4,
            header: "History",
            desc: "Ancient civilizations, wars, kings, independence history."
        },
        {
            id: 5,
            header: "Geography",
            desc: "Countries, mountains, rivers, climate, world maps."
        },
        {
            id: 6,
            header: "Mathematics",
            desc: "Algebra, arithmetic, puzzles, logic math."
        },
        {
            id: 8,
            header: "Current Affairs",
            desc: "Latest events, news, global happenings (last 6–12 months)."
        },
        {
            id: 7,
            header: "Computers & Programming",
            desc: "Coding basics, algorithms, databases."
        },
        {
            id: 9,
            header: "Mythology / Culture",
            desc: "Greek mythology, Indian mythology, religious stories."
        }
    ]

    const createRoomController = async () => {

        if (!socketConnection) return
        if (!quizTopicText.trim()) {
            toast.error("You haven't choose any topic yet!")
            return
        }

        if (!quiz_level.trim()) {
            toast.error("Please select quiz level")
            return
        }

        setCreateLoading(true)

        try {
            socketConnection.once("room_created", (data) => {
                toast.success(data?.message)
                const url = `/battle-1v1/${data?.battleId}-${data?.roomId}`
                setCreateLoading(false)
                close()

                navigate(url, {
                    state: {
                        roomId: data?.roomId,
                        topic : data?.topic,
                        player : data?.player
                    }
                })
            })

            socketConnection.once("battleError", (data) => {
                toast.error(data?.message)
                setCreateLoading(false)
            })

            socketConnection.emit("create_room1V1", {
                user_nanoId: user?.nanoId,
                topic: quizTopicText,
                difficulty: quiz_level,
                userName : user?.name
            })

        } catch (error) {
            console.log("createRoomController error", error)
            setCreateLoading(false)
        }
    }

    const buttonFunc = () => {
        const run = [
            "Creating...",
            "Looking setUp...",
            "Generating question...",
            "Wait a few sec...",
            "Creating..."
        ]

        let index = 0

        setButtonText("Creating...")

        const interval = setInterval(() => {

            if (!createLoading) {
                clearInterval(interval)
                return
            }

            if (index >= run.length) {
                setButtonText(run[run.length - 1])
            }
            else {
                setButtonText(run[index])
                index++
            }

        }, 4000);

        return interval
    }

    useEffect(() => {

        let intervalId;

        if (createLoading) {
            intervalId = buttonFunc()
        }
        else {
            setButtonText("Create")
        }

        return () => clearInterval(intervalId)

    }, [createLoading])

    return (
        <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">

            <div className="bg-white min-w-[700px] max-w-[700px] p-8 rounded-2xl shadow-2xl border border-gray-200 relative">

                <div className='absolute top-5 right-8'>
                    <RxCross2 onClick={() => close()} size={26} className='hover:text-blue-500 cursor-pointer' />
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Few Setup To Go...
                </h1>

                {/* Choose Topic */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Choose Topic</h2>
                    <div className="flex flex-wrap gap-2">
                        {Topic.map((v, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setQuizTopicText(() => {
                                        return `${v.header}  ----  "${v.desc}"`
                                    })
                                }}
                                className="bg-indigo-100 text-indigo-700 font-medium rounded-full py-1 px-3 cursor-pointer 
                                   hover:bg-indigo-200 transition-all"
                            >
                                {v.header}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description Box */}
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>

                    <textarea
                        name="desc"
                        value={quizTopicText}
                        onChange={(e) => setQuizTopicText(e.target.value)}
                        placeholder="Write something about your quiz..."
                        className="w-full min-h-[100px] max-h-[100px] p-3 rounded-xl border border-gray-300
                            focus:ring-2 focus:ring-indigo-300 outline-none
                           text-gray-700"
                    >
                    </textarea>
                </div>

                {/* level of Quiz */}
                <div className='mb-6'>
                    <h1 className="text-lg font-semibold text-gray-700 mb-2">Level of Question</h1>
                    <div className='border-2 w-fit border-violet-400 rounded-md p-1'>
                        <select className='outline-none' onChange={(e) => setQuiz_level(e.target.value)}>
                            <option value="">Select</option>
                            <option value="beginner">beginner</option>
                            <option value="high school">high school</option>
                            <option value="extream high">extream high</option>
                        </select>
                    </div>
                </div>

                {/* Button */}
                <button
                    disabled={createLoading}
                    onClick={() => createRoomController()}
                    className={`w-full ${createLoading ? "bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700"} text-white font-semibold py-3 rounded-xl
                       shadow-lg transition-all hover:scale-[1.02] ${createLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                    {createLoading ? buttonText : "Create"}
                </button>
            </div>
        </section>
    )
}

export default CreateRoom
