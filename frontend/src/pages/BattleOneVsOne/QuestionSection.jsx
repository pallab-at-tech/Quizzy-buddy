import React, { useState, useEffect } from 'react'
import { GiBattleGear } from "react-icons/gi";
import { FaMandalorian } from "react-icons/fa6";

const QuestionSection = () => {

  const [more, setMore] = useState(false)
  const [heights, setHeights] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const height = document.querySelector("#heighBox")?.scrollHeight || 0;
      setHeights(height);
    }, 50);

    return () => clearTimeout(timer);
  }, [])

  console.log("more", heights)

  return (
    <section className={`min-h-screen inset-0 z-50 fixed w-full bg-gradient-to-br from-[#ffffff] to-[#c7d7ee] flex justify-center  ${heights >= 50 ? "py-[30px]" : "py-[35px]"} px-4 gap-0`}>
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl px-6 space-y-6 overflow-auto relative">

        {/* Scoreboard flex justify-between*/}
        <div className='sticky top-0 z-10'>

          <div className='bg-white min-h-[20px]'></div>

          <div className="grid grid-cols-[50%_50%] items-center bg-gradient-to-l to-[#b0c9ff] from-[#bce2f5]  p-5 rounded-b-xl rounded-t-md shadow-sm px-[30px] relative">

            <div className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <GiBattleGear size={28} className='w-[40px] h-[40px] p-1 rounded-full border-[2px] border-blue-500 shadow-md shadow-[#c4cfff] bg-[#e8efff]' />
              You : <span className="font-bold">12</span>
            </div>

            <div className="text-lg font-semibold text-blue-700 justify-self-end flex items-center gap-1.5">
              <div className=''>
                <div>Opponent : <span className="font-bold">9</span></div>
                {/* <p className='absolute bottom-3 right-[80px] text-[12px] tracking-[1px] italic'>gfgjfgdf hvghy gygy gftfdtrd.</p> */}
              </div>
              <FaMandalorian size={25} className='mt-1.5 ml-1.5 w-[40px] h-[40px] p-1 rounded-full border-[2px] border-blue-500 shadow-md shadow-[#c4cfff] bg-[#e8efff]' />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-100 px-5 py-5 rounded-xl shadow-sm relative">

          <p id='heighBox' className={`text-xl font-semibold text-gray-800 leading-tight ${!more ? "line-clamp-2 overflow-y-hidden " : "inline"} select-none`}>
            What is the capital of France?
          </p>

          {
            heights > 50 && (
              !more ? (
                <span onClick={() => setMore((prev) => !prev)} className='text-blue-600 text-[18px] pl-1 font-semibold cursor-pointer hover:underline absolute bottom-[16px] right-[18px]'>more</span>
              ) : (
                <span onClick={() => setMore((prev) => !prev)} className='text-blue-600 text-[18px] pl-1 font-semibold cursor-pointer hover:underline'>less</span>
              )
            )
          }
        </div>

        {/* Options */}
        <div className="space-y-4">
          {["Berlin", "Madrid", "Paris", "Rome"].map((option, idx) => (
            <button
              key={idx}
              className="w-full text-left cursor-pointer bg-white border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition rounded-xl p-4 text-gray-700 font-medium shadow-sm"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className={`flex justify-between items-center ${heights > 50 && "my-4"}`}>

          <button className='bg-purple-600 hover:bg-purple-700 ml-1 text-white cursor-pointer font-semibold py-2 px-6 rounded-xl transition'>
            Submit
          </button>

          <div className='flex justify-end items-center gap-4'>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer font-semibold py-2 px-6 rounded-xl transition">
              Clear
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-2 px-6 rounded-xl transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuestionSection
