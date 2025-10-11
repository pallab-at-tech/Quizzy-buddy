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

    const [loading, setLoading] = useState(false)
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

            setLoading(true)

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
                setLoading(false)
            }

            if (response.data.success) {
                toast.success(response?.data?.message)

                setData({
                    newPassword: "",
                    confirmPassword: ""
                })

                navigate("/sign-in")
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e1dede] to-[#e7e8ee] px-4">
            <form
                className="flex flex-col items-center gap-5 bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
                onSubmit={handleOnSubmit}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-[#000727] mb-2">
                    Reset your password
                </h1>
                <p className="text-gray-600 text-sm md:text-base mb-4">
                    Please enter your new password below and confirm it.
                </p>

                {/* New Password Field */}
                <div className="w-full text-left">
                    <label className="block font-semibold text-[#000727] mb-1">
                        New Password:
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={data.newPassword}
                        onChange={handleOnChange}
                        required
                        placeholder="Enter new password..."
                        className="bg-[#edf0ff] border border-[#b2b8de] rounded-lg w-full h-10 text-base outline-none px-3 text-[#100f0f] focus:ring-2 focus:ring-[#1c45a4] transition-all duration-200"
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="w-full text-left">
                    <label className="block font-semibold text-[#000727] mb-1">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleOnChange}
                        required
                        placeholder="Confirm new password..."
                        className="bg-[#edf0ff] border border-[#b2b8de] rounded-lg w-full h-10 text-base outline-none px-3 text-[#100f0f] focus:ring-2 focus:ring-[#1c45a4] transition-all duration-200"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full h-11 mt-3 ${loading ? "bg-[#90a3c2] cursor-not-allowed" : "bg-[#1c45a4] hover:bg-[#193e93] cursor-pointer"} text-white font-semibold rounded-lg shadow-md transition-all duration-300`}
                >
                    Submit
                </button>

            </form>
        </div>

    )
}

export default ResetPassword
