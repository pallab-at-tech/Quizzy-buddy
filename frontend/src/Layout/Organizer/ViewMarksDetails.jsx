import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'
import { FaRegLightbulb } from "react-icons/fa";

const ViewMarksDetails = () => {

    const location = useLocation()
    const [data, setData] = useState(null)
    const [hasFetched, setHasFetched] = useState(false)

    
    useEffect(() => {
        if (location.state?.viewDetails) {
            setData(location.state.viewDetails)
            setHasFetched(false)
        }
    }, [location.state])

    useEffect(() => {
        const fetchAndUpdateData = async () => {
            if (!data || hasFetched) return

            try {
                const response = await Axios({
                    ...SummaryApi.fetch_questionDetails,
                    data: { data: data.correctedData },
                })

                const { data: responseData } = response

                if (responseData?.success) {
                    setData((prev) => ({
                        ...prev,
                        correctedData: responseData.data,
                    }))
                    setHasFetched(true)
                }

            } catch (error) {
                console.log("fetchAndUpdateData error", error)
            }
        }

        fetchAndUpdateData()
    }, [data, hasFetched])

    // console.log("ViewMarksDetails data", data)

    return (
        <section className=''>
            {/* Basic user details */}
            <div className="w-full bg-white shadow-md rounded-2xl p-6 border border-gray-200">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b pb-4">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-semibold text-purple-700">
                            {data?.userDetails?.userName || "Unknown User"}
                        </h2>
                        <span className="text-sm text-gray-500">
                            ID: {data?.userDetails?.userId || "N/A"}
                        </span>
                    </div>

                    <div className="mt-3 sm:mt-0">
                        <span className="text-sm bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-medium">
                            Quiz Summary
                        </span>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center">
                    <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">Get Marks</p>
                        <p className="text-2xl font-bold text-purple-700">{data?.get_total_marks}</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">Solved</p>
                        <p className="text-2xl font-bold text-blue-700">{data?.total_solved}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">Correct</p>
                        <p className="text-2xl font-bold text-green-700">{data?.total_correct}</p>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">Incorrect</p>
                        <p className="text-2xl font-bold text-red-700">
                            {data?.total_solved - data?.total_correct}
                        </p>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">Questions</p>
                        <p className="text-2xl font-bold text-yellow-700">{data?.total_question}</p>
                    </div>

                    <div className="bg-teal-50 rounded-xl p-4">
                        <p className="text-gray-600 text-sm">Accuracy</p>
                        <p className="text-2xl font-bold text-teal-700">
                            {data?.total_question
                                ? ((data.total_correct / data.total_question) * 100).toFixed(1)
                                : 0}
                            %
                        </p>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="flex flex-wrap justify-between items-center mt-6 text-sm text-gray-700">
                    <div>
                        <span className="font-medium text-gray-600">Time Taken:</span>{" "}
                        <span className="text-purple-700 font-semibold">{data?.total_time || 0}s</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600">Date:</span>{" "}
                        <span className="text-gray-800">
                            {new Date(data?.submittedAt || Date.now()).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Question details and correct-wrong answer */}
            <div className='w-full bg-white shadow-md rounded-2xl p-6 border border-gray-200 mt-4'>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 pb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-purple-700">
                            Question Details
                        </h2>
                    </div>
                </div>

                {/* Main sections */}
                <div>
                    {
                        data && data?.correctedData.map((v, i) => {
                            return (
                                <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4 hover:shadow-md transition-shadow">
                                    {/* Question */}
                                    <div className="mb-3">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Q{`${i + 1})`} <span className="font-normal text-gray-700">{v?.question_details?.question}</span>
                                        </h2>

                                        {v?.question_details?.image && (
                                            <div className="w-full flex items-center justify-center my-3">
                                                <div className="border border-gray-300 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                    <img
                                                        src={v?.question_details?.image}
                                                        alt="Question Visual"
                                                        className="w-full max-w-[200px] rounded-lg object-contain"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Options */}
                                    <div className={`${!v?.question_details?.inputBox && "grid"} grid-cols-1 sm:grid-cols-2 gap-3 mt-2`}>
                                        {!v?.question_details?.inputBox && v?.question_details?.options?.map((opt, idx) => {
                                            const isUserAns = String(idx) === String(v?.userAnswer);
                                            const isCorrectAns = String(idx) === String(v?.correctAnswer);

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-3 border rounded-xl text-sm font-medium transition-all
                                                        ${isCorrectAns ? "bg-green-100 border-green-400 text-green-800" : ""}
                                                        ${isUserAns && !isCorrectAns ? "bg-red-100 border-red-400 text-red-800" : ""}
                                                        ${!isCorrectAns && !isUserAns ? "bg-gray-50 border-gray-200 text-gray-600" : ""}
                                                    `}
                                                >
                                                    <span className="mr-2 font-semibold">({idx + 1})</span>
                                                    {opt}
                                                </div>
                                            );
                                        })}
                                        {
                                            v?.question_details?.inputBox && (
                                                <>
                                                    {
                                                        v?.userAnswer && <div>
                                                            <strong className="text-gray-900 mb-0.5">User Answer :</strong>
                                                            <p className={`mt-1 text-gray-900 ${v?.isCorrect ? "bg-[#dffce9] border border-green-400" : "bg-[#fce1df] border border-red-400"} rounded-lg p-3`}>
                                                                {v?.userAnswer}
                                                            </p>
                                                        </div>
                                                    }

                                                    <div className="mt-3">
                                                        <div className='flex items-center gap-0.5'>
                                                            <strong className="text-blue-900 mb-0.5">Reasoning</strong>
                                                            <FaRegLightbulb size={18} className='text-yellow-600 mt-0.5' />
                                                        </div>
                                                        <p className="mt-1 text-gray-900 bg-[#d2e2ff] border border-blue-500 rounded-lg p-3">
                                                            {v?.correctAnswer || "User answer missing !?"}
                                                        </p>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>

                                    {/* Marks Info */}
                                    <div className="flex flex-wrap justify-between items-center mt-4 text-sm">
                                        <div>
                                            <span className="font-semibold text-gray-700">Status: </span>
                                            {v?.isCorrect ? (
                                                <span className="text-green-600 font-semibold">Correct ✅</span>
                                            ) : (
                                                v?.userAnswer ? (
                                                    <span className="text-red-600 font-semibold">Wrong ❌</span>
                                                ) : (
                                                    <span className="text-red-600 font-semibold">Wrong ❌ {`( User answer missing )`}</span>
                                                )
                                            )}
                                        </div>

                                        <div>
                                            <span className="font-semibold text-gray-700">Marks:</span>{" "}
                                            <span className="text-purple-700 font-bold">{v?.marks}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </section>
    )
}

export default ViewMarksDetails
