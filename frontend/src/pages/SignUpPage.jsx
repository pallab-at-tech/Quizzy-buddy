import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SignUpPage = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const valid = Object.values(data).every(el => el)

    const navigate = useNavigate()
    const location = useLocation()


    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }

        })
    }

    return (
        <section className='min-w-screen max-w-screen min-h-screen max-h-screen bg-[#d1cece] overflow-hidden relative'>

            <div className={`absolute left-0 top-0 bottom-0 w-[70%]`}>
                <form className={`flex flex-col items-center justify-center h-full w-full gap-1`}>

                    <h1 className='text-3xl font-bold text-[#000727] my-2'>Welcome</h1>

                    <div className='group'>
                        <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Name : </p>
                        <input type="email" onChange={handleChange} name='name' value={data.name} required className='bg-[#b2b8de] rounded w-[320px] h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    </div>


                    <div className='group'>
                        <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Email : </p>
                        <input type="email" onChange={handleChange} name='email' value={data.email} required className='bg-[#b2b8de] rounded w-[320px] h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    </div>

                    <div className='group'>
                        <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Password : </p>
                        <input type="text" onChange={handleChange} name='password' value={data.password} required className='bg-[#b2b8de] w-[320px]  h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    </div>

                    <div className='group'>
                        <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Confirm Password : </p>
                        <input type="text" onChange={handleChange} name='confirmPassword' value={data.confirmPassword} required className='bg-[#b2b8de] rounded w-[320px] h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <button disabled={!valid} className={`p-2  w-[320px] bg-[#1c45a4] text-[#d1cece]  mt-2 rounded  font-semibold`}>sign up</button>
                        <Link className='text-[#000727] text-sm pr-6 pb-2'>Forgot Password ?</Link>
                    </div>

                </form>
            </div>

            <div className={`absolute right-0 top-0 bottom-0  w-[30%] rounded-l-2xl bg-[#1c45a4] flex flex-col justify-around px-16 items-center`}>

                <div className='text-[#e7e7e7] text-4xl font-bold text-center'>
                    <p>Already have</p>
                    <p>account ?</p>
                </div>

                <div>
                    <Link to={"/sign-in"} className='px-5 py-3 text-[#e7e7e7] text-base rounded-4xl border-2 font-bold border-[#e7e7e7] hover:border-none hover:bg-[#031461] hover:scale-105 hover:px-[20px] transition-all duration-150 cursor-pointer'>sign in</Link>
                </div>
            </div>

        </section>
    )
}

export default SignUpPage
