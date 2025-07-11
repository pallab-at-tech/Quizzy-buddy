import React from 'react'
import { IoStar } from "react-icons/io5";
import backimg1 from "../assets/q2-edit.png"
import backimg2 from "../assets/q3-edit.png"
import { PiShootingStarFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {

    const user = useSelector(state => state.user)

    console.log("From home page user", user)
    return (
        <section >

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
                    <div>

                    </div>
                )
            }



        </section>
    )
}

export default Home
