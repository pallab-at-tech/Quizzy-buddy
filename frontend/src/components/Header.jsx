import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BiNotification } from "react-icons/bi";
import avatar from "../assets/avatar.png"


const Header = () => {

  const user = useSelector(state => state.user)
  const dashboardURL = `/dashboard/${user?.name?.split(' ')?.join("-")}-${user?._id}`

  return (
    <header className='min-h-[70px] sticky z-50 top-0 border-b bg-[#fcfcfc] border-[#c8c3c3] grid custom-lg:grid-cols-[60%_1fr_1fr_1fr] md:grid-cols-[50%_1fr_1fr_1fr] grid-cols-[40%_1fr_1fr] items-center '>

      <Link to={"/"} className='w-fit'>logo</Link>

      <div className='md:block hidden w-fit'>Contribute Quiz</div>

      <div className='flex items-center gap-4 lg:border-x border-[#d2d2d2] w-fit md:px-6 px-3'>

        <Link to={dashboardURL} className='hidden custom-lg:block'>
          <img src={avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#040132] cursor-pointer' />
        </Link>

        <Link to={"/dashboard"} className='block custom-lg:hidden'>
          <img src={avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#040132] cursor-pointer' />
        </Link>

        <Link>
          <BiNotification size={32} className='cursor-pointer'/>
        </Link>

      </div>

      <Link className='w-fit'>about us</Link>

    </header>
  )
}

export default Header
