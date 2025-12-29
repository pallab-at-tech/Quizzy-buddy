import { useEffect, useState } from 'react'
import { useParams, Outlet, useNavigate } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'
import toast from 'react-hot-toast'
import { MdPlayCircle } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../../provider/GlobalProvider'

const QuizJoined = () => {

  const params = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  const { socketConnection } = useGlobalContext()

  const user = useSelector(state => state?.user)
  const navigate = useNavigate()
  const [count, setCount] = useState(null)


  const fetch_quizDetails = async () => {

    if (!params?.hostId) return

    try {
      const response = await Axios({
        ...SummaryApi.fetch_participants_quiz_details,
        params: {
          hostId: params?.hostId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData?.data)
      }

      if (!responseData.success) {
        toast.error(responseData?.message)
        setError(responseData?.message)
      }

    } catch (error) {
      toast.error(error.response.data.message || "Some Error occued!")
      setError(error.response.data.message || "Some Error occued!")
      console.log("fetch_quizDetails error", error)
    }
  }

  useEffect(() => {
    fetch_quizDetails()
  }, [])

  const localDateFormate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  const quizStatus = (start, end) => {
    const now = new Date()
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (startDate < now && now < endDate) {
      return "Ongoing"
    }
    else if (startDate > now) {
      return "Incoming"
    }
    else {
      return "Expired"
    }
  }

  const quizDuration = (start, end) => {

    const diff = Math.floor((new Date(end) - new Date(start)) / 1000);

    if (diff > 86400) {
      const days = (diff / 86400).toFixed(1);
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (diff > 3600) {
      const hours = (diff / 3600).toFixed(1);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (diff > 60) {
      const minutes = (diff / 60).toFixed(1);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `${diff} second${diff > 1 ? "s" : ""}`;
    }
  };

  const startQuiz = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.check_canParticipate,
        data: {
          hostId: data?._id
        }
      })

      const { data: responseData } = response
      if (responseData.error || !responseData?.success) {
        toast.error(responseData?.message)
      }
      else {
        setCount(5)
        let c = 5
        const timer = setInterval(() => {
          c--;
          if (c > 0) {
            setCount(c)
          }
          else {
            clearInterval(timer)
            setCount(null)
            navigate(`/joined/${params.hostId}/${user?._id}`, { state: { on_Quiz: true, data: data } })
            addedDetails()
          }

        }, 1000)
      }
    } catch (error) {
      console.log("startQuiz error", error)
      toast.error(error?.response?.data?.message || "Some error occured , try later!")
    }
  }

  // add details from host model
  const addedDetails = () => {
    if (!socketConnection) return
    try {
      socketConnection.emit("add_userId", {
        hostId: data?._id
      })
    } catch (error) {
      console.log("addedDetails error", error)
    }
  }

  return (
    <section className='h-[calc(100vh-70px)] overflow-y-auto scrollbar-hide bg-gradient-to-br from-[#f0f0f0] to-cyan-100'>
      {
        params.userId ? (
          <Outlet />
        ) : count ? (
          <section className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-purple-200 via-purple-300 to-teal-200 z-50">
            <div className="text-center space-y-4">
              {/* Countdown Number */}
              <h1 className="text-[5rem] sm:text-[8rem] font-extrabold tracking-widest animate-pulse drop-shadow-lg select-none">
                {count}
              </h1>
              {/* Text Below */}
              <p className="text-2xl font-medium opacity-90 px-6">
                Get ready... Your quiz is about to begin!
              </p>
            </div>
          </section>
        ) : data ? (
          <section className="h-full w-full flex flex-col justify-center items-center">

            {/* Card Container */}
            <div className={`bg-white custom-lg:max-w-3xl rounded-3xl shadow-2xl py-5 custom-sm:py-7 px-8 custom-lg:px-10 custom-lg:py-10 border border-gray-200 flex flex-col items-center text-center`}>

              {/* Title */}
              <h1 className="text-[30px] sm:text-4xl font-extrabold mb-3 sm:mb-8 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Quiz Details
              </h1>

              {/* Quiz Info */}
              <div className="text-[16px] sm:text-lg bg-gradient-to-br from-purple-100 to-teal-50 rounded-2xl p-4 w-full text-left sm:space-y-3 mb-3 sm:mb-5 border border-purple-600 sm:px-8">

                <div className='grid sm:grid-cols-2 sm:grid-rows-3 gap-1.5 sm:gap-2'>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">Start : </span> {localDateFormate(data?.quiz_start) || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">End : </span> {localDateFormate(data?.quiz_end) || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">Duration : </span> {quizDuration(data?.quiz_start, data?.quiz_end)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">Status : </span>{" "}
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">{quizStatus(data?.quiz_start, data?.quiz_end) || "N/A"}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">Total Questions : </span> {data?.quiz_data?.length || 0}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-800">Total Marks : </span> {data?.total_marks}
                  </p>
                </div>
              </div>

              {
                data.strict.enabled && (
                  <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-2xl p-4 w-full text-left space-y-3 mb-8 border border-teal-500 shadow-sm">
                    <span className="font-bold text-teal-700">NOTE : </span>
                    <span>Each question has </span>
                    <span className="font-semibold text-purple-700">
                      {`"${data.strict.time} ${data.strict.unit}"`}
                    </span>
                    <span>
                      {` time limit — once that time expires, the participant cannot return to or modify their answer for that question.`}
                    </span>
                  </div>
                )
              }

              {/* Start Button */}
              <div
                onClick={() => {
                  startQuiz()
                }}
                state={{ on_Quiz: true }}
                className="flex items-center w-full justify-center cursor-pointer gap-2 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-lg py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-200"
              >
                <MdPlayCircle className="text-2xl" />
                Start Quiz
              </div>
            </div>
          </section>
        ) : (
          <div className='text-gray-400 text-center h-full w-full flex items-center justify-center font-semibold select-none pb-[120px]'>
            {`${error}`}
          </div>
        )
      }
    </section>
  )
}

export default QuizJoined
