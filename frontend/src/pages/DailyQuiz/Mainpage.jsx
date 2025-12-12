import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SumarryApi";
import { useEffect } from "react";

const Mainpage = () => {

    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const [time, setTime] = useState(null)
    const [ButtonText, setButtonText] = useState("Start Quiz")
    const [quizLoading, setQuizLoading] = useState(false)

    const isAlreadyAttendQuiz = (last_date) => {

        if (!last_date) return false;

        const now = new Date();
        const last = new Date(last_date);

        // Extract date parts for comparison
        const isSameDay =
            now.getFullYear() === last.getFullYear() &&
            now.getMonth() === last.getMonth() &&
            now.getDate() === last.getDate();

        return isSameDay;
    };

    const startQuiz = async () => {
        try {
            setQuizLoading(true)

            const response = await Axios({
                ...SummaryApi.startQuiz
            })

            const { data: responseData } = response

            if (responseData.success) {
                setTime(10)

                const setTimeOut = setInterval(() => {
                    setTime((prev) => {
                        if (prev <= 1) {
                            clearInterval(setTimeOut)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)

                setTimeout(() => {
                    // navigate to next page within data...
                    navigate(`/daily-quiz/${user?._id}`, {
                        state: {
                            data: responseData?.data
                        }
                    })
                }, 10000)
            }
            else {
                toast.error(responseData.message)
            }

            setQuizLoading(false)

        } catch (error) {
            toast.error(error.response.data.message || "Some error occued!")
            setQuizLoading(false)
            console.log("error", error)
        }
    }

    const ButtonTextFunc = () => {

        setButtonText("Starting...")
        
        const run = [
            "Check validation..",
            "Wait a Sec...",
            "About to start..."
        ]

        let index = 0

        const interval = setInterval(() => {
            if (!quizLoading) {
                setButtonText("Start Quiz")
                clearInterval(interval)
            }
            else if(run.length <= index){
                setButtonText(run[run.length -1])
            }
            else {
                setButtonText(run[index])
                index++
            }
        }, 3000);

        return interval
    }

    useEffect(() => {

        let intervalId;

        if (quizLoading) {
            intervalId = ButtonTextFunc();
        } else {
            setButtonText("Start Quiz");
        }

        return () => clearInterval(intervalId);
    }, [quizLoading])


    return (
        <section className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 px-4">

            {
                isAlreadyAttendQuiz(user?.daily_strict_count?.last_date) ? (
                    <div className="text-center -mt-[20px]">
                        <h1 className="text-[45px] font-bold text-red-600 drop-shadow">
                            You already attended today’s quiz 🎉
                        </h1>

                        <p className="text-red-800 mt-0">
                            Come back tomorrow after 12 AM for the next quiz!
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-7 cursor-pointer text-white bg-red-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <div className="text-center overflow-hidden">

                        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 drop-shadow-lg">
                            Are you ready for the Daily Quiz?
                        </h1>

                        <p className="text-blue-800 mt-3 text-lg">
                            Test your knowledge. New quiz every day at 12 AM!
                        </p>

                        <button
                            disabled={time || quizLoading}
                            onClick={() => startQuiz()}
                            className={`
                            mt-8 
                            bg-[#164dd7]
                            text-white 
                            font-bold 
                            px-8 
                            py-3 
                            rounded-xl 
                            shadow-xl 
                            hover:scale-105 
                            transition-transform 
                            duration-200
                            ${quizLoading ? "cursor-not-allowed" : "cursor-pointer"}
                                `}
                        >
                            {ButtonText}
                        </button>

                        {/* ⚠️ WARNING NOTE */}
                        <p className="mt-5 text-sm text-red-600 font-semibold">
                            ⚠️ Do not leave or go back once the quiz starts.
                            You will not be able to re-attempt it.
                        </p>
                    </div>
                )
            }

            {
                time && (
                    <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8c] backdrop-blur-[4px] z-50">

                        <div className="bg-white shadow-2xl rounded-2xl px-10 py-8 text-center animate-scaleUp">

                            <h2 className="text-3xl font-bold text-indigo-700">
                                Your Quiz Starts In
                            </h2>

                            <div className="mt-6 text-6xl font-extrabold text-indigo-600 tracking-wide">
                                {`${time}`}
                            </div>

                            <p className="mt-3 text-gray-600">
                                Get Ready!
                            </p>
                        </div>

                    </section>

                )
            }

        </section>
    );
};

export default Mainpage;
