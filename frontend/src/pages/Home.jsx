import React, { useEffect } from 'react'
import { IoStar } from "react-icons/io5";
import backimg1 from "../assets/q2-edit.png"
import backimg2 from "../assets/q3-edit.png"
import { PiShootingStarFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import i1 from "../assets/i1.png"
import i2 from "../assets/i2.png"
import i3 from "../assets/i3.png"
import i4 from "../assets/i4.png"

const Home = () => {

    const user = useSelector(state => state.user)

    console.log("From home page user", user)

    return (
        <section className='w-full'>
{/* to-[#1546ba] */}
            {
                !user?._id ? (
                    <div className='flex min-h-screen flex-col bg-gradient-to-b from-[#dee8ff] to-[#3066e4] text-[#010e49]'>

                        {/* Header Section */}
                        <header className='flex w-full items-center justify-between p-4 sm:p-6'>
                            <div className='text-xl font-bold '>
                                <Link to="/">Quizzy Buddy</Link>
                            </div>

                            {/* Centered Navigation Links - Hidden on small screens */}
                            <nav className='hidden lg:flex'>
                                <ul className='flex items-center gap-6 font-semibold'>
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
                                <Link to="/sign-in" className={`rounded-lg bg-[#010e49] px-4 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-[#031461] sm:hidden block`}>
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
                    <div className='bg-[#fcfcfc] min-h-screen lg:pr-[100px]'>

                        <div className='grid lg:grid-cols-[55%_45%]  lg:px-0 md:px-14  lg:pt-16 '>

                            <div className='lg:flex flex-col items-center justify-center md:pt-[60px] pt-4 lg:px-[22%] px-3'>
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

                                    <Link className='grid lg:grid-cols-[30%_70%]  bg-[#10b107] pt-2 pl-3 rounded-xl overflow-hidden relative  md:min-h-[130px] min-h-[100px]'>
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
                                    </Link>
                                </div>

                                <div className='grid grid-cols-2 md:gap-6 gap-4'>

                                    <Link className='grid lg:grid-cols-[30%_70%]  bg-[#0073ffd9] pt-2 pl-3 rounded-xl overflow-hidden relative md:min-h-[130px] min-h-[100px]'>

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



        </section>
    )
}

export default Home
