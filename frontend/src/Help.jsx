import React from 'react'

const Help = () => {
    return (
        <div>
            <div>
                        {/* Host Id */}
                        <p className="text-gray-700">
                            <span className="font-semibold">Host ID :</span>{' '}
                            {data?.host_id || 'N/A'}
                        </p>

                        {/* For  tablet and desktop version*/}
                        <p className="text-gray-700 hidden sm:block">
                            <span className="font-semibold">Start Time :</span>{' '}
                            {data?.quiz_start
                                ? new Date(data.quiz_start).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : 'Not Set'}
                        </p>

                        {/* start time and date for mobile version */}
                        <label className="block sm:hidden text-gray-600 mt-3.5">
                            <p className="font-semibold">Start Date & Time : </p>
                            <input
                                name='quiz_start'
                                type="datetime-local"
                                min={minDateTime}
                                // value={data.quiz_start}
                                // onChange={handleDateTimeChange}
                                className="mt-1 p-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </label>

                        {/* End Date & Time for mobile version */}
                        <label className="block sm:hidden text-gray-600 mt-3.5">
                            <p className="font-semibold">End Date & Time</p>
                            <input
                                name='quiz_end'
                                type="datetime-local"
                                min={minDateTime}
                                // value={data.quiz_end}
                                // onChange={handleDateTimeChange}
                                className="mt-1 p-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </label>

                        {/* Negative Mark for mobile version */}
                        <div className="rounded-lg sm:shadow-md block sm:hidden mt-3.5">
                            <h2 className="font-semibold text-gray-700 mb-2">Negative Marks</h2>
                            <input
                                type="number"
                                max={0}
                                onChange={(e) => {
                                    if (e.target.value > 0) {
                                        toast.error("This field can't take positive value.")
                                        e.target.value = 0
                                    }
                                    else {
                                        // setData((prev) => {
                                        //     return {
                                        //         ...prev,
                                        //         set_negetive_marks: e.target.value
                                        //     }
                                        // })
                                    }
                                }}
                                placeholder="Enter negative mark"
                                className="w-full p-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-red-400"
                            />
                        </div>
                    </div>
        </div>
    )
}

export default Help
