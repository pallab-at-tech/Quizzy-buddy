import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BiNotification } from "react-icons/bi";
import avatar from "../assets/avatar.png"
import Logo from './Logo';
import NotificationPopBar from './NotificationPopBar';


const Header = () => {

  const user = useSelector(state => state.user)
  const popBarRange = useRef(null)

  const dashboardURL = `/dashboard/${user?.name?.split(' ')?.join("-")}-${user?._id}`

  const [notificationPopBarOpen, setNotificationPopBarOpen] = useState(false)

  // pop bar close and open
  useEffect(() => {
    const clickOutSide = (event) => {
      if (popBarRange.current && !popBarRange.current.contains(event?.target)) {
        setNotificationPopBarOpen(false)
      }
    }

    document.addEventListener("mousedown", clickOutSide)

    return () => document.removeEventListener("mousedown", clickOutSide)
  }, [])

  return (
    <header className='min-h-[70px] sticky z-50 top-0 border-b bg-[#fcfcfc] border-[#c8c3c3] grid custom-lg:grid-cols-[70%_1fr_1fr] custom-sm:grid-cols-[6fr_20%_2fr] lg_md:grid-cols-[70%_1fr_1fr] grid-cols-[1fr_1fr] items-center '>

      <Link to={"/"} className='w-fit sm:ml-[60px] ml-6'>
        <Logo />
      </Link>

      <div className='flex items-center justify-end sm:justify-center gap-4 lg:border-x border-[#d2d2d2] md:px-8 px-10'>

        <Link to={dashboardURL} className='hidden custom-lg:block'>
          {
            user?.avatar ? (
              <img src={user?.avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#040132] cursor-pointer object-cover' />
            ) : (
              <img src={avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#040132] cursor-pointer object-cover' />
            )
          }
        </Link>

        <Link to={"/dashboard"} className='block custom-lg:hidden'>
          {
            user?.avatar ? (
              <img src={user?.avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#040132] cursor-pointer object-cover' />
            ) : (
              <img src={avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#040132] cursor-pointer object-cover' />
            )
          }
        </Link>

        <div className='relative'>
          <BiNotification size={32} className='cursor-pointer' onClick={() => setNotificationPopBarOpen(true)} />
          <div ref={popBarRange}>
            {
              notificationPopBarOpen && (
                <NotificationPopBar close={() => setNotificationPopBarOpen(false)} />
              )
            }
          </div>
        </div>

      </div>

      <Link to={'/about'} className='text-center hidden sm:block'>About us</Link>
    </header>
  )
}

export default Header
