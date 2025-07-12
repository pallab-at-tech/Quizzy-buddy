import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='min-h-[70px] border-b bg-[#fcfcfc] border-[#c8c3c3] grid md:grid-cols-[60%_1fr_1fr_1fr] grid-cols-[40%_1fr_1fr] items-center '>

      <p>logo</p>

      <div className='md:block hidden'>Contribute Quiz</div>

      <div>dashboard</div>

      <Link>about us</Link>


    </header>
  )
}

export default Header
