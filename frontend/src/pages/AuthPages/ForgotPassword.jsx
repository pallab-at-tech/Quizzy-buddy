import { useState } from 'react'
import SummaryApi from '../../common/SumarryApi'
import Axios from '../../utils/Axios'
import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

const ForgotPassword = () => {

    const [data, setData] = useState({
        email: ""
    })

    const [loading, setLoading] = useState(false)
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

            setLoading(true)
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            if (response.data.error) {
                toast.error(response?.data?.message)
                setLoading(false)
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
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            toast.error(
                error?.response?.data?.message
            )
        }
    }


    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dfe4ea] to-[#e7e8ee]">
            <div className="bg-white shadow-xl border-2 border-gray-300 rounded-2xl p-6 sm:p-8 w-[90%] max-w-md text-center">

                <h1 className="text-2xl font-bold text-[#000727] mb-2">Forgot your password?</h1>
                <p className="text-[#333] text-sm sm:text-base mb-6 px-1.5">
                    Don’t worry — just enter your registered email below and we’ll send you instructions to reset your password.
                </p>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleOnSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        onChange={handleOnChange}
                        required
                        placeholder="Enter your email..."
                        className="bg-[#edf0ff] border border-[#b2b8de] rounded-lg w-full h-10 text-base outline-none px-3 text-[#100f0f] focus:ring-2 focus:ring-[#1c45a4] transition-all duration-200"
                    />
                    <button
                        type="submit"
                        className={`h-10 ${loading || !data.email ? "bg-[#5d7abd] hover:bg-[#5d7abd] cursor-not-allowed": "bg-[#1c45a4] hover:bg-[#163682] cursor-pointer"}  text-white font-semibold rounded-lg transition-all duration-300 shadow-md`}
                    >
                        Submit
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    
                    <Link to={"/sign-in"} className='className="text-[#1c45a4] font-semibold hover:underline"'>
                        Go back to login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword
