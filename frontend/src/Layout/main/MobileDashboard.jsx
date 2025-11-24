import React, { useState } from 'react'
import avatar from "../../assets/avatar.png"
import { useSelector, useDispatch } from 'react-redux'
import { useGlobalContext } from '../../provider/GlobalProvider'
import { useNavigate, Link } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'
import toast from 'react-hot-toast'
import { setLogOut } from '../../store/userSlice'

const MobileDashboard = () => {

    const user = useSelector(state => state.user)
    const dashboardURL = `/dashboard/${user?.name?.split(' ')?.join("-")}-${user?._id}`
    const { logoutUser } = useGlobalContext()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [logoutLoading, setLogoutLoading] = useState(false)

    const handleLogOut = async () => {
        try {
            setLogoutLoading(true)

            const response = await Axios({
                ...SummaryApi.logOut
            })

            const { data: responseData } = response

            if (responseData.success) {
                dispatch(setLogOut())
                localStorage.clear()
                toast.success(responseData?.message)
                setLogoutLoading(false)
                logoutUser()
                navigate("/")
            }

        } catch (error) {
            setLogoutLoading(false)
            console.log("handle logout", error)
        }
    }

    return (
        <section className='min-h-[calc(100vh-70px)] max-h-[calc(100vh-70px)] p-6 bg-[#fcfcfc] pl-6 pr-6 '>

            {/* profile */}
            <Link to={dashboardURL} className='mt-2 flex gap-3 items-center border-b border-[#c8c3c3] pb-4'>

                <div>
                    <img src={avatar} alt="" className='w-14 h-14 rounded-full border  border-[#040132] shadow-md' />
                </div>

                <div className='text-sm'>
                    <p className='max-w-[22ch] break-all line-clamp-1 font-semibold'>{user?.name}</p>
                    <p className='max-w-[22ch] break-all line-clamp-1 text-[#00085b] font-normal'>{user?.email}</p>
                </div>

            </Link>

            <div className=''>
                <p className='text-[11px] mt-6 mb-1 text-[rgb(236,236,244)] bg-blue-600 w-fit py-1 px-2 rounded'>For Users</p>

                <div className='flex flex-col  gap-1.5 font-semibold'>

                    <Link to={`/dashboard/overview`} className='hover:bg-[#e7e9ffad] transition-all duration-150 p-1  rounded-md'>
                        <p className='pl-2'>Dashboard Overview</p>
                    </Link>

                    <Link to={`/dashboard/my-quiz`} className='hover:bg-[#e7e9ffad] transition-all duration-150 p-1 rounded-md'>
                        <p className='pl-2'>My Quizzes</p>
                    </Link>

                    <Link to={`/dashboard/leaderboard`} className='hover:bg-[#e7e9ffad] transition-all duration-150 p-1 rounded-md'>
                        <p className='pl-2'>Leaderboard</p>
                    </Link>

                    {/* <Link className='hover:bg-[#e7e9ffad] transition-all duration-150 p-1 rounded-md'>
                        <p className='pl-2'>Achivements</p>
                    </Link> */}

                </div>

            </div>

            <div className=''>
                <p className='text-[11px] mt-6 mb-1 text-[rgb(236,236,244)] bg-blue-600 w-fit py-1 px-2 rounded'>For Organizers</p>

                <Link to={`/dashboard/organizer-pannel`} className='block hover:bg-[#e7e9ffad] transition-all duration-150 p-1 rounded-md font-semibold'>
                    <p className='pl-2'>Organizer Pannel</p>
                </Link>
            </div>

            <div className='mt-10 flex justify-center pl-2'>
                <p onClick={handleLogOut} className={`border-2 border-blue-600 transition-all duration-150 hover:bg-blue-600 hover:text-white w-[30%] text-center py-1.5 rounded-md font-semibold ${logoutLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>Logout</p>
            </div>

        </section>
    )
}

export default MobileDashboard