import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiTimer } from 'react-icons/bi'
import { FaClipboardQuestion } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router-dom'

const QuizPage = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [aArr, setaArr] = useState(null)
  const [timer, setTimer] = useState(null)

  const [submitLoading, setSubmitLoading] = useState(false)


  useEffect(() => {
    if (!location.state?.data) {
      return
    }
    setData(location.state?.data)

    return () => {

    }
  }, [])

  // set default answer
  useEffect(() => {
    if (!data) return

    const isStore = localStorage.getItem("ans")
    const arr = localStorage.getItem("aArr")

    if (!isStore) {
      const ansArr = []

      for (let i = 0; i < data?.question_details.length; i++) {
        ansArr.push({
          _id: data?.question_details[i]._id,
          userAns: -1
        })
      }
      setAnswer(ansArr)
      localStorage.setItem("ans", JSON.stringify(ansArr))
    }
    else {
      const stored = JSON.parse(isStore);
      setAnswer(stored)
    }

    if (!arr) {
      const x = []
      for (let i = 0; i < data?.question_details.length; i++) {
        x.push(-1)
      }
      setaArr(x)
      localStorage.setItem("aArr", JSON.stringify(x))
    }
    else {
      const stored = JSON.parse(arr);
      setaArr(stored)
    }

    return () => {
      localStorage.removeItem("ans")
      localStorage.removeItem("aArr")
    }
  }, [data])

  // store index in local storage
  useEffect(() => {
    const i = localStorage.getItem("index")
    if (!i) {
      localStorage.setItem("index", 0)
      setIndex(0)
    }
    else {
      setIndex(Number(i));
    }

    return () => {
      localStorage.removeItem("index")
      localStorage.removeItem("tim")
      localStorage.removeItem("submit")
    }
  }, [])

  // change timer
  useEffect(() => {
    if (!data) return;

    const constant = data.timeTaken;
    let stored = localStorage.getItem("tim");
    const isAlreadySubmit = localStorage.getItem("submit")

    // initialize timer
    if (!stored) {
      const obj = {
        time: constant.unit === "sec" ? constant.time : constant.time * 60,
        time_count: 0,
      };
      localStorage.setItem("tim", JSON.stringify(obj));
      setTimer(obj);
    } else {
      setTimer(JSON.parse(stored));
    }

    if(isAlreadySubmit) return

    const timerId = setInterval(() => {
      setTimer((prev) => {
        const totalPerQ = constant.unit === "sec" ? constant.time : constant.time * 60;

        // If time ends
        if (prev.time <= 0) {

          // LAST QUESTION → auto submit
          if (index === data.question_details.length - 1) {
            clearInterval(timerId);

            const obj = {
              time: 0,
              time_count: prev.time_count + totalPerQ
            };

            localStorage.setItem("tim", JSON.stringify(obj));
            setTimer(obj);

            // Auto-submit
            navigate("/")
            localStorage.setItem("submit",1)
            return obj;
          }

          // NOT LAST QUESTION → move next safely
          setIndex((prevI) => {
            localStorage.setItem("index", prevI + 1);
            return prevI + 1;
          });

          const obj = {
            time: totalPerQ,
            time_count: prev.time_count + totalPerQ
          };

          localStorage.setItem("tim", JSON.stringify(obj));
          return obj;
        }

        // decrement normally
        const obj = {
          time: prev.time - 1,
          time_count: prev.time_count
        };
        localStorage.setItem("tim", JSON.stringify(obj));
        return obj;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [data, index]);

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

  // console.log("Location", data?.question_details[index])
  console.log("answer array", timer)

  return (
    <div>
      {
        data ? (
          <div className='fixed overflow-y-auto inset-0 z-50  bg-gradient-to-br from-purple-100 via-purple-100 to-teal-100 py-[80px]'>

            <div className='bg-white min-w-[850px] max-w-[850px] shadow-md rounded-xl mx-[300px] px-10 py-8'>

              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className="text-2xl font-bold text-gray-800  flex items-center gap-2">
                  <FaClipboardQuestion size={24} className="text-blue-600" />
                  {`Question ${index + 1} )`}
                </div>

                <div className={`flex gap-1.5 items-center ${timer && Number(timer.time) <= 5 ? "bg-red-200" : "bg-blue-200 "} shadow-md rounded-md px-3.5 py-1.5`}>
                  <BiTimer size={32} className={`${timer && Number(timer.time) <= 5 ? "text-red-600 animate-pulse" : "text-blue-600"}`} />
                  <div className='text-[18px]'>{timer && formatTime(Number(timer?.time))}</div>
                </div>
              </div>

              {/* questions */}
              <div className='w-full p-2 text-lg font-semibold mb-3 text-gray-800'>
                {data?.question_details[index].question}
              </div>

              {/* options */}
              <div className='flex flex-col gap-4 mb-3'>
                {
                  data && data?.question_details[index].options.map((v, i) => {
                    return (
                      <label key={i}
                        className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer ${aArr && Number(aArr[index]) === Number(i) ? "bg-purple-300 border-purple-500" : "hover:bg-purple-50 border-gray-300"} transition-all`}
                      >
                        <input
                          type="radio"
                          name='answer'
                          checked={aArr && aArr[index] === i}
                          value={i}
                          className={`w-5 h-5 accent-purple-600 cursor-pointer`}
                          onChange={() => {
                            setAnswer((prev) => {
                              const updated = [...prev]
                              updated[index] = {
                                ...updated[index],
                                userAns: i
                              }
                              localStorage.setItem("ans", JSON.stringify(updated))
                              return updated
                            })

                            setaArr((prev) => {
                              const x = [...prev]
                              x[index] = i
                              localStorage.setItem("aArr", JSON.stringify(x))
                              return x
                            })
                          }}
                        />
                        <span className="text-gray-800 text-lg">{v}</span>
                      </label>
                    )
                  })
                }
              </div>

              {/* next and previous */}
              <div className="flex items-center justify-between mt-6 w-full">

                {/* finish */}
                <button
                  disabled={submitLoading}
                  className={` ${submitLoading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-500 hover:bg-blue-600"}  text-white font-bold px-8 py-2.5 rounded-lg transition-all duration-200 active:scale-95`}
                  onClick={() => {
                    // removeDetails()
                    // handleFinishQuiz()
                  }}
                >
                  {`${submitLoading ? "Submitting..." : "Finish"}`}
                </button>

                <div className='flex items-center justify-end gap-8'>

                  {/* Next Button */}
                  <button
                    className={`${index >= data?.question_details.length - 1 ? "cursor-not-allowed bg-purple-400" : "cursor-pointer bg-purple-600 hover:bg-purple-700"} text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200`}
                    onClick={() => {
                      if (!data?.question_details.length || index >= data?.question_details.length - 1) return
                      setIndex((prevIdx) => {
                        localStorage.setItem("index",prevIdx+1)
                        return prevIdx + 1
                      })

                      setTimer((prev) => {

                        const countSec = data?.timeTaken.unit === "sec" ? Number(data?.timeTaken.time) : Number(data?.timeTaken.time) * 60
                        const obj = {
                          time : countSec,
                          time_count : prev.time_count + (countSec-Number(prev.time))
                        }

                        localStorage.setItem("tim",JSON.stringify(obj))
                        return obj
                      })
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className='h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-purple-300 to-teal-200'>
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
                Unauthorized entry detected. Please return to the main page or contact our administrator.
              </p>

              {/* Action Button */}
              <button
                onClick={() => window.location.href = '/'}
                className="mt-6 cursor-pointer  bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default QuizPage
