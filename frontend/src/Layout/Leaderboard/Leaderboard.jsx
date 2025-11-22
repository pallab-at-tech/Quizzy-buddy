import React, { useEffect, useState } from 'react'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'
import { FaCrown } from 'react-icons/fa'
import { ImStatsBars } from 'react-icons/im'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Leaderboard = () => {

  const [data, setData] = useState(null)
  const user = useSelector(state => state.user)

  const fetchLeaderBoard = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.daily_leaderBoard
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      console.log("fetchLeaderBoard Error", error)
    }
  }

  const isTodayQuizFinish = (lastQuizDate) => {

    if (!lastQuizDate) return false

    const last = new Date(lastQuizDate)
    const now = new Date()

    if (last.getDate() === now.getDate() && last.getMonth() === now.getMonth() && last.getFullYear() === now.getFullYear()) {
      return true
    }

    return false
  }

  useEffect(() => {
    fetchLeaderBoard()
  }, [])


  return (
    <section className='mx-[100px] mt-8'>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2 ">
          <span className="w-3 h-3 bg-blue-600 mt-1 rounded-full"></span>
          Daily LeaderBoard
        </h2>
      </div>

      <div className='bg-white shadow-md rounded-2xl p-8 border border-gray-100 mt-8'>

        {
          data && data?.leaderboard.length !== 0 ? (
            <>
              <div className='w-full mt-2 space-y-3 max-h-[500px] bg-gray-50 rounded-xl px-6 overflow-y-auto custom_scrollBar_forFullDetails pr-6 py-4'>
                {
                  data.leaderboard.map((v, i) => {
                    return <div key={v.userId?.Id}
                      className={`relative flex items-center justify-between ${i === 0 ? "from-blue-200 to-blue-50 border-blue-300" : "from-[#dcbfed] via-[#e9cef9] to-violet-50 border-[#8f79a3ae]"} bg-gradient-to-r  border-2  shadow-md rounded-xl p-4`}
                    >

                      {
                        i === 0 && <FaCrown size={36} className='absolute text-yellow-600 -top-2 -left-0 rotate-[-20deg]' />
                      }

                      {/* Rank + Name */}
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-purple-700">#{i + 1}</div>
                        <div>
                          <p className="text-base font-semibold capitalize">{v?.userId?.userName}</p>
                          <p className="text-xs text-gray-600">{v?.userId?.userId}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-[16px]">
                        <p>
                          <span className="font-semibold text-gray-800 ">{v.marks}</span>
                          <span className="text-purple-700 font-medium"> pts</span>
                        </p>
                        <p>
                          <span className="text-green-700 font-medium">Acc : </span>
                          <span className="font-semibold text-gray-800">{v.accuracy}%</span>
                        </p>
                        <p>
                          <span className="text-yellow-700 font-medium">Time : </span>
                          <span className="font-semibold text-gray-800">{v.timeTaken}s</span>
                        </p>

                        {v?.negativeMarks > 0 && (
                          <p className="text-red-600 font-medium">-{v.negativeMarks}</p>
                        )}
                      </div>

                    </div>
                  })
                }
              </div>

              <div className="w-full mt-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">My Stats</h1>

                <div className="grid grid-cols-[1fr_3fr] gap-4">

                  {/* Best Streak */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-gray-500 text-sm font-medium text-center">Best Streak</h2>
                    <p className="text-3xl font-bold text-indigo-600 mt-1 text-center">
                      {data.current_userDetails.daily_strict_count.best_strick}
                    </p>
                  </div>

                  {
                    isTodayQuizFinish(user?.daily_strict_count?.last_date) ? (
                      <div className='grid grid-cols-3 gap-4'>
                        {/* My Rank */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                          <h2 className="text-gray-500 text-sm font-medium text-center">Rank</h2>
                          <p className={`${data.rank === -1 ? "text-2xl" : "text-3xl"} font-bold text-purple-600 mt-1 text-center`}>
                            {data.rank === -1 ? `not realise` : data.rank + 1}
                          </p>
                        </div>

                        {/* Today's Score */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                          <h2 className="text-gray-500 text-sm font-medium text-center">Today&apos;s Score</h2>
                          <p className="text-3xl font-bold text-green-600 mt-1 text-center">
                            {data.current_userDetails.daily_strict_count.last_week_stats[0]?.score ?? 0}
                          </p>
                        </div>

                        {/* Today's Accuracy */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                          <h2 className="text-gray-500 text-sm font-medium text-center">Today&apos;s Accuracy</h2>
                          <p className="text-3xl font-bold text-blue-600 mt-1 text-center">
                            {data.current_userDetails.daily_strict_count.last_week_stats[0]?.accuracy ?? 0}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                          <h2 className="text-gray-500 text-[21px] font-medium text-center">You haven't attend Today's Daily Quiz yet !?</h2>
                          <p className={`text-[15px] font-bold text-purple-600 mt-1 text-center`}>
                            <Link to={"/daily-quiz"}>Click here to attend Today's Quiz</Link>
                          </p>
                        </div>
                      </div>
                    )
                  }

                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-4">
              <div className="border border-gray-200 bg-white rounded-xl px-6 py-4 shadow-sm flex items-center gap-3">
                <p className="text-purple-700 text-[25px] font-bold">
                  ! Leaderboard is not updated yet
                </p>
              </div>
            </div>
          )
        }

      </div>

      {/* Which factor makes this leader-board */}
      <div className="bg-white my-6 p-6 rounded-xl shadow-md border border-gray-200">

        <div className='flex items-center gap-2 mb-4'>
          <ImStatsBars size={23} className='text-yellow-800' />
          <h3 className="text-lg font-semibold text-purple-700">
            How Leaderboard Ranking Works
          </h3>
        </div>

        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="font-bold text-purple-600">1️⃣ Marks</span>
            — Higher total score gets priority.
          </li>

          <li className="flex gap-2">
            <span className="font-bold text-purple-600">2️⃣ Accuracy</span>
            — Better accuracy ranks higher if marks are equal.
          </li>

          <li className="flex gap-2">
            <span className="font-bold text-purple-600">3️⃣ Time Taken</span>
            — Faster submission ranks higher if marks & accuracy are same.
          </li>

          <li className="flex gap-2">
            <span className="font-bold text-purple-600">4️⃣ Negative Marks</span>
            — Lower negative score ranks higher if previous factors are equal.
          </li>

          {/* <li className="flex gap-2">
            <span className="font-bold text-purple-600">5️⃣ Submission Time</span>
            — Earlier submission gets priority when everything else is equal.
          </li> */}
        </ul>
      </div>

    </section>
  )
}

export default Leaderboard
