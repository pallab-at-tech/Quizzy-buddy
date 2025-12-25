import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DailyQuizCountdown = () => {

    const navigate = useNavigate()

    const getTimeLeft = () => {

        const now = new Date()
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const diff = endOfDay - now

        if (diff <= 0) {
            return { Hours: 0, Minutes: 0, Secounds: 0 };
        }

        const Hours = Math.floor((diff / (1000 * 60 * 60)))
        const Minutes = Math.floor((diff / (1000 * 60)) % 60)
        const Secounds = Math.floor((diff / 1000) % 60)

        return { Hours: Hours, Minutes: Minutes, Secounds: Secounds }
    }

    const [count, setCount] = useState(getTimeLeft() || null)

    useEffect(() => {
        const timer = setInterval(() => {
            setCount(getTimeLeft() || null)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="mt-6 rounded-xl bg-gradient-to-r from-[#2c6fff] to-[#3d2aca] px-4 py-3 text-white text-center">
            <p className="text-sm opacity-90">⏳ Daily Quiz Ends In</p>

            <div className="flex justify-center gap-4 mt-1 text-lg font-semibold">
                {
                    count ? (
                        <>
                            <span>{String(count.Hours).padStart(2, "0")}h</span>
                            <span>{String(count.Minutes).padStart(2, "0")}m</span>
                            <span>{String(count.Secounds).padStart(2, "0")}s</span>
                        </>
                    ) : (
                        <span>0</span>
                    )
                }
            </div>

            <div className="mt-2 text-xs opacity-80 flex items-center justify-center gap-3">
                <p>Test your Skills </p>
                <button onClick={() => navigate("/daily-quiz")} className='py-1 px-2 bg-green-500 text-white rounded-lg'>Play now</button>
            </div>
        </div>
    )
}

export default DailyQuizCountdown
