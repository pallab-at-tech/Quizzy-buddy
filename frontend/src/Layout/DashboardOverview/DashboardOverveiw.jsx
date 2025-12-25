import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from "recharts";
import { Streak1Month, Streak1Week, Streak1Year, Streak3Month, Streak6Month } from '../../components/Badge';
import { Host5, Host20, Host50, Host200 } from '../../components/Badge';
import { Top1, Top5, Top10, Top10x5, Top5x5, Top1x5, Top10x20, Top5x20, Top1x20 } from '../../components/Badge';



const DashboardOverveiw = () => {

    const user = useSelector(state => state?.user)
    const [chartData, setChartData] = useState(null)
    const [lastDateState, setlastDateState] = useState("Not played any yet!")

    const lastDate = () => {

        const stats = user?.daily_strict_count?.last_week_stats ?? [];

        if (!stats || stats.length === 0) {
            return "Not played any yet!";
        }

        // Always use the latest entry
        const latest = stats[0];

        if (!latest?.date) {
            return "Not played any yet!";
        }

        const now = new Date();
        const dt = new Date(latest.date);

        const isSameDay =
            now.getDate() === dt.getDate() &&
            now.getMonth() === dt.getMonth() &&
            now.getFullYear() === dt.getFullYear();

        return isSameDay ? "Today" : dt.toDateString();
    };

    const convertToScoreBuckets = (bucketSize = 7) => {
        if (!user) return []

        const bucketCount = bucketSize
        const bucket = []

        const now = new Date()

        for (let index = 0; index < bucketCount; index++) {
            const d = new Date()
            d.setDate(now.getDate() - index)

            bucket.push({
                score: 0,
                date: bucketSize < 7 ? d.getDate() : d.toISOString().slice(0, 10),
                accuracy: 0
            })
        }

        const rawStats = user?.daily_strict_count?.last_week_stats ?? [];

        const stats = rawStats.map((d) => ({
            score: d.score,
            date: bucketSize < 7 ? new Date(d.date).getDate() : new Date(d.date).toISOString().slice(0, 10),
            accuracy: d.accuracy
        }))

        bucket.forEach((v) => {
            const match = stats.find((d) => d.date === v.date)
            if (match) {
                v.score = match.score
                v.accuracy = match.accuracy
            }
        })

        return bucket.reverse()
    }

    useEffect(() => {
        let data = null
        if(window.innerWidth >= 640){
            data = convertToScoreBuckets(7)
        }
        else{
            data = convertToScoreBuckets(5)
        }
        setChartData(data)
    }, [user])

    useEffect(() => {
        setlastDateState(lastDate())
    }, [user])

    return (
        <section className='p-6 custom-sm:p-8 custom-lg:p-10 page-scroll'>

            {/* Header */}
            <div>
                <h1 className="text-[26px] custom-sm:text-4xl custom-lg:text-3xl font-bold text-gray-800  inline-block pb-2">
                    DashBoard OverView
                </h1>
            </div>

            {/* Daily stats */}
            <div className='bg-white shadow-md rounded-2xl p-5 sm:p-8 border border-gray-100 mt-4 sm:mt-8'>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                    My Daily Stats
                </h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-5 gap-3">

                    {/* Current Streak for tab and desktop*/}
                    <div className="sm:p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hidden sm:block">
                        <p className="text-gray-500 text-sm text-center">Current Streak</p>
                        <h3 className="text-3xl font-bold text-indigo-600 text-center">
                            {user?.daily_strict_count?.strict_count}
                        </h3>
                    </div>

                    {/* Best Streak for tab and desktop*/}
                    <div className="sm:p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hidden sm:block ">
                        <p className="text-gray-500 text-sm text-center">Best Streak</p>
                        <h3 className="text-3xl font-bold text-green-600 text-center">
                            {user?.daily_strict_count?.best_strick}
                        </h3>
                    </div>

                    {/* Current Streak for mobile */}
                    <div className='grid grid-cols-2 gap-3 sm:hidden'>
                        {/* Current Streak */}
                        <div className="p-3.5 sm:p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                            <p className="text-gray-500 text-sm text-center">Current Streak</p>
                            <h3 className="text-3xl font-bold text-indigo-600 text-center">
                                {user?.daily_strict_count?.strict_count}
                            </h3>
                        </div>

                        {/* Best Streak */}
                        <div className="p-3.5 sm:p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                            <p className="text-gray-500 text-sm text-center">Best Streak</p>
                            <h3 className="text-3xl font-bold text-green-600 text-center">
                                {user?.daily_strict_count?.best_strick}
                            </h3>
                        </div>
                    </div>

                    {/* Last Played */}
                    <div className="p-2.5 sm:p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                        <p className="text-gray-500 text-sm text-center">Last Played</p>
                        <h3 className="text-lg font-semibold text-gray-800 text-center">
                            {lastDateState}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Badge collection */}
            <div className='bg-white shadow-md rounded-2xl p-5 sm:p-8 border border-gray-100 mt-4 sm:mt-8'>
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                    My Badge Collection
                </h2>

                {
                    user && user?.badge_collection && (
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2'>
                            {user?.badge_collection?.Streak1Week && <Streak1Week />}
                            {user?.badge_collection?.Streak1Month && <Streak1Month />}
                            {user?.badge_collection?.Streak3Month && <Streak3Month />}
                            {user?.badge_collection?.Streak6Month && <Streak6Month />}
                            {user?.badge_collection?.Streak1Year && <Streak1Year />}
                            {user?.badge_collection?.Host5 && <Host5 />}
                            {user?.badge_collection?.Host20 && <Host20 />}
                            {user?.badge_collection?.Host50 && <Host50 />}
                            {user?.badge_collection?.Host200 && <Host200 />}
                            {user?.badge_collection?.Top1 && <Top1 />}
                            {user?.badge_collection?.Top5 && <Top5 />}
                            {user?.badge_collection?.Top10 && <Top10 />}
                            {user?.badge_collection?.Top1x5 && <Top1x5 />}
                            {user?.badge_collection?.Top1x20 && <Top1x20 />}
                            {user?.badge_collection?.Top5x5 && <Top5x5 />}
                            {user?.badge_collection?.Top5x20 && <Top5x20 />}
                            {user?.badge_collection?.Top10x5 && <Top10x5 />}
                            {user?.badge_collection?.Top10x20 && <Top10x20 />}
                        </div>
                    )
                }

            </div>

            {/* statastical graph */}
            <div className='bg-white sm:shadow-md rounded-2xl px-0 sm:px-8 pb-6 sm:border border-gray-100 mt-4 sm:mt-8'>
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 sm:mb-6 pt-4 sm:pt-6 pl-4">
                    Last 7 days progress
                </h2>

                {
                    user && chartData && (user.daily_strict_count?.last_week_stats?.length ?? 0) !== 0 ? (
                        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 mt-4 sm:mt-8">

                            <h2 className="hidden sm:block text-xl font-semibold text-purple-700 text-center mb-2">
                                Score & Accuracy vs Last 7 Days
                            </h2>

                            <h2 className="sm:hidden block text-xl font-semibold text-purple-700 text-center mb-2">
                                Score & Accuracy vs Last 5 Days
                            </h2>

                            {/* Legend */}
                            <div className="flex justify-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-[#8b5cf6]"></span>
                                    <p className="text-sm text-gray-600">Score</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-[#10b981]"></span>
                                    <p className="text-sm text-gray-600">Accuracy</p>
                                </div>
                            </div>


                            <ResponsiveContainer width={"100%"} height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    {/* X-Axis with Label */}
                                    <XAxis dataKey="date" className='sm:hidden block'>
                                        <Label
                                            value="Date"
                                            offset={-3}
                                            position="insideBottom"
                                            style={{ fill: "#4B5563" }}
                                        />
                                    </XAxis>

                                    {/* X-Axis with Label */}
                                    <XAxis dataKey="date" className='hidden sm:block'>
                                        <Label
                                            value="Days"
                                            offset={-3}
                                            position="insideBottom"
                                            style={{ fill: "#4B5563" }}
                                        />
                                    </XAxis>

                                    {/* Y-Axis with Label */}
                                    <YAxis allowDecimals={true} className='sm:hidden block'>
                                        <Label
                                            value="Score-Acc"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ textAnchor: "middle", fill: "#4B5563" }}
                                        />
                                    </YAxis>

                                    {/* Y-Axis with Label */}
                                    <YAxis allowDecimals={true} className='hidden sm:block'>
                                        <Label
                                            value="Score / Accuracy"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ textAnchor: "middle", fill: "#4B5563" }}
                                        />
                                    </YAxis>

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                        </div>
                    ) : (
                        <div>
                            You haven't attend any Quiz!
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default DashboardOverveiw
