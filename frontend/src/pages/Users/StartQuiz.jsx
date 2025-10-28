import React, { useEffect, useState } from 'react'
import { FaClipboardQuestion } from 'react-icons/fa6'
import { useLocation } from 'react-router-dom'
import { BiTimer } from "react-icons/bi";

const StartQuiz = () => {

    const location = useLocation()
    const data = location.state?.data

    const [index, setIndex] = useState(Number(localStorage.getItem("i")) || 0)
    const [question, setQuestion] = useState(data?.quiz_data[index] || {})

    // store answer and it't all details
    const [answer, setAnswer] = useState(null)

    // store  correct answer
    const [ansArray, setAnsArray] = useState(null)

    // store time
    const [timer, setTimer] = useState(null)

    const setDefaultAnswer = () => {
        const solved = []
        data.quiz_data.forEach((q) => {
            solved.push({
                q_id: q?._id,
                userAnswer: ""
            })
        })

        return {
            solved: solved || []
        }
    }

    // persist all answer and it't all details , also persist time
    useEffect(() => {
        // answer persist
        const ans = localStorage.getItem("ans");

        if (ans) {
            try {
                setAnswer(JSON.parse(ans));
            } catch (e) {
                console.error("Invalid data in localStorage, resetting:", e);
                const obj = setDefaultAnswer();
                setAnswer(obj);
                localStorage.setItem("ans", JSON.stringify(obj));
            }
        } else {
            const obj = setDefaultAnswer();
            setAnswer(obj);
            localStorage.setItem("ans", JSON.stringify(obj));
        }

        // time persist
        const time = localStorage.getItem("tim")

        if (time) {
            try {
                setTimer(JSON.parse(time));
            } catch (e) {
                console.error("Invalid data in localStorage, resetting:", e);
                setTimer({
                    t: 0,
                    total: 0
                })
                localStorage.setItem("tim", JSON.stringify({
                    t: 0,
                    total: 0
                }));
            }
        }
        else {
            setTimer({
                t: 0,
                total: 0
            })
            localStorage.setItem("tim", JSON.stringify({
                t: 0,
                total: 0
            }));
        }

        return () => {
            localStorage.removeItem("ans")
            localStorage.removeItem("tim")
            localStorage.removeItem("submit")
        }

    }, [])

    // persist correct answer
    useEffect(() => {
        const aArr = localStorage.getItem("aArr")

        if (aArr) {

            try {
                setAnsArray(JSON.parse(aArr))
            } catch (e) {
                console.error("Invalid data in localStorage, resetting:", e);

                const x = Array.from({ length: data?.quiz_data.length }, () => -1)
                setAnsArray(x)
                localStorage.setItem("aArr", JSON.stringify(x))
            }
        }
        else {
            const x = Array.from({ length: data?.quiz_data.length }, () => -1)
            setAnsArray(x)
            localStorage.setItem("aArr", JSON.stringify(x))
        }

        return () => {
            localStorage.removeItem("aArr")
        }
    }, [data])

    // persist current question index
    useEffect(() => {
        setQuestion(data?.quiz_data[index] || {})
        localStorage.setItem("i", index)

        return () => {
            localStorage.removeItem("i")
        }
    }, [index])

    // change time for unstrict time and strict time
    useEffect(() => {

        const x = localStorage.getItem("submit")

        if (x) {
            return
        }

        if (data?.strict?.enabled) {
            setTimer((prev) => {
                if (data?.strict?.unit !== "sec") {
                    return { ...prev, t: data?.strict?.time * 60 }
                }
                else {
                    return { ...prev, t: data?.strict?.time }
                }
            })
        }

        const timer = setInterval(() => {
            if (data?.strict?.enabled) {

                setTimer((prev) => {

                    if (prev?.t === 0) {
                        // change index
                        setIndex((prevIdx) => {
                            if (prevIdx >= data?.quiz_data.length - 1) {
                                clearInterval(timer)
                                localStorage.setItem("submit", JSON.stringify({ submit: true }))
                                return prevIdx
                            }
                            else {
                                return prevIdx + 1
                            }
                        })

                        if (data?.strict?.unit !== "sec") {
                            return Number(index) === Number(data?.quiz_data.length - 1) ? { ...prev, t: 0 } : { ...prev, t: data?.strict?.time * 60 }
                        }
                        else {
                            return Number(index) === Number(data?.quiz_data.length - 1) ? { ...prev, t: 0 } : { ...prev, t: data?.strict?.time }
                        }
                    }
                    else {
                        const updated = { ...prev, t: prev?.t - 1 }
                        localStorage.setItem("tim", JSON.stringify(updated))
                        return updated
                    }
                })
            }
            else {
                setTimer((prev) => {
                    const updated = { ...prev, t: prev?.t + 1 }
                    localStorage.setItem("tim", JSON.stringify(updated))
                    return updated
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // format time for unstruct mode
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    };

    // console.log("data", answer)
    // console.log("Q", timer)

    return (
        <section>
            {
                location.state?.on_Quiz ? (
                    <section className='fixed overflow-y-auto inset-0 z-50  bg-gradient-to-br from-purple-100 via-purple-100 to-teal-100'>

                        <div className={`bg-white  min-w-[850px] max-w-[850px] shadow-md rounded-xl mx-[300px] ${question?.inputBox ? "my-[180px]" : "my-[80px]"} px-10 py-8`}>

                            <div className='flex items-center justify-between mb-4'>

                                {/* questions */}
                                <div className="text-2xl font-bold text-gray-800  flex items-center gap-2">
                                    <FaClipboardQuestion size={24} className="text-blue-600" />
                                    {`Question ${index + 1} )`}
                                </div>

                                {/* timer */}
                                {
                                    data?.strict?.enabled ? (
                                        <div className={`flex gap-1.5 items-center ${Number(timer?.t) <= 5 ? "bg-red-200" : "bg-blue-200 "} shadow-md rounded-md px-3.5 py-1.5`}>
                                            <BiTimer size={32} className={`${Number(timer?.t) <= 5 ? "text-red-600 animate-pulse" : "text-blue-600"}`} />
                                            {answer && <div className='text-[18px]'>{formatTime(Number(timer?.t))}</div>}
                                        </div>
                                    ) : (
                                        <div className='flex gap-1.5 items-center bg-blue-200 shadow-md rounded-md px-3.5 py-1.5'>
                                            <BiTimer size={32} className='text-blue-600' />
                                            {answer && <div className='text-[18px]'>{formatTime(Number(timer?.t))}</div>}
                                        </div>
                                    )
                                }
                            </div>

                            {/* image */}
                            <div>
                                {
                                    question?.image && (
                                        <div className=''>
                                            <img src={question?.image} alt="" className='w-full max-h-[220px] object-contain rounded-lg border' />
                                        </div>
                                    )
                                }
                            </div>

                            {/* question */}
                            <div className='w-full p-2 text-lg font-semibold  mb-3 text-gray-800'>
                                {question?.question}
                            </div>

                            {/* answer or option */}
                            <div>
                                {
                                    question?.inputBox ? (
                                        <textarea
                                            value={answer?.solved[index]?.userAnswer}
                                            onChange={(e) => {

                                                setAnswer((prev) => {
                                                    const updatedSolved = [...prev.solved]
                                                    updatedSolved[index] = {
                                                        ...updatedSolved[index],
                                                        userAnswer: e.target.value
                                                    }

                                                    const updated = { ...prev, solved: updatedSolved }

                                                    localStorage.setItem("ans", JSON.stringify(updated))
                                                    return updated
                                                })
                                            }}
                                            placeholder="Enter the correct answer..."
                                            className="w-full min-h-[70px] max-h-[150px] p-3 border-2 border-gray-300 rounded-md outline-none transition">
                                        </textarea>
                                    ) : (
                                        <div className="flex flex-col gap-4 mb-3">
                                            {
                                                question?.options.map((v, i) => (
                                                    <label
                                                        key={i}
                                                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer ${ansArray && Number(ansArray[index]) === Number(i) ? "bg-purple-300 border-purple-500" : "hover:bg-purple-50 border-gray-300"} transition-all`}
                                                        id={`i-${i}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="answer"
                                                            value={i}
                                                            checked={Number(ansArray?.[index]) === i}
                                                            className={`w-5 h-5 accent-purple-600 cursor-pointer`}
                                                            onChange={() => {
                                                                setAnswer((prev) => {
                                                                    const updatedSolved = [...prev.solved]
                                                                    updatedSolved[index] = {
                                                                        ...updatedSolved[index],
                                                                        userAnswer: i
                                                                    }

                                                                    const updated = { ...prev, solved: updatedSolved }

                                                                    localStorage.setItem("ans", JSON.stringify(updated))
                                                                    return updated
                                                                })

                                                                setAnsArray((prev) => {
                                                                    const x = ansArray
                                                                    x[index] = i

                                                                    localStorage.setItem("aArr", JSON.stringify(x))
                                                                    return x
                                                                })
                                                            }}
                                                        />
                                                        <span className="text-gray-800 text-lg">{v}</span>
                                                    </label>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>

                            {/* next and previous */}
                            <div className="flex items-center justify-between mt-6 w-full">

                                {/* finish */}
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold px-8 py-2.5 rounded-lg transition-all duration-200 active:scale-95"
                                // onClick={handleFinish}
                                >
                                    Finish
                                </button>

                                <div className='flex items-center justify-end gap-8'>
                                    {
                                        !data?.strict?.enabled && (
                                            // Previous Button
                                            <button
                                                className={`${index === 0 ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-gray-300 hover:bg-gray-400"}  text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200`}
                                                onClick={() => {
                                                    if (!data?.quiz_data.length || index === 0) return
                                                    setIndex(index - 1)
                                                }}
                                            >
                                                Previous
                                            </button>
                                        )
                                    }

                                    {/* Next Button */}
                                    <button
                                        className={`${index >= data?.quiz_data.length - 1 ? "cursor-not-allowed bg-purple-400" : "cursor-pointer bg-purple-600 hover:bg-purple-700"} text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200`}
                                        onClick={() => {
                                            if (!data?.quiz_data.length || index >= data?.quiz_data.length - 1) return
                                            setIndex((prevIdx) => {
                                                return prevIdx + 1
                                            })

                                            if (data?.strict?.enabled) {
                                                setTimer((prev) => {

                                                    if (data?.strict?.unit !== "sec") {
                                                        return { ...prev, t: data?.strict?.time * 60 }
                                                    }
                                                    else {
                                                        return { ...prev, t: data?.strict?.time }
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-purple-300 to-teal-200 z-50">
                        <div className="text-center space-y-4">
                            {/* Warning Icon */}
                            <div className="flex justify-center">
                                <span className="text-red-400 text-7xl animate-pulse">⚠️</span>
                            </div>

                            {/* Main Text */}
                            <h1 className="text-6xl font-extrabold tracking-widest drop-shadow-lg">
                                ILLEGAL ACCESS
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg  max-w-md mx-auto text-gray-900 font-medium">
                                Unauthorized entry detected. Please return to the main page or contact your administrator.
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={() => window.location.href = '/'}
                                className="mt-6 cursor-pointer  bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                            >
                                Go Back
                            </button>
                        </div>
                    </section>
                )
            }
        </section>
    )
}

export default StartQuiz
