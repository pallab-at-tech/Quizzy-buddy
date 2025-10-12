import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import toast from 'react-hot-toast'

const HostQuizPage = () => {

    const user = useSelector(state => state.user)
    const [minDateTime, setMinDateTime] = useState("");

    const [data, setData] = useState({
        quiz_start: "",
        quiz_expire_per_Q: "",
        set_negetive_marks: 0
    })

    const handleDateTimeChange = (e) => {
        const selected = new Date(e.target.value);
        const now = new Date();

        if (selected < now) {
            toast.error("You cannot select past date or time!")
            setData((prev) => {
                return {
                    ...prev,
                    quiz_start: ""
                }
            })
        } else {
            setData((prev) => {
                return {
                    ...prev,
                    quiz_start: e.target.value
                }
            })
        }
    };

    useEffect(() => {
        const updateMin = () => {
            const now = new Date();
            const formatted = now.toISOString().slice(0, 16);
            setMinDateTime(formatted);
        };

        updateMin();
        const timer = setInterval(updateMin, 60000);
        return () => clearInterval(timer);
    }, []);

    // console.log("HostQuizPage user", user)

    return (
        <section className='h-[calc(100vh-70px)] grid grid-cols-[320px_1fr]'>

            {/* sidebar */}
            <div className="px-6 py-8 bg-white shadow-md border-r-2 border-r-gray-200  flex flex-col gap-6 sticky top-[70px] max-h-[calc(100vh-70px)]">
                {/* Host Details */}
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Host Details</h2>
                    <p className="text-gray-800">
                        <span className="font-medium">Host ID:</span> {user?.nanoId || "N/A"}
                    </p>
                </div>

                {/* Quiz Timing */}
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">

                    <h2 className="text-lg font-semibold text-gray-700">Quiz Timing</h2>

                    <label className="flex flex-col text-gray-600 text-sm">
                        Start Date & Time
                        <input
                            type="datetime-local"
                            min={minDateTime}
                            value={data.quiz_start}
                            onChange={handleDateTimeChange}
                            className="mt-1 p-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-400"
                        />
                    </label>

                    <div className="flex flex-col text-gray-600 text-sm">
                        Time per Question
                        <div className="mt-1 flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                placeholder="e.g. 10"
                                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                                onChange={(e) => {

                                    if (e.target.value <= 0) {
                                        toast.error("Negative / null time can't selected.")
                                        e.target.value = ""
                                    }
                                    else {
                                        setData((preve) => {
                                            return {
                                                ...preve,
                                                quiz_expire_per_Q: e.target.value
                                            }
                                        })
                                    }
                                }}
                            />
                            <select
                                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="seconds">Seconds</option>
                                <option value="minutes">Minutes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Negative Mark */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Negative Marks</h2>
                    <input
                        type="number"
                        max={0}
                        onChange={(e) => {
                            if (e.target.value > 0) {
                                toast.error("This field can't take positive value.")
                                e.target.value = 0
                            }
                            else {
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        set_negetive_marks: e.target.value
                                    }
                                })
                            }
                        }}
                        placeholder="Enter negative mark"
                        className="w-full p-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-red-400"
                    />
                </div>
            </div>

            {/* Quiz Set Section */}
            {
                <Outlet context={{ data: data }} />
            }

        </section>
    )
}

export default HostQuizPage
