import React, { useEffect, useState } from 'react'
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from "recharts";
import { FaCrown } from "react-icons/fa";
import { ImStatsBars } from 'react-icons/im';
import { FaDeleteLeft } from "react-icons/fa6";
import toast from 'react-hot-toast';

const GetSubmissionFullDetails = () => {

    const { data, setData } = useOutletContext()
    const navigate = useNavigate()
    const location = useLocation()

    const [leaderBoardData, setLeaderBoardData] = useState(null)
    const [deleteSet, setDeleteSet] = useState({
        data: {},
        has: false,
        loading: false
    })

    const fetchLeaderBoard = async () => {
        if (!data) return
        if (new Date() < new Date(data?.quiz_end)) return

        try {
            const response = await Axios({
                ...SummaryApi.fetch_leaderBoard_details,
                params: {
                    hostId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setLeaderBoardData(responseData?.leaderboard)
            }
        } catch (error) {
            console.log("fetchLeaderBoard error", error)
        }
    }

    useEffect(() => {
        if(!data) return
        fetchLeaderBoard()
    }, [data])


    const convertToScoreBuckets = (users, total_marks) => {

        if (!users || !total_marks || data) return
        if (new Date() < new Date(data?.quiz_end)) return

        const bucketCount = 5
        const bucketSize = Math.ceil(total_marks / bucketCount)

        const buckets = []

        for (let i = 0; i < bucketCount; i++) {

            const start = i * bucketSize
            const end = (i + 1) * bucketSize

            buckets.push({
                range: `${start}-${end}`,
                count: 0
            })
        }

        users.forEach((u) => {
            const score = u.marks;

            const bucketIndex = Math.min(Math.floor(score / bucketSize), bucketCount - 1);
            buckets[bucketIndex].count++;
        });

        return buckets;
    };

    const deleteUserSubmission = async () => {

        if (deleteSet.loading) return

        try {

            setDeleteSet((prev) => {
                return {
                    ...prev,
                    loading: true
                }
            })

            const response = await Axios({
                ...SummaryApi.deleteSubmission_record,
                data: {
                    submitId: deleteSet?.data?._id,
                    submittedUserId: deleteSet.data?.userDetails?.Id,
                    hostId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                toast.success(responseData?.message)
                setData((prev) => {
                    let submit = prev?.quiz_submission_data || []
                    submit = submit?.filter((u) => u?._id !== deleteSet.data?._id) || []
                    return {
                        ...prev,
                        quiz_submission_data: submit || []
                    }
                })
            }
            else {
                toast.error(responseData?.message)
            }

            setDeleteSet(() => {
                return {
                    data: {},
                    has: false,
                    loading: false
                }
            })
        } catch (error) {
            setDeleteSet(() => {
                return {
                    data: {},
                    has: false,
                    loading: false
                }
            })
        }
    }

    const chartData = convertToScoreBuckets(leaderBoardData?.top_users || [], data?.total_marks);


    return (
        <section className="w-full custom-lg:max-w-5xl mx-auto px-2 sm:px-4">

            {
                data ? (
                    <>
                        {/* Header */}
                        <div className="custom-lg:mb-8 mb-5">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b-4 border-blue-600 inline-block pb-2">
                                Submission Board
                            </h1>
                        </div>

                        {/* Taking Quiz Section */}
                        <div className="bg-white shadow-md rounded-2xl p-[18px] sm:p-8 border border-gray-100">

                            {/* Sub Header */}
                            <div className="mb-3 sm:mb-6 flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 flex items-center gap-2 ">
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
                                    <div className="text-center py-6 sm:py-10 bg-purple-100 rounded-xl border border-purple-200">
                                        <h2 className="text-xl font-medium text-purple-600">🕒 Quiz has not started yet.</h2>
                                    </div>
                                ) : data && new Date(data?.quiz_end) < new Date() ? (
                                    <div className="text-center py-6 sm:py-10 bg-red-50 rounded-xl border border-red-200">
                                        <h2 className="text-xl font-medium text-red-600">⏰ The quiz has ended.</h2>
                                    </div>
                                ) : data && data?.user_ids?.length === 0 ? (
                                    <div className="text-center py-6 sm:py-10 px-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <h2 className="text-lg sm:text-xl font-medium text-yellow-600">⚠️ No one is taking the quiz right now.</h2>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[350px] overflow-y-auto custom_scrollBar_forFullDetails pr-1">
                                        {data && data?.user_ids?.map((v, i) => (
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
                        <div className='bg-white shadow-md rounded-2xl p-[18px] sm:p-8 border border-gray-100 mt-4 custom-lg:mt-8'>

                            {/* sub-header */}
                            <div className="sm:mb-6 flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 flex items-center gap-2 ">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Submitted Quiz
                                </h2>
                            </div>

                            {
                                data && data?.quiz_submission_data?.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">
                                        No quiz submissions yet.
                                    </div>
                                ) : (
                                    <div className="grid gap-3.5 sm:gap-6 sm:grid-cols-2 mt-2.5 sm:mt-6 max-h-[500px] overflow-y-auto custom_scrollBar_forFullDetails sm:pr-2 py-1">

                                        {data && data?.quiz_submission_data?.map((v) => {
                                            const accuracy =
                                                v.total_question > 0
                                                    ? ((v.total_correct / v.total_question) * 100).toFixed(1)
                                                    : 0;

                                            return (
                                                <div
                                                    key={v._id}
                                                    className="bg-white shadow-md hover:shadow-lg border-2 border-gray-200 rounded-2xl p-6 transition-all duration-200 relative"
                                                >
                                                    {/* delete icon */}
                                                    <FaDeleteLeft
                                                        size={19}
                                                        className={`${deleteSet.has ? "cursor-not-allowed" : "cursor-pointer"} absolute top-2 right-7 text-red-600`}
                                                        onClick={() => {
                                                            setDeleteSet(() => {
                                                                return {
                                                                    data: v,
                                                                    has: true,
                                                                    loading: false
                                                                }
                                                            })
                                                        }}
                                                    />

                                                    {/* Header */}
                                                    <div className="flex flex-col custom-lg:flex-row custom-lg:items-center justify-between mb-3">
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
                                                            <p className="text-lg font-bold text-purple-700">{v?.get_total_marks}</p>
                                                        </div>
                                                        <div className="bg-green-100 p-3 rounded-xl text-center border border-green-300">
                                                            <p className="text-gray-600">Correct</p>
                                                            <p className="text-lg font-bold text-green-700">{v?.total_correct}</p>
                                                        </div>
                                                        <div className="bg-blue-100 p-3 rounded-xl text-center border border-blue-300">
                                                            <p className="text-gray-600">Solved</p>
                                                            <p className="text-lg font-bold text-blue-700">{v?.total_solved}</p>
                                                        </div>
                                                        <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200">
                                                            <p className="text-gray-600">Questions</p>
                                                            <p className="text-lg font-bold text-yellow-700">{v?.total_question}</p>
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
                                                                {v?.total_time}s
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="mt-5 pt-3 border-t flex flex-col custom-lg:flex-row custom-lg:justify-between custom-lg:items-center text-sm text-gray-600">
                                                        <div className="italic">
                                                            <span className='font-medium'>User ID:{" "}</span>
                                                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded italic">
                                                                {v.userDetails?.userId || "N/A"}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-1.5 mt-3 custom-lg:mt-0 rounded-lg transition-all cursor-pointer"
                                                            onClick={() => {
                                                                navigate(`${location.pathname.replace("full-details", "view")}`, {
                                                                    state: {
                                                                        viewDetails: v
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

                        {/* LeaderBoard */}
                        <div className='bg-white shadow-md rounded-2xl p-[18px] sm:p-8 border border-gray-100 mt-4 custom-lg:mt-8'>

                            {/* sub-header */}
                            <div className="mb-1.5 custom-lg:mb-4 flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 flex items-center gap-2 ">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    LeaderBoard
                                </h2>
                            </div>

                            {/* Main Section */}
                            {
                                new Date() < new Date(data?.quiz_end) ? (
                                    <div className="text-center px-4 py-10 bg-red-50 rounded-xl border border-red-200">
                                        <h2 className="text-xl font-medium text-red-600">⏰ After Quiz Ended , LeaderBoard Will Be Shown.</h2>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="w-full space-y-3 max-h-[500px] bg-gray-50 rounded-xl px-2 sm:px-3 custom-lg:px-6 overflow-y-auto custom_scrollBar_forFullDetails pr-2 sm:pr-3 custom-lg:pr-6 py-4">
                                            {leaderBoardData && leaderBoardData?.top_users?.map((v, i) => (
                                                <div
                                                    key={v.userId?.Id}
                                                    className={`relative flex items-center justify-between ${i === 0 ? "from-blue-200 to-blue-50 border-blue-300" : "from-[#dcbfed] via-[#e9cef9] to-violet-50 border-[#8f79a3ae]"} bg-gradient-to-r  border-2  shadow-md rounded-xl p-4`}
                                                >

                                                    {
                                                        i === 0 && <FaCrown size={36} className='absolute text-yellow-600 -top-2 -left-0 rotate-[-20deg]' />
                                                    }

                                                    {/* Rank + Name */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-xl font-bold text-purple-700">#{i + 1}</div>
                                                        <div>
                                                            <p className="text-base font-semibold capitalize">{v?.userId?.userName}</p>
                                                            <p className="text-xs text-gray-600">{v?.userId?.userId}</p>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center sm:gap-6 text-[16px]">
                                                        <p>
                                                            <span className="font-semibold text-gray-800 ">{v.marks}</span>
                                                            <span className="text-purple-700 font-medium"> pts</span>
                                                        </p>
                                                        <p className='hidden sm:block'>
                                                            <span className="text-green-700 font-medium">Acc : </span>
                                                            <span className="font-semibold text-gray-800">{v.accuracy}%</span>
                                                        </p>
                                                        <p className='hidden sm:block'>
                                                            <span className="text-yellow-700 font-medium">Time : </span>
                                                            <span className="font-semibold text-gray-800">{v.timeTaken}s</span>
                                                        </p>

                                                        {v?.negativeMarks > 0 && (
                                                            <p className="text-red-600 font-medium hidden sm:block">-{v.negativeMarks}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Which factor makes this leader-board */}
                                        <div className="bg-white mt-6 mb-6 sm:mb-12 p-6 rounded-xl shadow-md border border-gray-200">

                                            <div className='flex items-center sm:items-center gap-2 mb-4'>
                                                <ImStatsBars size={23} className='text-yellow-800' />
                                                <h3 className="text-lg font-semibold text-purple-700">
                                                    Leaderboard Ranking
                                                </h3>
                                            </div>

                                            <ul className="space-y-3 text-sm text-gray-700">
                                                <li className="sm:flex gap-2">
                                                    <span className="font-bold text-purple-600">1️⃣ Marks</span>
                                                    — Higher total score gets priority.
                                                </li>

                                                <li className="sm:flex gap-2">
                                                    <span className="font-bold text-purple-600">2️⃣ Accuracy</span>
                                                    — Better accuracy ranks higher if marks are equal.
                                                </li>

                                                <li className="sm:flex gap-2">
                                                    <span className="font-bold text-purple-600">3️⃣ Time Taken</span>
                                                    — Faster submission ranks higher if marks & accuracy are same.
                                                </li>

                                                <li className="sm:flex gap-2">
                                                    <span className="font-bold text-purple-600">4️⃣ Negative Marks</span>
                                                    — Lower negative score ranks higher if previous factors are equal.
                                                </li>

                                                <li className="sm:flex gap-2">
                                                    <span className="font-bold text-purple-600">5️⃣ Submission Time</span>
                                                    — Earlier submission gets priority when everything else is equal.
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                )
                            }
                        </div>

                        {/* Stats */}
                        <div className='bg-white shadow-md rounded-2xl p-[18px] sm:p-8 border border-gray-100 mt-4 sm:mt-8'>

                            {/* sub-header */}
                            <div className="flex items-center justify-between">
                                <h2 className="mb-3 custom-lg:mb-4 text-xl sm:text-2xl font-semibold text-blue-700 flex items-center gap-2 ">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Stats <span className='text-blue-800'>( Last 5 Days )</span>
                                </h2>
                            </div>

                            {/* Main Section */}
                            {
                                new Date() < new Date(data?.quiz_end) ? (
                                    <div className="text-center px-4 py-6 sm:py-10 bg-red-50 rounded-xl border border-red-200">
                                        <h2 className="text-lg sm:text-xl font-medium text-red-600">⏰ After Quiz Ended , Stats Will Be Shown.</h2>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-white p-5 rounded-xl shadow-md">

                                            <h2 className="text-lg font-semibold mb-4 text-purple-700 text-center">
                                                Score Range (x) vs Number of Users (y)
                                            </h2>

                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart
                                                    data={chartData}
                                                    margin={{ top: 0, right: 0, left: -14, bottom: 12 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />

                                                    <XAxis dataKey="range">
                                                        <Label
                                                            value={`SCORE`}
                                                            position="insideBottom"
                                                            offset={-8}
                                                            style={{ fill: "#4B5563", fontWeight: "bold" }}
                                                        />
                                                    </XAxis>

                                                    <YAxis allowDecimals={false}>
                                                        <Label
                                                            value={`NO. OF USER`}
                                                            position={`insideLeft`}
                                                            angle={-90}
                                                            offset={20}
                                                            style={{ textAnchor: "middle", fill: "#4B5563", fontWeight: "bold" }}
                                                        />
                                                    </YAxis>

                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </>
                ) : (
                    <section className='fixed h-screen inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50'>
                        <div className='participants_loader'></div>
                    </section>
                )
            }


            {
                deleteSet.has && (
                    <section className="fixed h-screen inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">
                        <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">

                            {/* Header */}
                            <h2 className="text-xl font-bold text-red-600 text-center">
                                Confirm Deletion
                            </h2>

                            <p className="text-gray-600 text-center mt-2">
                                Are you sure you want to delete <span className='font-bold text-gray-600'>{`${deleteSet?.data?.userDetails?.userName}`}</span>'s record?
                                This action <span className="font-semibold text-red-500">cannot be undone</span>.
                            </p>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                <button
                                    className={`w-1/2 ${deleteSet.loading ? "cursor-not-allowed" : "cursor-pointer"} py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition`}
                                    disabled={deleteSet.loading}
                                    onClick={() => {
                                        setDeleteSet(() => {
                                            return {
                                                data: {},
                                                has: false,
                                                loading: false
                                            }
                                        })
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={`w-1/2 ${deleteSet.loading ? "cursor-not-allowed" : "cursor-pointer"} py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition`}
                                    disabled={deleteSet.loading}
                                    onClick={() => {
                                        deleteUserSubmission()
                                    }}
                                >
                                    {deleteSet.loading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </section>
                )
            }

        </section>
    )
}

export default GetSubmissionFullDetails
