import { useState } from 'react'
import SummaryApi from '../../common/SumarryApi'
import Axios from '../../utils/Axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    
    const [data, setData] = useState({
        email: ""
    })
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleOnSubmit = async (e) => {

        e.preventDefault()

        try {

            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            if (response.data.error) {
                toast.error(response?.data?.message)
            }

            if (response.data.success) {
                toast.success(response?.data?.message)

                setData({
                    email: ""
                })

                navigate("/otp-verfication", {
                    state: {
                        email: data.email
                    }
                })
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message
            )
        }
    }


    return (
        <div className='min-w-screen max-w-screen min-h-screen max-h-screen flex flex-col items-center justify-center w-full h-full bg-[#e1dede] overflow-hidden'>

            <div className='md:px-0 px-8'>
                <p className=' md:text-xl text-lg font-semibold  text-[#000727] '>Forgot your password ?!</p>
                <p className=' md:text-xl text-lg font-semibold  text-[#000727] break-words'>Don't worry just enter your email below , </p>

                <form className='md:mt-4 mt-3 flex md:gap-4 gap-2 items-center flex-wrap' onSubmit={handleOnSubmit}>
                    <input type="email" name='email' onChange={handleOnChange} required placeholder='Enter your email...' className='bg-[#b2b8de] rounded md:w-[320px] w-[250px]  h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                    <button className={` h-8 md:w-[80px] w-[60px] bg-[#1c45a4] text-[#d1cece]  rounded font-semibold cursor-pointer`}>submit</button>
                </form>
            </div>

        </div>
    )
}

export default ForgotPassword
