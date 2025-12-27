import React from 'react'

const Help = () => {
    return (
        <div>
           <div className="mb-4 bg-white rounded-3xl shadow-md px-10 py-10 border border-gray-200">

                            {/* Sub-Header */}
                            <div className="flex items-center justify-center gap-3 mb-6 mr-[100px]">
                                <FaBookOpen className="text-3xl text-indigo-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Quiz Rules</h2>
                            </div>

                            {/* Other content */}
                            <ul className="text-gray-700 text-lg space-y-3 grid grid-cols-2 grid-rows-2 gap-x-10">
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    Each question carries <b>5 marks</b>.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    No <b>Negative</b> marks.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    You get <b>10 seconds</b> to answer each question.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    Total <b>10 questions</b> will be provided.
                                </li>
                            </ul>
                        </div>
        </div>
    )
}

export default Help
