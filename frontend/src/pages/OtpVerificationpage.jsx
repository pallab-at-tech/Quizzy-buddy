import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SumarryApi'
import toast from 'react-hot-toast'

const OtpVerificationpage = () => {

    const [data, setData] = useState(["", "", "", "", "", ""])
    const inputRef = useRef([])
    const valid = data.every(el => el)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        inputRef.current[0].focus()
    }, [])

    const handleOnSubmit = async (e) => {
        e.preventDefault()


        try {

            const response = await Axios({
                ...SummaryApi.otp_verification,
                data: {
                    email: location?.state?.email,
                    otp: data.join("")
                }
            })

            if (response.data.error) {
                toast.error(response?.data?.message)
            }

            if (response.data.success) {
                toast.success(response?.data?.message)

                setData(["", "", "", "", "", ""])

                navigate("/reset-password", {
                    state: {
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message
            )
        }
    }

    useEffect(() => {
        if (!location?.state) {
            navigate("/sign-in")
        }
    }, [])

    return (
        <div className='min-w-screen max-w-screen min-h-screen max-h-screen flex flex-col items-center justify-center w-full h-full bg-[#e1dede] overflow-hidden'>

            <div className='md:px-0 px-8'>
                <p className=' md:text-xl text-lg font-semibold  text-[#000727] '>Enter OTP :</p>


                <form className='mt-2' onSubmit={handleOnSubmit}>

                    <div className='flex flex-row gap-4'>
                        {
                            data.map((element, index) => {
                                return (
                                    <input type="text"
                                        key={index}
                                        value={data[index]}
                                        onChange={(e) => {

                                            const value = e.target.value
                                            const newData = [...data]
                                            newData[index] = value
                                            setData(newData)

                                            if (value && index < 5) {
                                                inputRef.current[index + 1].focus()
                                            }

                                        }}
                                        ref={(ref) => {
                                            inputRef.current[index] = ref
                                        }}
                                        required
                                        maxLength={1}
                                        className='bg-[#b2b8de] rounded text-[#000727] md:h-12 md:w-12 h-10 w-10 outline-none text-center'
                                    />
                                )
                            })
                        }

                    </div>


                    <button disabled={!valid} className={`p-1.5 mt-6 h-10 w-full   ${valid ? "bg-[#1c45a4] hover:bg-[#193e93] text-[#d1dcfb]" : "bg-[#4c79b4] hover:bg-[#2c6abc]  text-[#d1dcfb]"} w-[90%] mt-2 rounded  font-semibold`}>Submit</button>


                </form>



            </div>

        </div>
    )
}

export default OtpVerificationpage
