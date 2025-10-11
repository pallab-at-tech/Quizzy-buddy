import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../../provider/GlobalProvider'

const SignInPage = () => {

    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [signInLoading, setSignInLoading] = useState(false)
    const valid = Object.values(data).every(el => el)

    const { loginUser } = useGlobalContext()

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }

        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            setSignInLoading(true)

            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response?.data?.error) {
                toast.error(response?.data?.message)
                setSignInLoading(false)
            }

            if (response?.data?.success) {

                toast.success(response?.data?.message)
                localStorage.setItem('accesstoken', response.data.data.accessToken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                loginUser()

                setData({
                    email: "",
                    password: ""
                })

                setSignInLoading(false)
                navigate("/")
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message
            )
            setSignInLoading(false)
        }
    }

    return (
        <section className="min-h-screen grid lg:grid-cols-[35%_1fr] bg-[#e8ecf8] overflow-hidden">

            {/* Left Panel */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#1c45a4] to-[#15327d] text-white px-10 rounded-r-3xl shadow-lg">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold leading-tight">Don’t have an</h2>
                    <h2 className="text-4xl font-bold leading-tight">account yet?</h2>
                    <p className="text-sm text-gray-200 mt-2">
                        Join us today and take your quiz experience to the next level.
                    </p>
                </div>

                <Link
                    to="/sign-up"
                    className="mt-10 px-6 py-3 text-white text-base font-semibold border-2 border-white rounded-full hover:bg-white hover:text-[#1c45a4] hover:scale-105 transition-all duration-200 shadow-md"
                >
                    Sign Up
                </Link>
            </div>

            {/* Right Form Section */}
            <div className="bg-white sm:bg-transparent flex flex-col items-center justify-center px-6 md:px-20 py-10 relative">
                <div className="sm:bg-white rounded-2xl sm:shadow-xl py-8 px-4 md:p-10 w-full max-w-md">
                    <h1 className="text-3xl font-extrabold text-[#1c45a4] text-center mb-6">
                        Welcome Back 👋
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email Input */}
                        <div className="flex flex-col text-left">
                            <label className="font-semibold text-[#1c45a4] mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                required
                                className="bg-[#edf1ff] border border-[#c3ccf5] focus:border-[#1c45a4] focus:ring-2 focus:ring-[#1c45a4]/30 rounded-lg px-4 py-2 text-[#100f0f] outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col text-left">
                            <label className="font-semibold text-[#1c45a4] mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                required
                                className="bg-[#edf1ff] border border-[#c3ccf5] focus:border-[#1c45a4] focus:ring-2 focus:ring-[#1c45a4]/30 rounded-lg px-4 py-2 text-[#100f0f] outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Buttons */}
                        <button
                            type="submit"
                            className={`mt-2 w-full py-2.5 font-semibold text-white rounded-lg transition-all duration-200 ${!signInLoading && valid
                                ? "bg-[#1c45a4] hover:bg-[#15327d] hover:scale-[1.02] cursor-pointer"
                                : "bg-[#9bb4f0] cursor-not-allowed"
                                }`}
                        >
                            Login
                        </button>

                        <div className="flex flex-wrap justify-between items-center  text-sm">
                            <Link
                                to="/forgot-password"
                                className="text-[#1c45a4] hover:underline font-semibold"
                            >
                                Forgot Password?
                            </Link>
                            <div className="lg:hidden flex gap-1 text-[#1c45a4]">
                                <p>Don’t have an account?</p>
                                <Link to="/sign-up" className="font-bold hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignInPage
