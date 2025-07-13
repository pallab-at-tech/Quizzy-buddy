import React from 'react'
import { Outlet } from 'react-router-dom'
import avatar from "../assets/avatar.png"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const Dashboard = () => {

  const user = useSelector(state => state.user)
  const dashboardURL = `/dashboard/${user?.name?.split(' ')?.join("-")}-${user?._id}`

  return (
    <section className='bg-[#fcfcfc] grid grid-cols-[20%_1fr]'>

      <div className='bg-[#fcfcfc] min-h-[calc(100vh-70px)] max-h-[calc(100vh-70px)] sticky top-[70px] border-r border-[#c8c3c3] shadow-md p-6'>

        {/* profile */}
        <Link to={dashboardURL} className='mt-2 flex gap-3 items-center border-b border-[#c8c3c3] pb-4'>

          <div>
            <img src={avatar} alt="" className='w-14 h-14 rounded-full border  border-[#040132] shadow-md' />
          </div>

          <div className='text-sm'>
            <p className='max-w-[22ch] break-all line-clamp-1 font-semibold'>{user?.name}</p>
            <p className='max-w-[22ch] break-all line-clamp-1'>{user?.email}</p>
          </div>

        </Link>


        <div className='mt-2'>
          <p className='text-sm'>For Users</p>

          <div>
            <p>Registration/Application</p>
          </div>

          <div>
            <p>My rounds</p>
          </div>

          <div>
            <p>Bookmark</p>
          </div>

          <div>
            <p>Achivements</p>
          </div>


        </div>

        <div>
          <p className='text-sm'>For Organizers</p>

          <div>
            <p>Organizer Pannel</p>
          </div>
        </div>

        <div>
          <p>Logout</p>
        </div>

      </div>

      <div className='bg-[#fcfcfc] min-h-[200vh]'>
        {
          <Outlet />
        }
      </div>

    </section>
  )
}

export default Dashboard
