import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const SignInPage = () => {

    const [data, setData] = useState({
        email: "",
        password: ""
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
        <section className={`min-w-screen max-w-screen min-h-screen max-h-screen grid lg:grid-cols-[30%_1fr] bg-[#e1dede] overflow-hidden`}>

            <div className={`lg:flex hidden w-full rounded-r-2xl bg-[#1c45a4]  flex-col justify-around px-16 items-center`}>

                <div className='text-[#e7e7e7] text-4xl font-bold text-center'>
                    <p>Don't have an</p>
                    <p>account ?</p>
                </div>

                <div>
                    <Link to={"/sign-up"} className='px-5 py-3 text-[#e7e7e7] text-base rounded-4xl border-2 font-bold border-[#e7e7e7] hover:border-none hover:bg-[#031461] hover:scale-105 hover:px-[20px] transition-all duration-150 cursor-pointer'>sign up</Link>
                </div>
            </div>


            <div className={`md:px-0 px-8 md:-mt-0 -mt-[150px]`}>
                <form className={`flex flex-col items-center justify-center h-full w-full gap-1`}>

                    <h1 className='md:text-3xl text-2xl font-bold text-[#000727] my-2'>Welcome Your Account</h1>


                    <div className='group'>
                        <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Email : </p>
                        <input type="email" onChange={handleChange} name='email' value={data.email} required className='bg-[#b2b8de] rounded md:w-[320px] w-[250px] h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    </div>

                    <div className='group'>
                        <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Password : </p>
                        <input type="text" onChange={handleChange} name='password' value={data.password} required className='bg-[#b2b8de] md:w-[320px] w-[250px]  h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    </div>


                    <div className='flex flex-col gap-1'>
                        <button disabled={!valid} className={`p-2  md:w-[320px] w-[250px] bg-[#1c45a4] text-[#d1cece]  mt-2 rounded  font-semibold`}>Login</button>
                        <Link className='text-[#1c45a4] text-sm pr-6'>Forgot Password ?</Link>

                        <div className='lg:hidden flex text-sm gap-1'>
                            <p className='text-[#1c45a4]'>Don't have account ?</p>
                            <Link to={"/sign-up"}>sign up</Link>
                        </div>
                    </div>



                </form>


            </div>



        </section>
    )
}

export default SignInPage
