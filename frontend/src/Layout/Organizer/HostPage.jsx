import React, { useEffect, useState } from "react";
import { FiCopy, FiCheck, FiClock, FiCalendar, FiUser, FiHash, FiPlay, FiStopCircle } from "react-icons/fi";
import { FaClipboardQuestion } from "react-icons/fa6";
import { FaEdit, FaImage, FaPlusCircle, FaSave, FaTimes } from "react-icons/fa";
import { FaCheckCircle, FaExclamationTriangle, FaMinusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../../common/SumarryApi";
import Axios from "../../utils/Axios";
import uploadFile from "../../utils/uploadFile"
import toast from "react-hot-toast";
import { useGlobalContext } from "../../provider/GlobalProvider";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { manageHostDetails } from "../../store/userSlice";
import { useParams } from "react-router-dom";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { GrScorecard } from "react-icons/gr";

const HostPage = () => {
    const [data, setData] = useState(null);
    const location = useLocation().state;
    const navigate = useNavigate()
    const loc = useLocation()
    const dispatch = useDispatch()
    const params = useParams()

    const navigateTo = loc.pathname.split("/")[loc.pathname.split("/").length - 1]

    const { socketConnection } = useGlobalContext()

    const [copied, setCopied] = useState(false);

    const [editing, setEditing] = useState(false)
    const [editedData, setEditedData] = useState(null)

    const [uploadLoading, setUploadLoading] = useState(new Set())
    const [imageLoadFailed, setImageLoadFailed] = useState(new Set())
    const [editLoading, setEditLoading] = useState(false)

    const [hostDetailsUpdate, setHostDetailsUpdate] = useState({
        data: {
            strict: data?.strict?.enabled || false,
            time: data?.strict?.time || 1,
            unit: data?.strict?.unit || "sec",
            set_negetive_marks: data?.set_negetive_marks || 0
        },
        updateData: {
            strict: data?.strict?.enabled || false,
            time: data?.strict?.time || 1,
            unit: data?.strict?.unit || "sec",
            set_negetive_marks: data?.set_negetive_marks || 0
        },
        loading: false
    })
    const [hostDetailsLoading, setHostDetailsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deletePanel, setDeletePanel] = useState(false)

    const [timeData, setTimeData] = useState({
        quiz_start: data?.quiz_start,
        quiz_end: data?.quiz_end
    })
    const [timeDetailsLoading, setTimeDetailsLoading] = useState(false)
    const [timeUpdateLoading, setTimeUpdateLoading] = useState(false)

    const [instandStartLoading, setInstandStartLoading] = useState(false)
    const [instantEndLoading, setInstantEndLoading] = useState(false)
    const [realisingScore, setRealisingScore] = useState(false)


    // function of fetch host details
    const fetchHostDetails = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.fetch_hostDetails,
                data: {
                    hostId: params?.quizId,
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

    // adjust normal date into local time date formate
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // Adjust for timezone offset so it shows correctly in local time
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
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
    const handelEditQuestion = async () => {
        try {
            setEditLoading(true)

            const response = await Axios({
                ...SummaryApi.saved_changes,
                data: {
                    editedData: editedData,
                    hostId: location?.hostId
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (editedData) {
                    setEditedData(responseData.savedData.quiz_data)
                }
                setData(responseData.savedData)
            }
            else {
                toast.error(responseData.message)
            }

            setEditLoading(false)
        } catch (error) {
            setEditLoading(false)
            toast.error(error?.response?.data.message || "Some error occured , try later!")
            console.log("handelEditQuestion error", error)
        }
    }

    const handleSubmitOtherDetails = async () => {
        try {
            setHostDetailsLoading(true)

            const response = await Axios({
                ...SummaryApi.host_details_update,
                data: {
                    hostId: location?.hostId,
                    strict: hostDetailsUpdate.updateData.strict,
                    time: hostDetailsUpdate.updateData.time,
                    unit: hostDetailsUpdate.updateData.unit,
                    set_negetive_marks: hostDetailsUpdate.updateData.set_negetive_marks
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                setHostDetailsUpdate((prev) => {
                    return {
                        ...prev,
                        loading: false,
                        data: responseData.data
                    }
                })
                setData((prev) => {
                    return {
                        ...prev,
                        set_negetive_marks: responseData?.data?.set_negetive_marks,
                        strict: {
                            enabled: responseData?.data?.strict || false,
                            time: responseData?.data?.time || 0,
                            unit: responseData?.data?.unit || "sec"
                        }
                    }
                })
            }
            else {
                toast.error(responseData.message)
            }

            setHostDetailsLoading(false)

        } catch (error) {
            toast.error(error?.response?.data.message || "Some error occured , try later!")
            setHostDetailsLoading(false)
            console.log("handleOtherDetails error", error)
        }
    }

    const handleUpdateTimeDetails = async () => {

        try {
            setTimeUpdateLoading(true)

            const response = await Axios({
                ...SummaryApi.host_time_update,
                data: {
                    hostId: location?.hostId,
                    quiz_start: timeData?.quiz_start,
                    quiz_end: timeData?.quiz_end
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                setData((prev) => {
                    return {
                        ...prev,
                        quiz_start: responseData?.data?.quiz_start,
                        quiz_end: responseData?.data?.quiz_end
                    }
                })
                setTimeDetailsLoading(false)
            }
            else {
                toast.error(responseData.message)
            }

            setTimeUpdateLoading(false)

        } catch (error) {
            toast.error(error?.response?.data.message || "Some error occured , try later!")
            setTimeUpdateLoading(false)
            console.log("handleUpdateTimeDetails error", error)
        }
    }

    // fetch host details for every render.
    useEffect(() => {
        fetchHostDetails();
    }, []);

    // set hostDetailsUpdate and timeDetails data
    useEffect(() => {
        if (!data) return
        setHostDetailsUpdate({
            data: {
                strict: data?.strict?.enabled || false,
                time: data?.strict?.time || 1,
                unit: data?.strict?.unit || "sec",
                set_negetive_marks: data?.set_negetive_marks || 0
            },
            updateData: {
                strict: data?.strict?.enabled || false,
                time: data?.strict?.time || 1,
                unit: data?.strict?.unit || "sec",
                set_negetive_marks: data?.set_negetive_marks || 0
            },
            loading: false
        })
        setTimeData({
            quiz_start: data?.quiz_start,
            quiz_end: data?.quiz_end
        })
    }, [data])

    const addInIds = (id_data) => {

        if (!data) return
        const isDataAlready = data?.user_ids.some((u) => u && u?.user_nanoId === id_data?.user_nanoId)
        if (!isDataAlready) {
            setData((prev) => {
                return {
                    ...prev,
                    user_ids: [id_data, ...prev.user_ids] || []
                }
            })
        }
    }

    const removeInIds = (id_data) => {
        if (!data) return
        setData((prev) => {
            return {
                ...prev,
                user_ids: prev.user_ids.filter((u) => u && u?.user_nanoId !== id_data?.user_nanoId)
            }
        })
    }

    useEffect(() => {

        if (!socketConnection) return

        socketConnection.once("added_userId", (id_data) => {
            // console.log("added_userId", id_data?.hostId, "data?._id", data?._id, "check", id_data?.hostId === data?._id)
            if (id_data?.hostId === data?._id) {
                addInIds(id_data)
            }
        })

        socketConnection.once("removed_userId", (id_data) => {
            if (id_data?.hostId === data?._id) {
                removeInIds(id_data)
            }
        })

        socketConnection.once("host_submitted", (submitData) => {
            console.log("submitData?.hostId", submitData?.hostId, "data?._id", data?._id, "check", submitData?.hostId === data?._id)
            if (submitData?.hostId === data?._id) {
                setData((prev) => {
                    return {
                        ...prev,
                        quiz_submission_data: [submitData?.data, ...prev.quiz_submission_data]
                    }
                })
            }
        })

        return () => {
            socketConnection.off("added_userId")
            socketConnection.off("removed_userId")
            socketConnection.off("host_submitted")
        }

    }, [socketConnection, data])

    const handleDeleteQuiz = () => {
        if (!socketConnection) return
        setDeleteLoading(true)
        try {

            socketConnection.once("deleted_quizz", (D_Data) => {
                toast.success(D_Data.message)
                dispatch(manageHostDetails({
                    hostId: D_Data?.hostId
                }))
                navigate(-1)
                setDeleteLoading(false)
            })

            socketConnection.once("delete_QuizErr", (D_Data) => {
                toast.error(D_Data?.message || "Some Error Occured!")
                setDeleteLoading(false)
            })

            socketConnection.emit("delete_quiz", {
                hostId: data?._id
            })

        } catch (error) {
            setDeleteLoading(false)
            console.log("handleDeleteQuiz error", error)
        }
    }

    // instand start-now controller
    const instandStart = () => {
        if (!socketConnection) return
        setInstandStartLoading(true)
        try {

            socketConnection.once("instant_started", (start_data) => {
                toast.success(start_data?.message)
                setData((prev) => {
                    return {
                        ...prev,
                        quiz_start: start_data?.startDate
                    }
                })
                setInstandStartLoading(false)
            })

            socketConnection.once("instant_startErr", (start_data) => {
                toast.error(start_data?.message)
                setInstandStartLoading(false)
            })

            socketConnection.emit("instant_startQuiz", {
                hostId: data?._id
            })

        } catch (error) {
            console.log("instandStart error", error)
            setInstandStartLoading(false)
        }
    }

    // instand end-now controller
    const instandEnd = () => {
        if (!socketConnection) return
        setInstantEndLoading(true)
        try {
            socketConnection.once("instand_endedHost", (end_data) => {
                toast.success(end_data?.message)
                setData((prev) => {
                    return {
                        ...prev,
                        quiz_end: end_data?.endDate
                    }
                })
                setInstantEndLoading(false)
            })

            socketConnection.once("instant_endErr", (end_data) => {
                toast.error(end_data?.message)
                setInstantEndLoading(false)
            })

            socketConnection.emit("instant_endQuiz", {
                hostId: data?._id
            })

        } catch (error) {
            setInstantEndLoading(false)
            console.log("instandEnd", error)
        }
    }

    // Realise score
    const realiseScore = async () => {
        if (!data) return
        try {
            setRealisingScore(true)
            const response = await Axios({
                ...SummaryApi.score_realised,
                data: {
                    hostId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData?.message)
                setData((prev) => {
                    return {
                        ...prev,
                        realise_score: true
                    }
                })
            }
            else {
                toast.error(responseData?.message)
            }

            setRealisingScore(false)

        } catch (error) {
            setRealisingScore(false)
            console.log("RealiseScore error", error)
        }
    }


    return (
        <section className="pt-0 pb-6 px-4">

            {
                navigateTo === "full-details" || navigateTo === "view" ? (
                    <Outlet context={{ data: data }} />
                ) : (
                    <section>
                        {/* host details */}
                        <div className="bg-white shadow-md rounded-lg p-8 mb-6">

                            <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                            <div className="flex items-center flex-wrap gap-2 border-2 border-blue-200 bg-blue-50 px-3 py-2 rounded-lg mb-4">
                                <span className="font-semibold">Join Code:</span>
                                <span className="font-mono  text-blue-600 bg-blue-200  px-2 py-1 rounded-md">
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
                            <div className="bg-[#fefefe] p-4 shadow-md rounded-lg border border-gray-200 mb-5 mt-5">

                                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <FiCalendar className="text-blue-500" />
                                        <strong>Start:</strong> {formatDateTime(data?.quiz_start)}
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="text-red-500" />
                                            <strong>End:</strong> {formatDateTime(data?.quiz_end)}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => setTimeDetailsLoading(true)}
                                                className="rounded-md  transition font-medium w-fit cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-blue-500 text-blue-600  hover:bg-blue-50"
                                            >
                                                <FaEdit size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700">
                                    <FiClock className="text-green-500" />
                                    <strong>Duration:</strong>{" "}
                                    {((new Date(data?.quiz_end) - new Date(data?.quiz_start)) / (1000 * 60)).toFixed(2)}{" "}
                                    min
                                </div>
                            </div>

                            {/* marks info and strict mode */}
                            <div className="bg-[#fefefe] shadow-md rounded-lg p-6 relative border border-gray-200">

                                {/* Row 1: Marks Info */}
                                <div className="flex flex-wrap items-center justify-between gap-6 mb-3">
                                    <div className="flex items-center gap-2 text-gray-800">
                                        <FaCheckCircle className="text-green-600" />
                                        <span className="font-semibold">Total Marks : </span>
                                        <span className="">{data?.total_marks ?? 0}</span>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-2 text-gray-800">
                                            <FaMinusCircle className="text-red-500" />
                                            <span className="font-semibold">Negative Marks : </span>
                                            <span className="">{data?.set_negetive_marks ?? 0}</span>
                                        </div>

                                        {/* edit button */}
                                        <div className="">
                                            <button onClick={() => setHostDetailsUpdate((prev) => { return { ...prev, loading: true } })} className="rounded-md  transition font-medium w-fit cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-blue-500 text-blue-600  hover:bg-blue-50">
                                                <FaEdit size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Strict Time */}
                                <div className="flex flex-col items-start gap-3">

                                    <div className="flex items-center gap-1.5 text-gray-800">
                                        <FaExclamationTriangle
                                            className={`${hostDetailsUpdate.data.strict ? "text-blue-600" : "text-gray-400"}`}
                                        />
                                        <span className="font-semibold">Strict Mode :</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-sm ${hostDetailsUpdate.data.strict ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {hostDetailsUpdate.data.strict ? "Enabled" : "Disabled"}
                                        </span>
                                        <div className="text-gray-900">
                                            {hostDetailsUpdate.data.strict && <span className="text-gray-400 select-none">( {"Time per Question : "} {hostDetailsUpdate.data.time} {hostDetailsUpdate.data.unit} )</span>}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="text-sm text-gray-600 leading-relaxed ">
                                        In strict mode, each question has a fixed time limit — once that time expires,
                                        the participant cannot return to or modify their answer for that question.
                                    </div>
                                </div>
                            </div>

                            {/* Instant Controls */}
                            <div className="flex items-center justify-center gap-10 mt-6">
                                {(() => {
                                    const now = new Date();
                                    const quizStart = new Date(data?.quiz_start);
                                    const quizEnd = new Date(data?.quiz_end);

                                    const hasStarted = now >= quizStart;
                                    const hasEnded = now >= quizEnd;

                                    const canStart = !hasStarted;
                                    const canEnd = hasStarted && !hasEnded;

                                    return (
                                        <>
                                            {/* Start Now Button */}
                                            <button
                                                disabled={!canStart || instandStartLoading}
                                                onClick={() => instandStart()}
                                                className={`flex items-center gap-2 ${canStart
                                                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                                    : "bg-blue-300 cursor-not-allowed"
                                                    } text-white font-medium px-5 py-2.5 rounded-lg shadow transition-all duration-200`}
                                            >
                                                <FiPlay />
                                                Start Now
                                            </button>

                                            {/* End Now Button */}
                                            <button
                                                disabled={!canEnd || instantEndLoading}
                                                onClick={() => instandEnd()}
                                                className={`flex items-center gap-2 ${canEnd
                                                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                                                    : "bg-red-300 cursor-not-allowed"
                                                    } text-white font-medium px-5 py-2.5 rounded-lg shadow transition-all duration-200`}
                                            >
                                                <FiStopCircle />
                                                End Now
                                            </button>

                                            <button
                                                disabled={data?.realise_score || !hasEnded}
                                                onClick={() => {
                                                    realiseScore()
                                                }}
                                                className={`flex items-center gap-2 ${!data?.realise_score && hasEnded
                                                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                                                    : "bg-green-300 cursor-not-allowed"
                                                    } text-white font-medium px-5 py-2.5 rounded-lg shadow transition-all duration-200`}
                                            >
                                                <GrScorecard />
                                                {realisingScore ? "Realising  , wait..." : "Realise Score"}
                                                
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="border-t border-dashed border-gray-400 my-4"></div>

                            {/* Created At */}
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                <FiCalendar className="text-gray-500" />
                                <strong>Created At:</strong> {formatDateTime(data?.createdAt)}
                            </div>
                        </div>

                        {/* Submission Board */}
                        <div className="bg-white shadow-md rounded-lg p-8 my-6 relative">

                            {/* Full details button */}
                            <button
                                className="absolute top-3 right-6 text-lg text-blue-600 cursor-pointer font-medium hover:text-blue-700 underline transition"
                                onClick={() => {
                                    navigate(`full-details`)
                                }}
                            >
                                Full Details
                            </button>

                            {/* Heading */}
                            <div className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="inline-block w-2 h-6 bg-blue-600 rounded"></span>
                                Submission Board
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">

                                {/* Joined */}
                                <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 flex-1 shadow-sm">
                                    <p className="text-gray-600 font-medium text-sm">Joined</p>
                                    <h2 className="text-3xl font-semibold text-blue-700 mt-1">{data?.user_ids?.length || 0}</h2>
                                </div>

                                {/* Submitted */}
                                <div className="flex flex-col items-center justify-center bg-green-50 border border-green-200 rounded-xl px-6 py-4 flex-1 shadow-sm">
                                    <p className="text-gray-600 font-medium text-sm">Submitted</p>
                                    <h2 className="text-2xl font-semibold text-green-700 mt-1">{data?.quiz_submission_data?.length === 0 ? "N/A" : data?.quiz_submission_data?.length || "N/AA"}</h2>
                                </div>

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
                                                    disabled={editLoading}
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
                                                    disabled={editLoading}
                                                    onClick={() => handelEditQuestion()}
                                                    className={`flex items-center gap-2 px-4 py-2 ${editLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}
                                        text-white  rounded-md  transition font-medium shadow-sm`}
                                                >
                                                    <FaSave size={14} />
                                                    {editLoading ? "Saving..." : "Save Changes"}
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

                        {/* delete section and recreate another quiz  */}
                        <div className="grid grid-cols-2 gap-x-4">
                            {/* delete section */}
                            <div className="bg-white shadow-md rounded-lg p-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Quiz</h2>
                                <p className="text-gray-600 mb-6">
                                    Once you delete this quiz, will be permanently removed.
                                    This action cannot be undone.
                                </p>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setDeletePanel(true)
                                        }}
                                        className="bg-red-600 hover:bg-red-700 cursor-pointer flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all"
                                    >
                                        <AiFillDelete size={22} />
                                        <span>Delete Quiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* recreate another quiz within same question */}
                            <div className="bg-white shadow-md rounded-lg p-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Re-Create Quiz</h2>
                                <p className="text-gray-600 mb-6">
                                    Re-Create Quiz within same Question.
                                </p>

                                <div className="flex items-center gap-4 mt-12">
                                    <button
                                        onClick={() => {
                                        }}
                                        className="bg-green-600 hover:bg-green-700 cursor-pointer flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all"
                                    >
                                        <VscGitPullRequestCreate size={22} />
                                        <span>Recreate Quiz</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            deletePanel && (
                                <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">
                                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Delete Quiz?</h2>
                                        <p className="text-gray-600 mb-8">
                                            Are you sure you want to delete this quiz ?
                                        </p>

                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => {
                                                    handleDeleteQuiz()
                                                }}
                                                className={`bg-red-600 hover:bg-red-700 text-white ${deleteLoading ? "cursor-not-allowed" : "cursor-pointer"} font-medium px-6 py-2 rounded-lg transition-all`}
                                            >
                                                Delete
                                            </button>

                                            <button
                                                disabled={deleteLoading}
                                                onClick={() => setDeletePanel(false)}
                                                className={`bg-gray-200 hover:bg-gray-300 text-gray-800 ${deleteLoading ? "cursor-not-allowed" : "cursor-pointer"} font-medium px-6 py-2 rounded-lg transition-all`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )
                        }

                        {
                            hostDetailsUpdate.loading && (
                                <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">
                                    <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-6 space-y-5 border border-gray-200">

                                        {/* Header */}
                                        <div className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                                            <span>Update Quiz Settings</span>
                                            <button
                                                onClick={() => {
                                                    setHostDetailsUpdate((prev) => {
                                                        return {
                                                            ...prev,
                                                            loading: false,
                                                            updateData: prev.data
                                                        }
                                                    })
                                                }}
                                                className="text-gray-500 hover:text-red-500 text-lg cursor-pointer"
                                                title="Close"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Strict Mode */}
                                        <div className="space-y-2">
                                            <label className="font-medium text-gray-700">Strict Mode</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={hostDetailsUpdate.updateData.strict}
                                                    onChange={(e) =>
                                                        setHostDetailsUpdate(prev => ({
                                                            ...prev,
                                                            updateData: { ...prev.updateData, strict: e.target.checked }
                                                        }))
                                                    }
                                                    className="w-4 h-4 accent-blue-600"
                                                />
                                                <span className="text-sm text-gray-600">
                                                    Enable strict mode (restrict tab switching & timed per question)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Time and Unit */}
                                        {hostDetailsUpdate.updateData.strict && (
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="flex-1">
                                                    <label className="block font-medium text-gray-700 mb-1">Time per Question</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={hostDetailsUpdate.updateData.time}
                                                        onChange={(e) => {
                                                            if (Number(e.target.value) < 1) {
                                                                toast.error("Time can't be zero or negative")
                                                                e.target.value = 1
                                                                return
                                                            }
                                                            setHostDetailsUpdate(prev => ({
                                                                ...prev,
                                                                updateData: { ...prev.updateData, time: e.target.value }
                                                            }))
                                                        }}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block font-medium text-gray-700 mb-1">Unit</label>
                                                    <select
                                                        value={hostDetailsUpdate.updateData.unit}
                                                        onChange={(e) =>
                                                            setHostDetailsUpdate(prev => ({
                                                                ...prev,
                                                                updateData: { ...prev.updateData, unit: e.target.value }
                                                            }))
                                                        }
                                                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                                    >
                                                        <option value="sec">Seconds</option>
                                                        <option value="min">Minutes</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Negative Marks */}
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Negative Marks</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={hostDetailsUpdate.updateData.set_negetive_marks}
                                                onChange={(e) => {
                                                    setHostDetailsUpdate(prev => ({
                                                        ...prev,
                                                        updateData: { ...prev.updateData, set_negetive_marks: Math.abs(e.target.value) }
                                                    }))
                                                }}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                            <button
                                                disabled={hostDetailsLoading}
                                                onClick={() => {
                                                    setHostDetailsUpdate((prev) => {
                                                        return {
                                                            ...prev,
                                                            loading: false,
                                                            updateData: prev.data
                                                        }
                                                    })
                                                }}
                                                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={hostDetailsLoading}
                                                onClick={() => {
                                                    handleSubmitOtherDetails()
                                                }}
                                                className={`px-5 py-2 rounded-md ${hostDetailsLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white transition`}
                                            >
                                                Save Changes
                                            </button>
                                        </div>

                                    </div>
                                </section>
                            )
                        }

                        {
                            timeDetailsLoading && (
                                <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50">
                                    <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-6 space-y-5 border border-gray-200">

                                        {/* Header */}
                                        <div className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                                            <span>Update Quiz Timing</span>
                                            <button
                                                disabled={timeUpdateLoading}
                                                onClick={() => {
                                                    setTimeDetailsLoading(false)
                                                    setTimeData({
                                                        quiz_start: data?.quiz_start,
                                                        quiz_end: data?.quiz_end
                                                    })
                                                }}
                                                className="text-gray-500 hover:text-red-500 text-lg cursor-pointer"
                                                title="Close"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Quiz Start Time */}
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Quiz Start Time</label>
                                            <input
                                                type="datetime-local"
                                                value={formatDateForInput(timeData.quiz_start)}
                                                onChange={(e) => {
                                                    const now = new Date()

                                                    if (now >= new Date(e.target.value)) {
                                                        toast.error("past Time can't be selected!")
                                                        return
                                                    }

                                                    setTimeData((prev) => {
                                                        return {
                                                            ...prev,
                                                            quiz_start: e.target.value
                                                        }
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                            />
                                        </div>

                                        {/* Quiz End Time */}
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Quiz End Time</label>
                                            <input
                                                type="datetime-local"
                                                value={formatDateForInput(timeData.quiz_end)}
                                                onChange={(e) => {
                                                    const now = new Date()

                                                    if (now >= new Date(e.target.value)) {
                                                        toast.error("past Time can't be selected!")
                                                        return
                                                    }

                                                    setTimeData((prev) => {
                                                        return {
                                                            ...prev,
                                                            quiz_end: e.target.value
                                                        }
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="text-sm text-gray-600">
                                            ⚡ Make sure the start time is earlier than the end time.
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                            <button
                                                disabled={timeUpdateLoading}
                                                onClick={() => {
                                                    setTimeDetailsLoading(false)
                                                    setTimeData({
                                                        quiz_start: data?.quiz_start,
                                                        quiz_end: data?.quiz_end
                                                    })

                                                }}
                                                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                disabled={timeUpdateLoading}
                                                onClick={() => handleUpdateTimeDetails()}
                                                className={`px-5 py-2 rounded-md ${timeUpdateLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}  text-white  transition`}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>

                                </section>
                            )
                        }
                    </section>
                )
            }

        </section>
    );
};

export default HostPage;
