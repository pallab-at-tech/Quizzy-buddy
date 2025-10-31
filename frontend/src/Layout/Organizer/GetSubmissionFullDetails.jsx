import React from 'react'
import { useOutletContext, useNavigate , useLocation } from 'react-router-dom'

const GetSubmissionFullDetails = () => {

    const { data } = useOutletContext()
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <section className="w-full max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-600 inline-block pb-2">
                    Submission Board
                </h1>
            </div>

            {/* Taking Quiz Section */}
            <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">

                {/* Sub Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center gap-2 ">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Taking Quiz
                    </h2>
                    <span className="text-gray-600 text-sm font-semibold">
                        {new Date().toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>

                {/* Quiz Status */}
                <div className="space-y-4 text-gray-700">

                    {data && new Date(data?.quiz_start) > new Date() ? (
                        <div className="text-center py-10 bg-purple-100 rounded-xl border border-purple-200">
                            <h2 className="text-xl font-medium text-purple-600">🕒 Quiz has not started yet.</h2>
                        </div>
                    ) : data && new Date(data?.quiz_end) < new Date() ? (
                        <div className="text-center py-10 bg-red-50 rounded-xl border border-red-200">
                            <h2 className="text-xl font-medium text-red-600">⏰ The quiz has ended.</h2>
                        </div>
                    ) : data?.user_ids?.length === 0 ? (
                        <div className="text-center py-10 bg-yellow-50 rounded-xl border border-yellow-100">
                            <h2 className="text-xl font-medium text-yellow-600">⚠️ No one is taking the quiz right now.</h2>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto custom_scrollBar_forFullDetails pr-1">
                            {data && data?.user_ids.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-[#eff6ffaa] hover:bg-blue-100 p-4 rounded-xl transition-all border border-blue-200 hover:border-blue-300"
                                >
                                    {/* Joined At */}
                                    <span className="text-[16px] text-gray-600 font-semibold">
                                        {new Date(v?.joinedAt).toLocaleString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>

                                    {/* User Info */}
                                    <div className="text-right text-[16px] flex items-center gap-0.5">
                                        <h1 className="text-gray-800 font-semibold">
                                            {v?.user_name}
                                        </h1>
                                        <h2 className="text-sm text-gray-500">
                                            ({v?.user_nanoId}) joined
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz submission */}
            <div className='bg-white shadow-md rounded-2xl p-8 border border-gray-100 mt-8'>

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-blue-700 flex items-center gap-2 ">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Submitted Quiz
                    </h2>
                </div>

                {
                    data && data?.quiz_submission_data.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            No quiz submissions yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-2 mt-6 max-h-[500px] overflow-y-auto custom_scrollBar_forFullDetails pr-2 py-1">

                            {data?.quiz_submission_data.map((v) => {
                                const accuracy =
                                    v.total_question > 0
                                        ? ((v.total_correct / v.total_question) * 100).toFixed(1)
                                        : 0;

                                return (
                                    <div
                                        key={v._id}
                                        className="bg-white shadow-md hover:shadow-lg border-2 border-gray-200 rounded-2xl p-6 transition-all duration-200"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                                                {v.userDetails?.userName || "Unknown User"}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {new Date(v.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-purple-100 p-3 rounded-xl text-center border border-purple-300">
                                                <p className="text-gray-600">Get Marks</p>
                                                <p className="text-lg font-bold text-purple-700">{v.get_total_marks}</p>
                                            </div>
                                            <div className="bg-green-100 p-3 rounded-xl text-center border border-green-300">
                                                <p className="text-gray-600">Correct</p>
                                                <p className="text-lg font-bold text-green-700">{v.total_correct}</p>
                                            </div>
                                            <div className="bg-blue-100 p-3 rounded-xl text-center border border-blue-300">
                                                <p className="text-gray-600">Solved</p>
                                                <p className="text-lg font-bold text-blue-700">{v.total_solved}</p>
                                            </div>
                                            <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200">
                                                <p className="text-gray-600">Questions</p>
                                                <p className="text-lg font-bold text-yellow-700">{v.total_question}</p>
                                            </div>
                                        </div>

                                        {/* Accuracy + Time */}
                                        <div className="mt-4 flex justify-between items-center px-2">
                                            <div>
                                                <p className="text-gray-600 text-sm font-medium">Accuracy</p>
                                                <p
                                                    className={`font-semibold ${accuracy >= 80
                                                        ? "text-green-600"
                                                        : accuracy >= 50
                                                            ? "text-yellow-600"
                                                            : "text-red-600"
                                                        }`}
                                                >
                                                    {accuracy}%
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-600 text-sm font-medium">Total Time</p>
                                                <p className="font-semibold text-gray-700">
                                                    {v.total_time}s
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-5 pt-3 border-t flex justify-between items-center text-sm text-gray-600">
                                            <div className="italic">
                                                <span className='font-medium'>User ID:{" "}</span>
                                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded italic">
                                                    {v.userDetails?.userId || "N/A"}
                                                </span>
                                            </div>
                                            <button
                                                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                                                onClick={() => {
                                                    navigate(`${location.pathname.replace("full-details" , "view")}` , {
                                                        state : {
                                                            viewDetails : v
                                                        }
                                                    })
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }

            </div>

        </section>
    )
}

export default GetSubmissionFullDetails
