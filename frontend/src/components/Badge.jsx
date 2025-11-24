import React from 'react'
import { FaCalendarWeek, FaCalendarAlt, FaMedal, FaTrophy, FaCrown } from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";
import { MdQuiz } from "react-icons/md";

export const badges = [
    // ---- STREAK BADGES ----
    {
        id: "Streak1Week",
        title: "1 Week Streak",
        icon: <FaCalendarWeek className="text-purple-600" size={32} />,
        description: "Complete quiz for 7 days consistently",
    },
    {
        id: "Streak1Month",
        title: "1 Month Streak",
        icon: <FaCalendarAlt className="text-blue-600" size={32} />,
        description: "Keep your streak for an entire month",
    },
    {
        id: "Streak3Month",
        title: "3 Month Streak",
        icon: <FaCalendarAlt className="text-green-600" size={32} />,
        description: "A 3-month long dedication streak",
    },
    {
        id: "Streak6Month",
        title: "6 Month Streak",
        icon: <FaCalendarAlt className="text-amber-600" size={32} />,
        description: "Half-year of unstoppable consistency",
    },
    {
        id: "Streak1Year",
        title: "1 Year Streak",
        icon: <FaCrown className="text-yellow-600" size={32} />,
        description: "One full year of consistent participation",
    },

    // ---- HOST QUIZ BADGES ----
    {
        id: "Host5",
        title: "Hosted 5 Quizzes",
        icon: <MdQuiz className="text-orange-400" size={32} />,
        description: "Created 5 quizzes",
    },
    {
        id: "Host20",
        title: "Hosted 20 Quizzes",
        icon: <MdQuiz className="text-red-500" size={32} />,
        description: "Created 20 quizzes",
    },
    {
        id: "Host50",
        title: "Hosted 50 Quizzes",
        icon: <MdQuiz className="text-lime-600" size={32} />,
        description: "Created 50 quizzes",
    },
    {
        id: "Host200",
        title: "Hosted 200 Quizzes",
        icon: <MdQuiz className="text-emerald-600" size={32} />,
        description: "Created 200 quizzes",
    },

    // ---- LEADERBOARD BADGES ----
    {
        id: "Top1",
        title: "Top 1",
        icon: <FaCrown className="text-yellow-500" size={32} />,
        description: "Ranked #1 on leaderboard",
    },
    {
        id: "Top5",
        title: "Top 5",
        icon: <FaTrophy className="text-purple-500" size={32} />,
        description: "Ranked in top 5",
    },
    {
        id: "Top10",
        title: "Top 10",
        icon: <FaMedal className="text-blue-500" size={32} />,
        description: "Ranked in top 10",
    },

    // Multiple-time leaderboard achievements
    {
        id: "Top10x5",
        title: "Top 10 (5 Times)",
        icon: <GiLaurelsTrophy className="text-blue-600" size={32} />,
        description: "Entered top 10 five times",
    },
    {
        id: "Top5x5",
        title: "Top 5 (5 Times)",
        icon: <GiLaurelsTrophy className="text-purple-600" size={32} />,
        description: "Placed in top 5 five times",
    },
    {
        id: "Top1x5",
        title: "Top 1 (5 Times)",
        icon: <FaCrown className="text-yellow-600" size={32} />,
        description: "Achieved rank #1 five times",
    },

    {
        id: "Top10x20",
        title: "Top 10 (20 Times)",
        icon: <GiLaurelsTrophy className="text-blue-700" size={32} />,
        description: "Entered top 10 twenty times",
    },
    {
        id: "Top5x20",
        title: "Top 5 (20 Times)",
        icon: <GiLaurelsTrophy className="text-purple-700" size={32} />,
        description: "Placed in top 5 twenty times",
    },
    {
        id: "Top1x20",
        title: "Top 1 (20 Times)",
        icon: <FaCrown className="text-yellow-700" size={32} />,
        description: "Achieved rank #1 twenty times",
    },
];

// 1 week of streak
export const Streak1Week = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[0].icon}
            <h3 className="text-md font-semibold mt-3">{badges[0].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[0].description}</p>
        </div>
    )
}

// 1 month of streak
export const Streak1Month = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[1].icon}
            <h3 className="text-md font-semibold mt-3">{badges[1].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[1].description}</p>
        </div>
    )
}

// 3 month of streak
export const Streak3Month = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[2].icon}
            <h3 className="text-md font-semibold mt-3">{badges[2].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[2].description}</p>
        </div>
    )
}

// 6 month of streak
export const Streak6Month = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[3].icon}
            <h3 className="text-md font-semibold mt-3">{badges[3].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[3].description}</p>
        </div>
    )
}

// 1 year of streak
export const Streak1Year = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[4].icon}
            <h3 className="text-md font-semibold mt-3">{badges[4].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[4].description}</p>
        </div>
    )
}

// Host 5 Quiz
export const Host5 = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[5].icon}
            <h3 className="text-md font-semibold mt-3">{badges[5].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[5].description}</p>
        </div>
    )
}

// Host 20 Quiz
export const Host20 = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[6].icon}
            <h3 className="text-md font-semibold mt-3">{badges[6].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[6].description}</p>
        </div>
    )
}

// Host 50 Quiz
export const Host50 = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[7].icon}
            <h3 className="text-md font-semibold mt-3">{badges[7].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[7].description}</p>
        </div>
    )
}

// Host 200 Quiz
export const Host200 = () => {
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[8].icon}
            <h3 className="text-md font-semibold mt-3">{badges[8].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[8].description}</p>
        </div>
    )
}

// Top 1
export const Top1 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[9].icon}
            <h3 className="text-md font-semibold mt-3">{badges[9].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[9].description}</p>
        </div>
    )
}

// Top 5
export const Top5 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[10].icon}
            <h3 className="text-md font-semibold mt-3">{badges[10].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[10].description}</p>
        </div>
    )
}

// Top 10
export const Top10 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[11].icon}
            <h3 className="text-md font-semibold mt-3">{badges[11].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[11].description}</p>
        </div>
    )
}

// Top 10 , 5 times
export const Top10x5 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[12].icon}
            <h3 className="text-md font-semibold mt-3">{badges[12].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[12].description}</p>
        </div>
    )
}

// Top 5 , 5 times
export const Top5x5 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[13].icon}
            <h3 className="text-md font-semibold mt-3">{badges[13].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[13].description}</p>
        </div>
    )
}

// Top 1 , 5 times
export const Top1x5 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[14].icon}
            <h3 className="text-md font-semibold mt-3">{badges[14].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[14].description}</p>
        </div>
    )
}

// Top 10 , 20 times
export const Top10x20 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[15].icon}
            <h3 className="text-md font-semibold mt-3">{badges[15].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[15].description}</p>
        </div>
    )
}

// Top 5 , 20 times
export const Top5x20 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[16].icon}
            <h3 className="text-md font-semibold mt-3">{badges[16].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[16].description}</p>
        </div>
    )
}

// Top 1 , 20 times
export const Top1x20 = () =>{
    return (
        <div className='p-4 bg-white border border-gray-300 shadow-sm rounded-xl flex flex-col items-center text-center hover:shadow-md transition'>
            {badges[17].icon}
            <h3 className="text-md font-semibold mt-3">{badges[17].title}</h3>
            <p className="text-sm text-gray-600 mt-1">{badges[17].description}</p>
        </div>
    )
}


