import React, { useState, useEffect } from 'react'
import { GiBattleGear } from "react-icons/gi";
import { FaMandalorian } from "react-icons/fa6";
import { useGlobalContext } from '../../provider/GlobalProvider';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate, useBlocker } from 'react-router-dom';

const QuestionSection = () => {

  const { socketConnection } = useGlobalContext()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(state => state?.user)

  const [more, setMore] = useState(false)
  const [heights, setHeights] = useState(0)

  const [countDown, setCountDown] = useState(0)
  const [questionSet, setQuestionSet] = useState(null)
  const [answerArr, setAnswerArr] = useState(Array.from({ length: 10 }).fill("-1"))
  const [scoreStats, setScoreStats] = useState(null)

  const [oppoScore, setOppoScore] = useState(0)
  const [quizFinishing, setQuizFinishing] = useState(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return currentLocation.pathname !== nextLocation.pathname && !localStorage.getItem("left")
    }
  )

  const fetchAndUpdateScore = () => {
    if (!socketConnection || !user || !questionSet || !answerArr || !location.state) return

    const index = Number(questionSet?.index)

    const payload = {
      myUserId: user?._id,
      userAnswer: answerArr[index],
      index: index,
      roomId: location.state?.roomId
    }
    socketConnection.emit("client-score", payload);
  }

  const finishQuiz = () => {
    if (!socketConnection || !location.state || !user || !answerArr) return

    setQuizFinishing(true)

    const payload = {
      payloadRoomId: location.state?.roomId,
      userId: user?._id,
      scoreArray: answerArr
    }
    socketConnection.emit("finish-now", payload)
  }

  const clearLocalStorage = () => {
    localStorage.removeItem("answerArr")
    localStorage.removeItem("questionSet")
    localStorage.removeItem("scoreStats")
    localStorage.removeItem("battle_over")
    localStorage.removeItem("wait-opp")
  }

  // update local storage for every page refresh
  useEffect(() => {
    const hasAnsArray = localStorage.getItem("answerArr")
    const hasQuestionArray = localStorage.getItem("questionSet")
    const hasScore = localStorage.getItem("scoreStats")

    if (hasQuestionArray) {
      const x = JSON.parse(hasQuestionArray)
      setQuestionSet(x)
    }

    if (hasAnsArray) {
      const x = JSON.parse(hasAnsArray)
      setAnswerArr(x)
    }

    if (hasScore) {
      const x = JSON.parse(hasScore)
      setScoreStats(x)
    }

    // return () => localStorage.removeItem("left")
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const height = document.querySelector("#heighBox")?.scrollHeight || 0;
      setHeights(height);
    }, 50);

    return () => clearTimeout(timer);
  }, [])

  // ReEstablish connection...
  useEffect(() => {
    if (!socketConnection || !location.state?.roomId) return

    const reConnecFunc = () => {
      socketConnection.emit("reConnect-room", {
        roomId: location.state?.roomId
      })
    }

    socketConnection.on("connect", reConnecFunc);

    return () => socketConnection.off("connect", reConnecFunc)

  }, [socketConnection, location.state?.roomId])

  // fetchAndUpdateScore and finishQuiz
  useEffect(() => {
    if (!countDown) return;

    const canSendScore =
      socketConnection &&
      user &&
      questionSet &&
      answerArr &&
      typeof questionSet.index === "number";

    if (!canSendScore) return;

    const index = Number(questionSet?.index)

    if (countDown === 1) {
      fetchAndUpdateScore();
      if (index === 9) {
        finishQuiz()
      }
    }
  }, [countDown, socketConnection, user, questionSet, answerArr, location]);

  // fetch events of other sockets
  useEffect(() => {

    if (!socketConnection) return

    socketConnection.on("reconnected_success", (recData) => {
      toast.success(recData?.message)
    })

    socketConnection.on("battle_countDown", (countData) => {
      setCountDown(() => countData?.timeLeft)
    })

    socketConnection.on("new_question", (questionData) => {
      setQuestionSet(questionData)
      localStorage.setItem("questionSet", JSON.stringify(questionData))
    })

    socketConnection.on("score-update", (scoreData) => {
      setScoreStats(scoreData)
      localStorage.setItem("scoreStats", JSON.stringify(scoreData))
    })

    socketConnection.once("wait-opp", (data) => {
      if (data?.message) {
        localStorage.setItem("wait-opp", "done")
      }
      if (data?.scores) {
        setScoreStats(data?.scores)
        localStorage.setItem("scoreStats", JSON.stringify(data?.scores))
      }
      setQuizFinishing(false)
    })

    socketConnection.once("battle_over", (battle_data) => {
      if (battle_data?.message) {
        toast.success(battle_data?.message)
        localStorage.setItem("battle_over", "done")
        localStorage.removeItem("wait-opp")
      }
      if (battle_data?.scores) {
        setScoreStats(battle_data?.scores)
        localStorage.setItem("scoreStats", JSON.stringify(battle_data?.scores))
      }
      setQuizFinishing(false)
    })

    return () => {
      socketConnection.off("reconnected_success")
      socketConnection.off("battle_countDown")
      socketConnection.off("new_question")
      socketConnection.off("score-update")
      socketConnection.off("wait-opp")
      socketConnection.off("battle_over")
    }

  }, [socketConnection])

  // opponents score update
  useEffect(() => {
    if (!scoreStats?.scoreMap || !user?._id) return;

    const scoreMap = scoreStats.scoreMap;
    const myId = user._id;

    // get keys safely
    const keys = Object.keys(scoreMap);

    // opponent = any user except me
    const opponentId = keys.find(k => k !== myId);

    if (!opponentId) {
      setOppoScore(0);
      return;
    }

    const opponentScore = scoreMap[opponentId]?.score ?? 0;
    setOppoScore(opponentScore);

  }, [scoreStats, user]);


  return (
    <>
      <section className={`h-screen inset-0 z-50 fixed w-full bg-gradient-to-br ${questionSet ? "from-[#ffffff] to-[#c7d7ee]" : "from-[#fffafa] to-[#c7d7ee]"} flex justify-center  ${heights >= 50 ? "sm:py-[30px]" : "sm:py-[35px]"} sm:px-4 gap-0`}>
        {
          questionSet ? (
            <div className="h-screen custom-sm:h-[700px] custom-lg:h-auto my-auto w-full sm:w-[600px] custom-lg:max-w-3xl bg-white shadow-xl rounded-2xl px-6 space-y-6 overflow-auto relative pb-6">

              {/* Scoreboard */}
              <div className='sticky top-0 z-10'>

                <div className='bg-white min-h-[25px] sm:min-h-[20px]'></div>

                <div className="grid grid-cols-3 items-center bg-gradient-to-l to-[#b0c9ff] from-[#bce2f5] p-3.5 sm:p-5 rounded-b-xl rounded-t-md shadow-sm px-6 sm:px-[30px] relative">

                  <div className="text-[16px] sm:text-lg font-semibold text-blue-700 flex sm:flex-row flex-col sm:items-center sm:gap-2">
                    <div className='flex sm:gap-2 flex-col sm:flex-row items-center w-fit sm:w-auto'>
                      <GiBattleGear size={28} className='w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] p-1 rounded-full border-[2px] border-blue-500 shadow-md shadow-[#c4cfff] bg-[#e8efff]' />
                      <span className="font-bold">You : {(scoreStats && user && scoreStats?.scoreMap[user?._id]) ? scoreStats?.scoreMap[user?._id]?.score : 0}</span>
                    </div>
                  </div>

                  <div className='justify-self-center'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-blue-700 font-semibold text-[22px] hidden sm:block'>Count</span>
                      <div className='w-[40px] h-[40px] flex items-center justify-center text-blue-700 font-bold text-lg p-1 rounded-full border-[2px] border-blue-500 shadow-md shadow-[#c4cfff] bg-[#e8efff]'>
                        {countDown || 10}
                      </div>
                      <span className='text-blue-700 font-semibold text-[22px] hidden sm:block'>Down</span>
                    </div>
                  </div>

                  <div className="text-[16px] sm:text-lg font-semibold text-blue-700 justify-self-end flex sm:flex-row flex-col-reverse items-center sm:gap-1.5">
                    <div className=''>
                      <div className="font-bold">Rival : <span >{oppoScore ? oppoScore : 0}</span></div>
                      {/* <p className='absolute bottom-3 right-[80px] text-[12px] tracking-[1px] italic'>gfgjfgdf hvghy gygy gftfdtrd.</p> */}
                    </div>
                    <FaMandalorian size={25} className='sm:mt-1.5 sm:ml-1.5 w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] p-1 rounded-full border-[2px] border-blue-500 shadow-md shadow-[#c4cfff] bg-[#e8efff]' />
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="bg-gray-100 p-3 sm:p-5 rounded-xl shadow-sm relative">

                <p id='heighBox' className={`text-xl font-semibold text-gray-800 leading-tight ${!more && "line-clamp-2 overflow-y-hidden "} select-none`}>
                  <span>{`Q.${Number(questionSet?.index) + 1} ) `}</span>
                  {`${questionSet?.question?.question}`}
                </p>

                {heights > 52 && (
                  <div className="flex justify-end">
                    <span
                      onClick={() => setMore(prev => !prev)}
                      className="text-blue-600 text-[18px] font-semibold cursor-pointer hover:underline"
                    >
                      {more ? "less" : "more"}
                    </span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                {
                  questionSet?.question?.options.map((v, i) => {
                    return <label key={i} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${answerArr && Number(answerArr[questionSet?.index]) === Number(i) ? "bg-purple-300 border-purple-500" : "hover:bg-purple-50 border-gray-300"}`}>
                      <input
                        type="radio"
                        checked={answerArr && answerArr[questionSet?.index] === i}
                        className={`w-5 h-5 accent-purple-600 cursor-pointer`}
                        value={i}
                        onChange={() => {
                          setAnswerArr((prev) => {
                            if (!prev) return prev

                            const newArr = [...prev]
                            newArr[questionSet?.index] = i
                            localStorage.setItem("answerArr", JSON.stringify(newArr))

                            return newArr
                          })
                        }}
                      />
                      <span className="text-gray-800 text-lg">{v}</span>
                    </label>
                  })
                }
              </div>

              {/* Navigation Buttons */}
              <div className={`flex justify-between items-center ${heights > 52 && "my-4"}`}>

                <button
                  onClick={() => {
                    finishQuiz()
                  }}
                  className='bg-purple-600 hover:bg-purple-700 ml-1 text-white cursor-pointer font-semibold py-2 px-6 rounded-xl transition'
                >
                  Submit
                </button>

                <div className='flex justify-end items-center gap-4'>
                  <button
                    onClick={() => {
                      setAnswerArr((prev) => {
                        if (!questionSet) return prev
                        const newArr = [...prev]
                        newArr[Number(questionSet?.index)] = '-1'
                        localStorage.setItem("answerArr", JSON.stringify(newArr))
                        return newArr
                      })
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer font-semibold py-2 px-6 rounded-xl transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-center bg-gradient-to-br'>
              <h1 className='text-[28px] sm:text-4xl animate-pulse'>
                <strong>
                  Fetching Question ...
                </strong>
              </h1>
            </div>
          )
        }
      </section>

      {
        blocker.state === "blocked" ? (
          <section className='fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50'>
            <div className="bg-white w-[500px] p-8 rounded-3xl shadow-xl border border-gray-100 relative mx-3">

              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Are you sure you want to leave?
              </h1>

              <h2 className="text-gray-500 mb-6">
                Leaving will cause you to early submit Quiz.
              </h2>

              <div className="flex items-center justify-end gap-4">

                <button
                  onClick={() => {
                    blocker.reset()
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    finishQuiz()
                    localStorage.setItem("left", "done")
                    blocker.proceed()
                    navigate("/battle-1v1", { replace: true })
                    clearLocalStorage()
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-sm transition-all cursor-pointer"
                >
                  Proceed
                </button>

              </div>
            </div>
          </section>
        ) : localStorage.getItem("battle_over") ? (
          <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl px-4">

            <div className="relative bg-gradient-to-br from-[#464545] to-white/10 backdrop-blur-2xl border-[3px] border-gray-400
            shadow-2xl rounded-3xl px-8 sm:px-10 py-6 sm:py-8 w-full max-w-lg text-white outline-none mx-3 sm:mx-0"
            >

              {/* Title */}
              <h1 className="text-[28px] sm:text-4xl font-extrabold tracking-wide mb-6">
                🎉 Battle Over!
              </h1>

              {/* Score Box */}
              <div className="mt-4 space-y-4">

                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/20">
                  <p className="text-lg font-semibold">Your Score</p>
                  <span className="text-3xl font-bold text-green-300 drop-shadow-md">
                    {(scoreStats && user && scoreStats?.scoreMap[user?._id]) ? scoreStats?.scoreMap[user?._id]?.score : 0}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/20">
                  <p className="text-lg font-semibold">Opponent Score</p>
                  <span className="text-3xl font-bold text-red-300 drop-shadow-md">
                    {oppoScore ? oppoScore : 0}
                  </span>
                </div>

              </div>

              {/* Button */}
              <button
                onClick={() => {
                  localStorage.setItem("left", "done")
                  navigate("/battle-1v1");
                  clearLocalStorage();
                }}
                className="mt-8 w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-400/60 to-purple-400/60
                hover:from-indigo-400/40 hover:to-purple-400/40 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </section>
        ) : localStorage.getItem("wait-opp") ? (
          <section className='h-screen inset-0 z-50 fixed w-full flex items-center justify-center backdrop-blur-[5px]'>
            <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl px-4">

              <div className="relative bg-gradient-to-br from-[#464545] to-white/10 backdrop-blur-2xl border-[3px] border-gray-400
              shadow-2xl rounded-3xl px-8 sm:px-10 py-6 sm:py-8 w-full max-w-lg text-white outline-none mx-3 sm:mx-0"
              >

                {/* Title */}
                <div className="text-2xl sm:text-3xl font-extrabold tracking-wide flex items-center gap-3 custom-sm:gap-3 custom-lg:gap-5  mb-6">
                  <div>Wait For Opponent !?</div>
                  <span className='wait_loader'></span>
                </div>

                {/* Score Box */}
                <div className="mt-4 space-y-4">

                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/20">
                    <p className="text-lg font-semibold">Your Score</p>
                    <span className="text-3xl font-bold text-green-300 drop-shadow-md">
                      {(scoreStats && user && scoreStats?.scoreMap[user?._id]) ? scoreStats?.scoreMap[user?._id]?.score : 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/20">
                    <div className="text-lg font-semibold flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      Opponent Score 
                      <span className='text-red-400 animate-pulse'>( updating... )</span>
                    </div>

                    <span className="text-3xl font-bold text-red-300 drop-shadow-md">
                      {oppoScore ? oppoScore : 0}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => {
                    localStorage.setItem("left", "done")
                    navigate("/battle-1v1");
                    clearLocalStorage();
                  }}
                  className="mt-8 w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-400/60 to-purple-400/60
                hover:from-indigo-400/40 hover:to-purple-400/40 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </section>
          </section>
        ) : quizFinishing && (
          <section className='min-h-screen inset-0 z-50 fixed w-full flex flex-col gap-3.5 items-center justify-center backdrop-blur-[5px]'>
            <div className='participants_loader'></div>
            <h1 className='font-bold text-[20px] text-[#04558b]'>Submitting...</h1>
          </section>
        )
      }
    </>
  )
}

export default QuestionSection
