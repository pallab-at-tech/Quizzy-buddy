import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BiNotification } from "react-icons/bi";
import avatar from "../assets/avatar.png"


const Header = () => {

  const user = useSelector(state => state.user)

  return (
    <header className='min-h-[70px] border-b bg-[#fcfcfc] border-[#c8c3c3] grid lg:grid-cols-[60%_1fr_1fr_1fr] md:grid-cols-[50%_1fr_1fr_1fr] grid-cols-[40%_1fr_1fr] items-center '>

      <p>logo</p>

      <div className='md:block hidden'>Contribute Quiz</div>

      <div className='cursor-pointer flex items-center gap-4 lg:border-x border-[#d2d2d2] w-fit md:px-6 px-3'>

        <Link>
          <img src={avatar} alt="" className='lg:w-11 lg:h-11  h-8 w-8 rounded-full border border-[#c8c3c3]'/>
        </Link>

        <Link>
          <BiNotification size={32}/>
        </Link>

      </div>



      <Link>about us</Link>




    </header>
  )
}

export default Header
