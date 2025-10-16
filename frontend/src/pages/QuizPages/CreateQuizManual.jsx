import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FaImage, FaPlusCircle } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast'
import uploadFile from '../../utils/uploadFile';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SumarryApi';
import { useSelector , useDispatch } from 'react-redux';
import { FiCopy, FiCheck } from "react-icons/fi";
import { setHostDetails } from '../../store/userSlice';

const CreateQuizManual = () => {
    const { data } = useOutletContext();

    const [questions, setQuestions] = useState([
        { question: '', options: ['', ''], correct: '', marks: '', image: '', inputBox: false },
    ]);
    const user = useSelector(state => state?.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [copied, setCopied] = useState(false);
    const [quizData, setQuizData] = useState(null)

    const handleCopy = () => {
        navigator.clipboard.writeText(quizData.data.join_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const [uploadLoading, setUploadLoading] = useState(new Set())
    const [submitLoading, setSubmitLoading] = useState(false)

    // Add new question
    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { question: '', options: ['', ''], correct: '', marks: '', image: '', inputBox: false },
        ]);
    };

    // add more option
    const addMoreOption = (index) => {

        setQuestions((preve) => {
            const updated = [...preve]
            updated[index] = {
                ...updated[index],
                options: [...updated[index].options, '']
            }

            return updated
        })
    }

    // remove last option
    const removeMoreOption = (index) => {

        setQuestions((prev) => {
            const updated = [...prev]
            const currentOptions = [...updated[index].options]

            if (currentOptions.length > 1) currentOptions.pop()

            updated[index] = {
                ...updated[index],
                options: currentOptions
            }

            return updated
        })
    }

    //  Remove question
    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    //  Handle input changes
    const handleChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    //  Handle option updates
    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);
    };

    // handle upload file
    const handleUploadFile = async (e, index) => {

        try {
            let updateSet = new Set()
            updateSet.add(index)
            setUploadLoading(updateSet)

            const file = e.target.files?.[0]
            if (!file) return

            const response = await uploadFile(file)

            if (response?.secure_url) {
                setQuestions((prev) => {

                    const updated = [...prev]
                    updated[index].image = response?.secure_url
                    return updated
                })
            }

            updateSet = new Set()
            updateSet.delete(index)
            setUploadLoading(updateSet)
        } catch (error) {
            console.log("handleUploadFile error", error)
            const updateSet = new Set()
            updateSet.delete(index)
            setUploadLoading(updateSet)
        }
    }

    const handleSubmitQuiz = async () => {
        try {
            setSubmitLoading(true)

            const response = await Axios({
                ...SummaryApi.create_quiz,
                data: {
                    host_user_nanoId: user?.nanoId,
                    time_sec_min: data?.time_sec_min || "Seconds",
                    quiz_data: questions,
                    quiz_start: data?.quiz_start || "",
                    quiz_expire_per_Q: data?.quiz_expire_per_Q || "",
                    set_negetive_marks: data?.set_negetive_marks || 0,
                }
            })

            const { data: responseData } = response

            if (responseData?.success) {
                toast.success(responseData?.message)
                setQuizData(responseData)
                dispatch(setHostDetails({
                    data : responseData?.host_info
                }))
            }
            else {
                toast.error(responseData?.message || "Some error occued!")
            }

            setSubmitLoading(false)

        } catch (error) {
            toast.error(error.response.data.message || "Some error occued!")
            setSubmitLoading(false)
            console.log("create quiz error", error)
        }
    }

    // console.log("question set", questions)
    // console.log("external data",data)

    return (
        <section className="h-[calc(100vh-70px)] overflow-y-auto bg-gray-50 p-6 scrollbar-hide">

            <div className="max-w-3xl mx-auto">

                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Create Quiz Manually
                </h1>

                {/* Quiz Info */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 flex items-center justify-between px-4">
                    <div>
                        <p className="text-gray-700">
                            <span className="font-semibold">Host ID :</span>{' '}
                            {data?.host_id || 'N/A'}
                        </p>
                        <p className="text-gray-700">
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
                    </div>
                    <div onClick={() => handleSubmitQuiz()}
                        className={`mr-4 ${submitLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white font-semibold px-4 py-2 rounded-md transition`}
                    >
                        Submit
                    </div>
                </div>

                <div className='overflow-y-scroll max-h-[calc(100vh-100px)] thin_scrollbar'>
                    {/* Question Blocks */}
                    {questions.map((q, i) => (
                        <div
                            key={i}
                            className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 transition-all hover:shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Question {i + 1}
                                </h2>
                                {questions.length > 1 && (
                                    <button
                                        onClick={() => removeQuestion(i)}
                                        className="text-red-500 hover:text-red-700 transition"
                                        title="Remove question"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                )}
                            </div>

                            {/* add image */}
                            {
                                q.image ? (
                                    <div className='relative mb-4 group'>
                                        <img src={q.image} alt="" className="w-full max-h-64 object-contain rounded-lg border" />
                                        <div
                                            onClick={() => {
                                                setQuestions((prev) => {
                                                    const updated = [...prev]
                                                    updated[i].image = ""
                                                    return updated
                                                })
                                            }}
                                            className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
                                        >
                                            Remove Image
                                        </div>

                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-4 my-5 hover:bg-gray-100 transition cursor-pointer">
                                        {
                                            uploadLoading.has(i) ? (
                                                <div className='fileLoader'></div>
                                            ) : (
                                                <label htmlFor={`image-${i}`} className='flex flex-col items-center justify-center cursor-pointer'>
                                                    <FaImage className="text-3xl text-gray-500 mb-2" />
                                                    <p className="text-sm text-gray-600">Click to upload image</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id={`image-${i}`}
                                                        onChange={(e) => handleUploadFile(e, i)}
                                                    />
                                                </label>
                                            )
                                        }
                                    </div>
                                )
                            }

                            {/* Question Text */}
                            <textarea
                                value={q.question}
                                onChange={(e) => handleChange(i, 'question', e.target.value)}
                                placeholder="Enter your question here..."
                                className="w-full min-h-[70px] max-h-[150px] p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                            />

                            {/* option choose for text answer or input box */}
                            <div className="flex items-center gap-6 mb-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`questionType-${i}`}
                                        value="mcq"
                                        checked={!q.inputBox}
                                        onChange={() => {
                                            setQuestions((prev) => {
                                                const updated = [...prev]
                                                updated[i].inputBox = false
                                                return updated
                                            })
                                        }}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Multiple Choice</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`questionType-${i}`}
                                        value="text"
                                        checked={q.inputBox}
                                        onChange={() => {
                                            setQuestions((prev) => {
                                                const updated = [...prev]
                                                updated[i].inputBox = true
                                                return updated
                                            })
                                        }}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Text Answer</span>
                                </label>
                            </div>

                            {
                                q.inputBox ? (
                                    <div className=" border border-blue-200 rounded-lg p-4 mb-4">
                                        <h1 className="text-sm text-blue-800 font-medium mb-2">
                                            💡 You may leave this field empty — our AI will automatically analyze the correct answer.
                                        </h1>

                                        <textarea
                                            name={`correct-${i}`}
                                            id={`correct-${i}`}
                                            placeholder="Enter the correct answer..."
                                            className="w-full min-h-[70px] max-h-[150px] p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {/* Options */}
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            {q.options.map((opt, j) => (
                                                <input
                                                    key={j}
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(i, j, e.target.value)}
                                                    placeholder={`Option ${j + 1}`}
                                                    className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            ))}
                                        </div>

                                        {/* options add or remove */}
                                        <div className='flex gap-6 justify-end pb-4'>
                                            <span onClick={() => addMoreOption(i)} className={`text-green-600 font-semibold cursor-pointer`}>Add option</span>
                                            <span onClick={() => removeMoreOption(i)} className={`text-red-600 font-semibold cursor-pointer ${q.options.length < 2 ? "hidden" : "block"}`}>Remove option</span>
                                        </div>
                                    </>
                                )
                            }


                            {/* Correct Answer + Marks */}
                            <div className="flex items-center justify-between">

                                {
                                    !q.inputBox && (
                                        <label className="text-sm text-gray-600">
                                            Correct Answer:
                                            <select
                                                value={q.correct}
                                                onChange={(e) =>
                                                    handleChange(i, 'correct', e.target.value)
                                                }
                                                className="ml-2 p-1 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select</option>
                                                {q.options.map((_, idx) => (
                                                    <option key={idx} value={idx}>
                                                        Option {idx + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    )
                                }

                                <label className="text-sm text-gray-600">
                                    Marks:
                                    <input
                                        type="number"
                                        value={q.marks}
                                        onChange={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0
                                                toast.error("Marks can't be negative")
                                            }
                                            handleChange(i, 'marks', e.target.value)
                                        }}
                                        min="0"
                                        placeholder="e.g. 2"
                                        className="ml-2 p-1 border border-gray-300 rounded-md w-20 outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </label>
                            </div>
                        </div>
                    ))}

                    {/* Add Question Button */}
                    <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                        <FaPlusCircle size={18} /> Add Question
                    </button>
                </div>
            </div>

            {
                quizData && (
                    <section className="fixed inset-0 flex items-center justify-center bg-[#98b9e08f] backdrop-blur-[5px]">

                        <div className="bg-white shadow-xl rounded-2xl p-6 w-[90%] max-w-[500px]">

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
                                🎉 Quiz Created Successfully!
                            </h1>

                            {/* Details */}
                            <div className="space-y-2 text-gray-800 px-5 text-[16px]">

                                <div className="flex flex-col">

                                    <div className='flex items-center  gap-2'>
                                        <span className="font-semibold">Join Code:</span>
                                        <span className="font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                                            {quizData.data.join_code}
                                        </span>

                                        <button
                                            onClick={handleCopy}
                                            className="text-gray-600 hover:text-blue-600 transition"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? <FiCheck size={18} /> : <FiCopy size={18} className='cursor-pointer'/>}
                                        </button>

                                        {copied && (
                                            <span className="text-sm text-green-600 font-medium">Copied!</span>
                                        )}
                                    </div>
                                    <p>
                                        <span className="font-semibold">Total Marks:</span>{" "}
                                        {quizData.data.total_marks}
                                    </p>
                                </div>

                                <div className='flex flex-col items-center justify-center-safe bg-blue-200 rounded-md p-2 mt-3 font-semibold text-blue-900 text-sm'>
                                    <div>
                                        <p>
                                            <span className="font-semibold">Start Time :</span>{" "}
                                            {quizData.data.start_time}
                                        </p>
                                        <p>
                                            <span className="font-semibold">End Time :</span>{" "}
                                            {quizData.data.end_time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={()=>{
                                        setQuizData(null)
                                        navigate("/host-quiz")
                                    }}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </section>
                )
            }

        </section>
    );
};

export default CreateQuizManual;
