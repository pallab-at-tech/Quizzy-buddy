import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'

const MyQuiz = () => {

  const user = useSelector(state => state.user)
  const location = useLocation()
  const route = location.pathname.split("/")

  return (
    <div className="p-8">
      {
        route[route.length - 1] === "my-quiz" ? (
          <div className="w-full px-6">

            <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-6 pb-3">
              My Quiz Participation
            </h1>

            <div className={`${user && user?.participant_info?.length > 0 && "grid" } grid-cols-2 gap-x-4 gap-y-3`}>
              {user?.participant_info?.length > 0 ? (
                user.participant_info.map((p) => (
                  <Link
                    to={`${p?.quiz_id}`}
                    key={p?._id}
                    className="border-2 border-[#afb3bc] rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] shadow-md bg-gradient-to-l from-white via-blue-50 to-gray-50 hover:shadow-lg"
                  >
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Quiz Code</p>
                      <p className="font-medium text-gray-900">{p?.quiz_nano_id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Participated On</p>
                      <p className="font-medium text-[#242a32]">
                        {new Date(p.participated_at).toLocaleString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-gray-400 text-[30px] font-semibold select-none relative w-full">
                  <p className='absolute left-[200px] right-0 top-[100px] bottom-0'> You haven't participated in any quiz yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Outlet />
        )
      }
    </div>
  )
}

export default MyQuiz
