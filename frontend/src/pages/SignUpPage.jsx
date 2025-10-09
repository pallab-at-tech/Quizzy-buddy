import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SummaryApi from '../common/SumarryApi'
import Axios from '../utils/Axios'

const SignUpPage = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [signUpLoading, setSignUpLoading] = useState(false)
    const valid = Object.values(data).every(el => el)
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


        if (data.password !== data.confirmPassword) {
            toast.error("password and confirm password must be same")
            return
        }

        try {

            setSignUpLoading(true)

            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })


            if (response.data.error) {
                toast.error(response?.data?.message)
                setSignUpLoading(false)
            }

            if (response.data.success) {
                toast.success(response?.data?.message)

                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                setSignUpLoading(false)

                navigate("/sign-in")
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message
            )
            setSignUpLoading(false)
        }
    }


    return (
        <section className="min-h-screen grid lg:grid-cols-[2fr_1fr] bg-[#e8ecf8] overflow-hidden">

            {/* Sign-Up Form Section */}
            <div className="bg-white sm:bg-transparent flex flex-col items-center justify-center px-6 md:px-20 py-10">

                <div className="sm:bg-white rounded-2xl sm:shadow-xl  py-8 px-4 md:p-10 w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1c45a4] text-center mb-6">
                        Create Your Account
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[#1c45a4] mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                required
                                className="bg-[#edf1ff] border border-[#c3ccf5] focus:border-[#1c45a4] focus:ring-2 focus:ring-[#1c45a4]/30 rounded-lg px-4 py-2 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[#1c45a4] mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                required
                                className="bg-[#edf1ff] border border-[#c3ccf5] focus:border-[#1c45a4] focus:ring-2 focus:ring-[#1c45a4]/30 rounded-lg px-4 py-2 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[#1c45a4] mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                required
                                className="bg-[#edf1ff] border border-[#c3ccf5] focus:border-[#1c45a4] focus:ring-2 focus:ring-[#1c45a4]/30 rounded-lg px-4 py-2 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-[#1c45a4] mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                required
                                className="bg-[#edf1ff] border border-[#c3ccf5] focus:border-[#1c45a4] focus:ring-2 focus:ring-[#1c45a4]/30 rounded-lg px-4 py-2 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`mt-2 w-full py-2.5 font-semibold text-white rounded-lg transition-all duration-200 ${!signUpLoading && valid
                                ? "bg-[#1c45a4] hover:bg-[#15327d] hover:scale-[1.02] cursor-pointer"
                                : "bg-[#9bb4f0] cursor-not-allowed"
                                }`}
                        >
                            Sign Up
                        </button>

                        {/* Mobile Sign-In Prompt */}
                        <div className="lg:hidden flex justify-center text-sm gap-1 mt-2 text-[#1c45a4]">
                            <p>Already have an account?</p>
                            <Link to="/sign-in" className="font-semibold hover:underline">
                                Sign In
                            </Link>
                        </div>

                    </form>
                </div>
            </div>

            {/* Right Panel (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#1c45a4] to-[#15327d] text-white px-10 rounded-l-3xl shadow-lg">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold leading-tight">Already have</h2>
                    <h2 className="text-4xl font-bold leading-tight">an account?</h2>
                    <p className="text-sm text-gray-200 mt-2">
                        Login now and start your quiz journey!
                    </p>
                </div>

                <Link
                    to="/sign-in"
                    className="mt-10 px-6 py-3 text-white text-base font-semibold border-2 border-white rounded-full hover:bg-white hover:text-[#1c45a4] hover:scale-105 transition-all duration-200 shadow-md"
                >
                    Sign In
                </Link>
            </div>

        </section>

    )
}

export default SignUpPage
