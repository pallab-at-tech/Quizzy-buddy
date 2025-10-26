import React, { useEffect, useState } from 'react'
import { FaClipboardQuestion } from 'react-icons/fa6'
import { useLocation } from 'react-router-dom'

const StartQuiz = () => {

    const location = useLocation()
    const data = location.state?.data

    const [index, setIndex] = useState(0)
    const [question, setQuestion] = useState(data?.quiz_data[index] || {})

    useEffect(()=>{
        setQuestion(data?.quiz_data[index] || {})
    },[index])

    console.log("data", data)
    console.log("Q", question)

    return (
        <section>
            {
                location.state?.on_Quiz ? (
                    <section>

                        <div className='bg-white shadow-md rounded-xl mx-[300px] my-10 px-10 py-8'>

                            <div className='flex items-center justify-between mb-4'>

                                {/* questions */}
                                <div className="text-2xl font-bold text-gray-800  flex items-center gap-2">
                                    <FaClipboardQuestion size={24} className="text-blue-600" />
                                    {`Question ${index+1} )`}
                                </div>


                                {/* timer */}
                                <div>
                                    timer
                                </div>
                            </div>



                            {/* image */}
                            <div>
                                {
                                    question?.image && (
                                        <div className=''>
                                            <img src={question?.image} alt="" className='w-full max-h-[220px] object-contain rounded-lg border' />
                                        </div>
                                    )
                                }
                            </div>

                            {/* question */}
                            <div className='w-full p-2 text-lg font-semibold  mb-3 text-gray-800'>
                                {question?.question}
                            </div>

                            {/* answer or option */}
                            <div>
                                {
                                    question?.inputBox ? (
                                        <textarea
                                            placeholder="Enter the correct answer..."
                                            className="w-full min-h-[70px] max-h-[150px] p-3 border-2 border-gray-300 rounded-md outline-none transition">
                                        </textarea>
                                    ) : (
                                        <div className="flex flex-col gap-4 mb-3">
                                            {
                                                question?.options.map((v, i) => (
                                                    <label className='flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-purple-50 transition-all'>
                                                        <input
                                                            type="radio"
                                                            name="answer"
                                                            value={i}
                                                            className={`w-5 h-5 accent-purple-600 cursor-pointer`}
                                                        />
                                                        <span className="text-gray-800 text-lg">{v}</span>
                                                    </label>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>

                            {/* next and previous */}
                            <div className="flex items-center justify-between mt-6 w-full">

                                {/* finish */}
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold px-8 py-2.5 rounded-lg transition-all duration-200 active:scale-95"
                                // onClick={handleFinish}
                                >
                                    Finish
                                </button>

                                <div className='flex items-center justify-end gap-8'>
                                    {/* Previous Button */}
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                                    // onClick={handlePrevious}
                                    >
                                        Previous
                                    </button>

                                    {/* Next Button */}
                                    <button
                                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200"
                                        onClick={() => {
                                            setIndex(index + 1)
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                        </div>
                    </section>
                ) : (
                    <section className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-purple-300 to-teal-200 z-50">
                        <div className="text-center space-y-4">
                            {/* Warning Icon */}
                            <div className="flex justify-center">
                                <span className="text-red-400 text-7xl animate-pulse">⚠️</span>
                            </div>

                            {/* Main Text */}
                            <h1 className="text-6xl font-extrabold tracking-widest drop-shadow-lg">
                                ILLEGAL ACCESS
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg  max-w-md mx-auto text-gray-900 font-medium">
                                Unauthorized entry detected. Please return to the main page or contact your administrator.
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={() => window.location.href = '/'}
                                className="mt-6 cursor-pointer  bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                            >
                                Go Back
                            </button>
                        </div>
                    </section>
                )
            }
        </section>
    )
}

export default StartQuiz
