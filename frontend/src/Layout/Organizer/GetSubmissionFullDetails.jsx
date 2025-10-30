import React from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'


const GetSubmissionFullDetails = () => {

    const { data } = useOutletContext()

    return (
        <section className="p-6 w-full max-w-5xl mx-auto">

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
                        <div className="text-center py-10 bg-purple-50 rounded-xl">
                            <h2 className="text-xl font-medium text-purple-600">🕒 Quiz has not started yet.</h2>
                        </div>
                    ) : data && new Date(data?.quiz_end) < new Date() ? (
                        <div className="text-center py-10 bg-red-50 rounded-xl">
                            <h2 className="text-xl font-medium text-red-600">⏰ The quiz has ended.</h2>
                        </div>
                    ) : data?.user_ids?.length === 0 ? (
                        <div className="text-center py-10 bg-yellow-50 rounded-xl">
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

            {/* Submit Details section */}
            <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 mt-8">

            </div>

        </section>

    )
}

export default GetSubmissionFullDetails
