import React, { useEffect, useState } from 'react'
import { IoStar } from "react-icons/io5";
import backimg1 from "../assets/q2-edit.png"
import backimg2 from "../assets/q3-edit.png"
import { PiShootingStarFill } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import i1 from "../assets/i1.png"
import i2 from "../assets/i2.png"
import i3 from "../assets/i3.png"
import i4 from "../assets/i4.png"
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';

const Home = () => {

    const user = useSelector(state => state.user)
    const { isLogin, socketConnection } = useGlobalContext()
    const navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const [joinedQuiz, setJoinedQuiz] = useState(false)
    const [quizCode, setQuizCode] = useState("")
    const [quizJoinLoader, setQuizJoinLoader] = useState(false)

    const handleJoinedQuiz = () => {
        setQuizJoinLoader(true)
        try {

            socketConnection.once("joinedQuiz_success", (data) => {
                toast.success(data?.message)
                navigate(`/joined/${data?.hostId}`)
                setQuizJoinLoader(false)
            })

            socketConnection.once("joinedQuiz_error", (data) => {
                toast.error(data?.message)
                setQuizJoinLoader(false)
            })

            socketConnection.emit("joined_quiz", {
                joined_code: quizCode,
                name: user?.name
            })

        } catch (error) {
            setQuizJoinLoader(false)
            console.log("handleJoinedQuiz error", error)
        }
    }

    // console.log("From home page user", user)

    if (isLogin === null) return null;

    return (
        <section className='w-full'>

            {
                !isLogin ? (
                    <div className='flex min-h-screen flex-col bg-gradient-to-b from-[#d8e6ff] to-[#305ee4] animate-gradient text-[#010e49]'>

                        {/* Header Section */}
                        <header className='flex w-full items-center justify-between p-4 sm:p-6'>

                            <div className='text-xl font-bold '>
                                <Link to="/">Quizzy Buddy</Link>
                            </div>

                            {/* Centered Navigation Links - Hidden on small screens */}
                            <nav className='hidden lg:flex'>
                                <ul className='flex items-center gap-x-6 font-semibold'>
                                    <li><Link to="/host" className='flex items-center gap-1.5 hover:text-[#df6f00] transition-colors'><IoStar className='text-[#df6f00]' /> Host a Quiz</Link></li>
                                    <li><Link to="/participate" className='flex items-center gap-1.5 hover:text-[#df6f00] transition-colors'><IoStar className='text-[#df6f00]' /> Participate</Link></li>
                                    <li><Link to="/practice" className='flex items-center gap-1.5 hover:text-[#df6f00] transition-colors'><IoStar className='text-[#df6f00]' /> Practice</Link></li>
                                    <li><Link to="/learn" className='flex items-center gap-1.5 hover:text-[#df6f00] transition-colors'><IoStar className='text-[#df6f00]' /> Earn Knowledge</Link></li>
                                </ul>
                            </nav>


                            {/* Auth Buttons - Hidden on small screens */}
                            <div className='flex items-center gap-4'>
                                <Link to="/sign-in" className='font-semibold transition-colors hover:text-[#031461] sm:block hidden'>
                                    Sign In
                                </Link>
                                <Link to="/sign-in" className={`rounded-lg bg-[#010e49] px-4 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-[#031461] sm:hidden block relative z-50`}>
                                    Sign In
                                </Link>
                                <Link to="/sign-up" className={`rounded-lg bg-[#010e49] px-4 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-[#031461] sm:block hidden`}>
                                    Sign Up
                                </Link>
                            </div>

                        </header>

                        {/* Main Section  */}
                        <main className='relative flex flex-grow flex-col items-center justify-center p-4 text-center -mt-[140px] sm:-mt-0'>

                            {/* Decorative background images */}
                            <div className='pointer-events-none absolute top-1/2 left-[10%] hidden -translate-y-1/2 rotate-[358deg] scale-x-[-1] opacity-40  custom-lg:block'>
                                <img src={backimg2} alt="" className='h-auto w-64' />
                            </div>
                            <div className='pointer-events-none absolute top-1/2 right-[10%] hidden -translate-y-1/2 rotate-[10deg] opacity-40 custom-lg:block'>
                                <img src={backimg1} alt="" className='h-auto w-64' />
                            </div>

                            {/* Hero Text Content */}
                            <div className='z-10 flex flex-col items-center'>
                                <h1 className='text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl'>
                                    Welcome to <span className='block'>Quizzy Buddy</span>
                                </h1>
                                <p className='mt-4 max-w-md font-semibold text-[#06187e] md:text-xl'>
                                    "Where Challenge, Learn, Repeat."
                                </p>
                                <Link
                                    to="/sign-up"
                                    className='mt-8 inline-flex items-center gap-2 rounded-xl bg-[#010e49] px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105'
                                >
                                    <PiShootingStarFill />
                                    Start Journey
                                </Link>
                            </div>
                        </main>
                    </div>
                ) : (
                    <div className='bg-[#fcfcfc] h-[calc(100vh-50px)] lg:pr-[100px] '>

                        <div className='grid lg:grid-cols-[55%_45%]  lg:px-0 md:px-14  lg:pt-16 '>

                            <div className='lg:flex flex-col items-center justify-center md:pt-[60px] pt-4 lg:px-[22%] px-3 '>
                                <div>
                                    <div className='md:text-5xl text-3xl font-bold flex flex-wrap gap-2.5'>
                                        <p className='text-[#1633ff]'>Challenge</p>
                                        <p>Your Mind</p>
                                    </div>
                                    <p className='md:text-base text-sm md:pt-3.5 pt-2 break-words text-[#01062b9f] md:block hidden'>
                                        Challenge yourself with engaging quizzes, earn points, and climb the leaderboard and become the ultimate champion.
                                    </p>

                                    <p className='md:text-base text-sm md:pt-3.5 pt-2 break-words text-[#01062b9f] md:hidden block'>
                                        Challenge yourself with engaging quizzes, earn points, and climb the leaderboard.
                                    </p>


                                    <div className='md:mt-10 mt-8'>
                                        <p className='font-semibold text-xl lg:block hidden'>LeaderBoard</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center  w-full gap-4  px-3 '>

                                <div className='grid grid-cols-2 md:gap-6 gap-4'>

                                    {/* daily quiz section */}
                                    <Link className='grid lg:grid-cols-[30%_70%]  bg-[#ff6e07] pt-2 pl-3 rounded-xl overflow-hidden relative md:min-h-[130px] min-h-[100px]'>

                                        <div className='flex flex-col relative z-10'>
                                            <h1 className='font-bold text-xl'>Practice</h1>
                                            <div className='text-sm md:font-semibold font-medium '>
                                                <p>Refine</p>
                                                <p>Skills Daily</p>
                                            </div>
                                        </div>
                                        <div className='absolute bottom-0 top-0 -right-2 z-0'>
                                            <img src={i4} alt="" className='md:h-[150px] h-[100px] transform scale-x-[-1] opacity-[90%]' />
                                        </div>
                                    </Link>

                                    {/* join quiz section */}
                                    <div onClick={() => setJoinedQuiz(true)} className='grid lg:grid-cols-[30%_70%] cursor-pointer  bg-[#10b107] pt-2 pl-3 rounded-xl overflow-hidden relative  md:min-h-[130px] min-h-[100px]'>
                                        <div className='flex flex-col relative z-10'>
                                            <h1 className='font-bold md:text-xl text-lg'>Join quiz</h1>
                                            <div className='text-sm md:font-semibold font-medium'>
                                                <p>Enter</p>
                                                <p>just code</p>
                                            </div>
                                        </div>
                                        <div className='absolute bottom-0 top-0 right-0 z-0'>
                                            <img src={i2} alt="" className='md:h-[240px] h-[150px] transform scale-x-[-1]' />
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 md:gap-6 gap-4'>

                                    {/* host section */}
                                    <Link to={"/host-quiz"} className='grid lg:grid-cols-[30%_70%]  bg-[#0073ffd9] pt-2 pl-3 rounded-xl overflow-hidden relative md:min-h-[130px] min-h-[100px]'>

                                        <div className='flex flex-col relative z-10'>
                                            <h1 className='font-bold text-xl'>Host</h1>
                                            <div className='text-sm md:font-semibold font-medium '>
                                                <p>Rise</p>
                                                <p>through rank</p>
                                            </div>
                                        </div>
                                        <div className='absolute bottom-1  right-0 z-0  top-4'>
                                            <img src={i1} alt="" className='md:h-[120px] h-[70px] opacity-[90%]' />
                                        </div>
                                    </Link>

                                    {/* explore section */}
                                    <Link className='grid lg:grid-cols-[30%_70%]  bg-[#79b716] pt-2 pl-3 rounded-xl overflow-hidden relative md:min-h-[130px] min-h-[100px]'>
                                        <div className='flex flex-col relative z-10'>
                                            <h1 className='font-bold md:text-xl text-lg'>Explore</h1>
                                            <div className='text-sm md:font-semibold font-medium'>
                                                <p>Battle</p>
                                                <p>for excellance</p>
                                            </div>
                                        </div>
                                        <div className='absolute bottom-0 top-0 right-0 z-0'>
                                            <img src={i3} alt="" className='md:h-[220px] h-full' />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>
                )
            }

            {joinedQuiz && (
                <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">

                    <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative">

                        {/* Close button */}
                        <button
                            onClick={() => setJoinedQuiz(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                        >
                            <i className="ri-close-line text-2xl"></i>
                        </button>

                        {/* Header */}
                        <div className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                            <i className="ri-key-line text-blue-600"></i>
                            Join Quiz
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-6">
                            Enter the <span className="font-medium text-blue-600">Join Code</span> provided by your quiz host to participate.
                        </p>

                        {/* Input Field */}
                        <div className="mb-6">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                                <i className="ri-hashtag text-gray-400 text-xl pl-3"></i>
                                <input
                                    type="text"
                                    placeholder="Enter join code..."
                                    value={quizCode}
                                    onChange={(e) => setQuizCode(e.target.value)}
                                    className="flex-1 px-3 py-2 outline-none text-gray-800 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setJoinedQuiz(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={quizJoinLoader}
                                onClick={() => handleJoinedQuiz()}
                                className={`px-5 py-2 ${quizJoinLoader ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}  text-white rounded-lg  transition flex items-center gap-2`}
                            >
                                <i className="text-lg"></i>
                                Join
                            </button>
                        </div>
                    </div>
                </section>
            )}

        </section>
    )
}

export default Home
