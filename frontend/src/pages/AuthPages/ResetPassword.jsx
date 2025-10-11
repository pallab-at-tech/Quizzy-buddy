import { useState, useEffect } from 'react'
import Axios from '../../utils/Axios'
import toast from 'react-hot-toast'
import SummaryApi from '../../common/SumarryApi'
import { useLocation, useNavigate } from 'react-router-dom'

const ResetPassword = () => {

    const [data, setData] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    
    const location = useLocation()
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleOnSubmit = async (e) => {

        e.preventDefault()

        if (data.newPassword !== data.confirmPassword) {
            toast.error("password and confirm password must be same")
            return
        }

        try {

            const response = await Axios({
                ...SummaryApi.reset_password,
                data: {
                    email: location?.state?.email,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                }
            })

            if (response.data.error) {
                toast.error(response?.data?.message)
            }

            if (response.data.success) {
                toast.success(response?.data?.message)

                setData({
                    newPassword: "",
                    confirmPassword: ""
                })

                navigate("/sign-in")
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

            <form className='flex flex-col items-center justify-center h-full w-full gap-1' onSubmit={handleOnSubmit}>

                <h1 className='md:text-3xl text-2xl font-bold text-[#000727] my-2'>Reset your password ...</h1>

                <div className='group'>
                    <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>New password : </p>
                    <input type="text" name='newPassword' value={data.newPassword} onChange={handleOnChange} required className='bg-[#b2b8de] md:w-[320px] w-[250px]  h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                </div>

                <div className='group'>
                    <p className='font-semibold group-hover:scale-y-105 transition-all duration-500 group-hover:-translate-y-1'>Confirm Password : </p>
                    <input type="text" name='confirmPassword' value={data.confirmPassword} onChange={handleOnChange} required className='bg-[#b2b8de] rounded md:w-[320px] w-[250px] h-8 text-base outline-none p-2 mt-1 text-[#100f0f]' />
                </div>

                <button className={`p-2  md:w-[320px] w-[250px] bg-[#1c45a4] text-[#d1cece]  mt-2 rounded  font-semibold cursor-pointer`}>Submit</button>

            </form>

        </div>
    )
}

export default ResetPassword
