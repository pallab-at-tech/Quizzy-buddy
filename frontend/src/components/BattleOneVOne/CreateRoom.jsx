import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";

const CreateRoom = ({close}) => {

    const [quizTopicText, setQuizTopicText] = useState("")

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

    return (
        <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">

            <div className="bg-white min-w-[700px] max-w-[700px] p-8 rounded-2xl shadow-2xl border border-gray-200 relative">

                <div className='absolute top-5 right-8'>
                    <RxCross2 onClick={()=>close()} size={26} className='hover:text-blue-500 cursor-pointer'/>
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
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>

                    <textarea
                        name="desc"
                        value={quizTopicText}
                        onChange={(e)=>setQuizTopicText(e.target.value)}
                        placeholder="Write something about your quiz..."
                        className="w-full min-h-[100px] max-h-[100px] p-3 rounded-xl border border-gray-300
                            focus:ring-2 focus:ring-indigo-300 outline-none
                           text-gray-700"
                    >
                    </textarea>
                </div>

                {/* Button */}
                <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl
                       shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                >
                    Create
                </button>
            </div>
        </section>

    )
}

export default CreateRoom
