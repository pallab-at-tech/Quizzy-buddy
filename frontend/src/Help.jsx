import React from 'react'

const Help = () => {
    return (
        <div>
            {/* next and previous */}
            <div className="flex items-center justify-between mt-6 w-full">

                {/* finish */}
                <button
                    disabled={submitLoading}
                    className={` ${submitLoading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-500 hover:bg-blue-600"}  text-white font-bold px-8 py-2.5 rounded-lg transition-all duration-200 active:scale-95`}
                    onClick={() => {
                        removeDetails()
                        handleFinishQuiz()
                    }}
                >
                    {`${submitLoading ? "Submitting..." : "Finish"}`}
                </button>

                <div className='flex items-center justify-end gap-8'>
                    {
                        !data?.strict?.enabled && (
                            // Previous Button
                            <button
                                className={`${index === 0 ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-gray-300 hover:bg-gray-400"}  text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200`}
                                onClick={() => {
                                    if (!data?.quiz_data.length || index === 0) return
                                    setIndex(index - 1)
                                }}
                            >
                                Previous
                            </button>
                        )
                    }

                    {/* Next Button */}
                    <button
                        className={`${index >= data?.quiz_data.length - 1 ? "cursor-not-allowed bg-purple-400" : "cursor-pointer bg-purple-600 hover:bg-purple-700"} text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200`}
                        onClick={() => {
                            if (!data?.quiz_data.length || index >= data?.quiz_data.length - 1) return
                            setIndex((prevIdx) => {
                                return prevIdx + 1
                            })

                            if (data?.strict?.enabled) {
                                setTimer((prev) => {

                                    if (data?.strict?.unit !== "sec") {
                                        const updateTime = {
                                            ...prev,
                                            total: prev.total + (data?.strict?.time * 60 - prev.t),
                                            t: data?.strict?.time * 60,
                                        }
                                        localStorage.setItem("tim", JSON.stringify(updateTime))
                                        return updateTime
                                    }
                                    else {
                                        const updateTime = {
                                            ...prev,
                                            total: prev.total + (data?.strict?.time - prev.t),
                                            t: data?.strict?.time,
                                        }
                                        localStorage.setItem("tim", JSON.stringify(updateTime))
                                        return updateTime
                                    }
                                })
                            }
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Help
