import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SummaryApi from '../../common/SumarryApi'
import Axios from '../../utils/Axios'

const OtpVerificationpage = () => {

    const [data, setData] = useState(["", "", "", "", "", ""])
    const inputRef = useRef([])
    const valid = data.every(el => el)
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        inputRef.current[0].focus()
    }, [])

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        try {

            setLoading(true)

            const response = await Axios({
                ...SummaryApi.otp_verification,
                data: {
                    email: location?.state?.email,
                    otp: data.join("")
                }
            })

            if (response.data.error) {
                toast.error(response?.data?.message)
                setLoading(false)
            }

            if (response.data.success) {
                toast.success(response?.data?.message)

                setData(["", "", "", "", "", ""])

                navigate("/reset-password", {
                    state: {
                        email: location?.state?.email
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

    useEffect(() => {
        if (!location?.state) {
            navigate("/sign-in")
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e1dede] to-[#e7e8ee] px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center">

                <h2 className="text-2xl font-bold text-[#000727] mb-2">Enter OTP</h2>
                <p className="text-gray-600 mb-6 text-sm md:text-base">
                    Please enter the 6-digit code sent to your registered email.
                </p>

                <form onSubmit={handleOnSubmit}>
                    <div className="flex justify-center gap-3 md:gap-4">
                        {data.map((element, index) => (
                            <input
                                key={index}
                                type="text"
                                value={data[index]}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const newData = [...data];
                                    newData[index] = value;
                                    setData(newData);

                                    if (value && index < 5) {
                                        inputRef.current[index + 1].focus();
                                    }
                                }}
                                ref={(ref) => {
                                    inputRef.current[index] = ref;
                                }}
                                required
                                maxLength={1}
                                className="bg-[#edf0ff] border border-[#b2b8de] rounded-lg text-[#000727] md:h-13 md:w-13 h-[37px] w-[37px] text-xl font-semibold text-center outline-none focus:ring-2 focus:ring-[#1c45a4] transition-all duration-200"
                            />
                        ))}
                    </div>

                    <button
                        disabled={!valid}
                        className={`mt-8 w-full h-11 rounded-lg font-semibold text-white transition-all duration-300 shadow-md ${valid && !loading
                                ? "bg-[#1c45a4] hover:bg-[#193e93] cursor-pointer"
                                : "bg-[#90a3c2] cursor-not-allowed"
                            }`}
                    >
                        Submit
                    </button>
                </form>

            </div>
        </div>

    )
}

export default OtpVerificationpage
