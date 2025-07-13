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

            {
                !user?._id ? (
                    <div className='min-h-screen lg:block grid grid-rows-[100px_150px_1fr]  bg-gradient-to-b from-[#c5d4f7] to-[#1546ba]'>

                        <div>
                            <ul className='grid md:grid-cols-[1fr_200px_200px] grid-cols-3 py-6'>
                                <li>Logo</li>
                                <li>
                                    <Link to={"/sign-up"} className='px-4 py-2 text-white text-base rounded-4xl font-semibold bg-[#010e49] hover:bg-[#031461] hover:scale-105 hover:px-[16px] transition-all duration-150 cursor-pointer'>Sign Up</Link>
                                </li>
                                <li>
                                    <Link to={"/sign-in"} className='px-4 py-2 text-white text-base rounded-4xl font-semibold bg-[#010e49] hover:bg-[#031461] hover:scale-105 hover:px-[16px] transition-all duration-150 cursor-pointer'>Sign in</Link>
                                </li>
                            </ul>
                        </div>

                        <div className='md:flex grid grid-cols-2 grid-rows-2 place-items-center items-center justify-around mt-8 mb-12 text-base text-[#010e49] font-bold'>

                            <div className='flex gap-1 items-center'>
                                <div className='text-[#df6f00] '>
                                    <IoStar size={20} />
                                </div>
                                <p>host your Quiz</p>
                            </div>

                            <div className='flex gap-1 items-center'>
                                <div className='text-[#df6f00] '>
                                    <IoStar size={20} />
                                </div>
                                <p>Particiapte Quiz</p>
                            </div>

                            <div className='flex gap-1 items-center'>
                                <div className='text-[#df6f00] '>
                                    <IoStar size={20} />
                                </div>
                                <p>Practice Quiz</p>
                            </div>

                            <div className='flex gap-1 items-center'>
                                <div className='text-[#df6f00] '>
                                    <IoStar size={20} />
                                </div>
                                <p>Earn knowledge</p>
                            </div>

                        </div>

                        <div>

                            <div className='w-full flex items-center flex-col text-[#000415]'>
                                <h1 className='font-bold md:text-[80px] text-[45px] top-[20px] right-6 relative md:top-[50px] md:right-[55px]'>Welcome to ,</h1>
                                <div className='md:text-[80px] text-[45px] font-bold flex items-center'>Quizzy budd <p className='md:text-[110px] font-semibold'>y</p> </div>
                                <h1 className='relative md:top-[-33px] md:right-[-60px] text-[#06187e] font-semibold md:text-lg text-sm'>
                                    "Where Challenge. Learn. Repeat."
                                </h1>
                                <button className='px-3 py-3 lg:mt-0 md:mt-4 mt-6 text-white text-base rounded-2xl font-semibold bg-[#010e49] hover:bg-[#031461] hover:scale-105 hover:px-[13px] transition-all duration-150 cursor-pointer flex items-center gap-1'>
                                    <PiShootingStarFill size={20} />
                                    <Link to={"/sign-up"}>start journey</Link>
                                </button>

                            </div>

                            <div className='absolute lg:block hidden top-[48%] right-[10%] opacity-[40%] rotate-[10deg]'>
                                <img src={backimg1} alt="" className='h-[300px]' />
                            </div>

                            <div className='absolute lg:block hidden top-[48%] left-[13%] scale-x-[-1] opacity-[40%] rotate-[358deg]'>
                                <img src={backimg2} alt="" className='h-[300px]' />
                            </div>

                        </div>

                    </div>
                ) : (
                    <div className='bg-[#fcfcfc] min-h-screen'>

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

                            <div className='flex flex-col justify-center w-full gap-4  px-3 '>

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
