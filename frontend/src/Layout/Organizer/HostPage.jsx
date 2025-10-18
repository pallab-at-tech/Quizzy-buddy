import React, { useEffect, useState } from "react";
import { FiCopy, FiCheck, FiClock, FiCalendar, FiUser, FiHash } from "react-icons/fi";
import { FaClipboardQuestion } from "react-icons/fa6";
import { FaEdit, FaImage, FaPlusCircle, FaSave, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
import SummaryApi from "../../common/SumarryApi";
import Axios from "../../utils/Axios";
import uploadFile from "../../utils/uploadFile"
import toast from "react-hot-toast";

const HostPage = () => {
    const [data, setData] = useState(null);
    const location = useLocation().state;

    const [copied, setCopied] = useState(false);

    const [editing, setEditing] = useState(false)
    const [editedData, setEditedData] = useState(null)

    const [uploadLoading, setUploadLoading] = useState(new Set())

    const [imageLoadFailed, setImageLoadFailed] = useState(new Set())

    // function of fetch host details
    const fetchHostDetails = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.fetch_hostDetails,
                data: {
                    hostId: location?.hostId,
                },
            });

            const { data: responseData } = response;
            setData(responseData?.data);
        } catch (error) {
            setData("Illegal Access");
            console.log("fetchHostDetails Error", error);
        }
    };

    // copy the join code
    const handleCopy = (copyData) => {
        navigator.clipboard.writeText(copyData);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // convert date into local time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return (
            date.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
            }) || "N/A"
        );
    };


    // Add new question
    const addQuestion = () => {
        setEditedData((prev) => [
            { question: '', options: ['', ''], correct_option: '', marks: '', image: '', inputBox: false },
            ...prev
        ]);
        toast.success("Question Added.")
    };

    //  Remove question
    const removeQuestion = (index) => {
        // setQuestions(questions.filter((_, i) => i !== index));
        setEditedData(editedData.filter((_, i) => index !== i))
    };

    //  Handle input changes
    const handleChange = (index, field, value) => {
        const updated = [...editedData];
        updated[index][field] = value;
        setEditedData(updated);
    };

    // add more option
    const addMoreOption = (index) => {

        setEditedData((preve) => {
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

        setEditedData((prev) => {
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

    //  Handle option updates
    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...editedData];
        updated[qIndex].options[optIndex] = value;
        setEditedData(updated);
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
                setEditedData((prev) => {

                    const updated = [...prev]
                    updated[index].image = response?.secure_url
                    return updated
                })

                // remove from image failed
                let imageSet = new Set(imageLoadFailed)
                imageSet.delete(index)
                setImageLoadFailed(imageSet)
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

    // handle edit question set.
    const handelEditQuestion = () => {

    }

    // fetch host details for every render.
    useEffect(() => {
        fetchHostDetails();
    }, []);

    console.log("host data", editedData)

    return (
        <section className="pt-0 pb-6 px-4">

            {/* host details */}
            <div className="bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Host Dashboard
                </h1>

                {/* Host ID */}
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <FiHash className="text-blue-500" />
                    <p>
                        <strong>Host ID:</strong> <span>{data?.nano_id}</span>
                    </p>
                </div>

                {/* Join Code */}
                <div className="flex items-center flex-wrap gap-2 border border-gray-300 bg-blue-50 px-3 py-2 rounded-md mb-4">
                    <span className="font-semibold">Join Code:</span>
                    <span className="font-mono bg-white border border-gray-200 px-2 py-1 rounded-md">
                        {data?.provide_join_code}
                    </span>

                    <button
                        onClick={() => handleCopy(data?.provide_join_code)}
                        className="text-gray-700 hover:text-blue-600 transition"
                        title="Copy to clipboard"
                    >
                        {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                    </button>

                    {copied && (
                        <span className="text-sm text-green-600 font-medium">Copied!</span>
                    )}
                </div>

                {/* Quiz Timing */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-blue-500" />
                            <strong>Start:</strong> {formatDateTime(data?.quiz_start)}
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-red-500" />
                            <strong>End:</strong> {formatDateTime(data?.quiz_end)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FiClock className="text-green-500" />
                        <strong>Duration:</strong>{" "}
                        {(new Date(data?.quiz_end) - new Date(data?.quiz_start)) /
                            (1000 * 60)}{" "}
                        min
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-400 my-4"></div>

                {/* Created At */}
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <FiCalendar className="text-gray-500" />
                    <strong>Created At:</strong> {formatDateTime(data?.createdAt)}
                </div>
            </div>

            {/* Question section */}
            <div className="bg-white shadow-md rounded-lg p-8 my-6">

                {/* header */}
                <div className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaClipboardQuestion size={24} className="text-blue-600" />
                    Question Set
                </div>

                {/* question set */}
                <div className="flex flex-col gap-5 relative ">

                    <div className="absolute -top-[64px] right-2 z-50 flex items-center gap-4">

                        <button
                            onClick={() => {
                                handelEditQuestion()
                                setEditing(true)
                                setEditedData(data?.quiz_data || [])
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 border ${editing ? "border-red-500 text-red-600  hover:bg-red-50" : "border-blue-500 text-blue-600  hover:bg-blue-50"} 
                            rounded-md  transition font-medium w-fit cursor-pointer`}
                        >
                            <FaEdit size={16} />
                            {editing ? "Editing" : "Edit"}
                        </button>

                        {/* Add Question Button */}
                        {
                            editing && (
                                <button
                                    onClick={addQuestion}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                                >
                                    <FaPlusCircle size={18} /> Add Question
                                </button>
                            )
                        }
                    </div>

                    {
                        editing ? (
                            <div className="max-h-[800px] overflow-y-auto thin_scrollbar">
                                {
                                    editedData?.map((q, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm hover:shadow-md transition mb-3"
                                            >
                                                {/* header */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <h2 className="text-lg font-semibold text-gray-700">
                                                        Q{i + 1}.{" "}
                                                    </h2>
                                                    {data?.quiz_data.length > 1 && (
                                                        <button
                                                            onClick={() => removeQuestion(i)}
                                                            className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                                            title="Remove Question"
                                                        >
                                                            <MdDelete size={20} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* add image */}
                                                {
                                                    q.image && !imageLoadFailed.has(i) ? (
                                                        <div className='relative mb-4 group'>
                                                            <img
                                                                src={q.image}
                                                                alt=""
                                                                className="w-full max-h-64 object-contain rounded-lg border"
                                                                onError={() => {
                                                                    const set = new Set(imageLoadFailed)
                                                                    set.add(i)
                                                                    setImageLoadFailed(set)
                                                                }}
                                                            />
                                                            <div
                                                                onClick={() => {
                                                                    setEditedData((prev) => {
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
                                                                setEditedData((prev) => {
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
                                                                setEditedData((prev) => {
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
                                                                    value={q.correct_option}
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
                                        )
                                    })
                                }

                                <div className="flex items-center justify-start gap-4 mt-6">
                                    {/* Discard Button */}
                                    <button
                                        onClick={() => {
                                            setEditedData(null)
                                            setEditing(false)
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 
                                        rounded-md hover:bg-red-50 transition font-medium cursor-pointer"
                                    >
                                        <FaTimes size={14} />
                                        Discard Changes
                                    </button>

                                    {/* Save Button */}
                                    <button
                                        // onClick={onSave}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                                        rounded-md hover:bg-blue-700 transition font-medium shadow-sm cursor-pointer"
                                    >
                                        <FaSave size={14} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="max-h-[800px] overflow-y-auto thin_scrollbar">
                                {data?.quiz_data?.map((q, i) => (
                                    <div
                                        key={q._id || i}
                                        className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm hover:shadow-md transition mb-3"
                                    >
                                        {/* Image (if any) */}
                                        {q.image && !imageLoadFailed.has(i) ? (
                                            <div className="mb-4">
                                                <img
                                                    src={q.image}
                                                    alt={`Question ${i + 1}`}
                                                    className="w-full max-h-60 object-contain rounded-md border"
                                                    onError={() => {
                                                        const set = new Set(imageLoadFailed)
                                                        set.add(i)
                                                        setImageLoadFailed(set)
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            q.image && (
                                                <div>
                                                    <h1 className="bg-red-200 p-1.5 w-fit text-red-600 mb-2">Image Failed to load or may the image doesn't exist</h1>
                                                </div>
                                            )
                                        )}

                                        {/* Question Text */}
                                        <div className="mb-3">
                                            <span className="font-semibold text-gray-800">
                                                Q{i + 1}.{" "}
                                            </span>
                                            <span className="text-gray-700">{q.question}</span>
                                        </div>

                                        {/* Marks */}
                                        <div className="text-sm text-gray-600 mb-3">
                                            <strong>Marks:</strong> {q.marks}
                                        </div>

                                        {/* Options or Text Answer */}
                                        {q.inputBox ? (
                                            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-md">
                                                <p className="text-sm text-gray-700">
                                                    <strong>Answer (Text) :</strong>{" "}
                                                    {q.correct_option || "Not set"}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {q.options?.map((opt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`px-4 py-2 border rounded-md text-gray-700 ${idx.toString() === q.correct_option
                                                            ? "bg-green-100 border-green-500 font-semibold"
                                                            : "bg-white border-gray-300"
                                                            }`}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>

        </section>
    );
};

export default HostPage;
