import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaBusinessTime
} from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { MdPending, MdOutlineDoneAll, MdPlayCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RiTimeZoneLine } from "react-icons/ri";



const OrganizerPannel = () => {

  const host_info = useSelector((state) => state.user).host_info || [];
  const params = useParams()

  const [classified_data, setClassified_data] = useState({
    past: [],
    present: [],
    future: []
  })

  // Format date/time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Determine quiz status
  const getStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start))
      return {
        label: "Upcoming",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <MdPending className="text-yellow-500" />,
      };
    if (now > new Date(end))
      return {
        label: "Ended",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: <MdOutlineDoneAll className="text-red-500" />,
      };
    return {
      label: "Ongoing",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: <MdPlayCircle className="text-green-500" />,
    };
  };

  // Get duration (in minutes)
  const getDuration = (start, end) => {
    const diff = (new Date(end) - new Date(start)) / 60000;
    return `${Math.abs(Math.round(diff))} min`;
  };

  // classify past and future quiz details
  const classifyPastFuture = (data) => {

    if (!data) return
    const now = new Date()

    const past = []
    const present = []
    const future = []

    data.forEach((v, i) => {
      if (v) {

        // present
        if (new Date(v.startDate) <= now && new Date(v?.endDate) >= now) {
          present.push(v)
        }
        // future
        else if (new Date(v.startDate) > now) {
          future.push(v)
        }
        // past
        else {
          past.push(v)
        }

      }

      setClassified_data({
        past: [...past],
        present: [...present],
        future: [...future]
      })
    })
  }

  useEffect(() => {

    if (!host_info) return
    classifyPastFuture(host_info)
  }, [host_info])


  return (
    <section className="h-[calc(100vh-70px)] overflow-y-auto  bg-gradient-to-br from-gray-50 to-gray-100 page-scroll">

      {
        params?.quizId ? (
          <>
            <Outlet />
          </>
        ) : (
          <div className="custom-lg:max-w-[1100px] mx-auto p-8">

            <header className="mb-3.5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b-2 border-b-gray-300 pb-0.5 sm:pb-6">
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-3 sm:mb-0">
                Organizer Dashboard
              </h1>
              <p className="text-gray-500 text-sm hidden sm:block">
                <Link to={`/host-quiz`} className="font-bold text-lg mr-14 w-fit border-2 border-gray-400 px-2.5 py-2 rounded-xl hover:bg-[#f1f1f1] transition-colors duration-150">
                  Host Quiz
                </Link>
              </p>
            </header>

            {host_info.length === 0 ? (
              <div>
                <div className="flex gap-3 items-center sm:hidden text-xl font-semibold pt-3">
                  <p className="text-gray-700">Host New Quiz ?</p>
                  <Link to={`/host-quiz`} className="text-blue-600">Click here</Link>
                </div>
                <div className="text-gray-400 text-center mt-[200px] text-[22px] font-semibold">
                  <p className="select-none">No hosted quizzes found. Start hosting to see them here 🎯</p>
                </div>
              </div>
            ) : (
              <div>

                {/* future quizzes */}
                <div className="space-y-6">
                  {
                    classified_data.future.length > 0 && (
                      <div className="py-2 sm:py-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <RiTimeZoneLine className="text-yellow-500" />
                          Future Quizzes
                        </h2>

                        <div className="flex items-stretch gap-4 w-[290px] custom-sm:w-[700px] custom-lg:w-[1024px] overflow-x-auto thin_scrollbar px-2 py-2">
                          {
                            classified_data.future.map((v, i) => {
                              const status = getStatus(v.startDate, v.endDate);
                              return (
                                <div key={i} className="bg-white shadow-md border-2 border-gray-300 rounded-2xl py-5 pl-6 hover:shadow-lg transition-all duration-200 min-w-[260px] sm:min-w-[280px] custom-lg:min-w-[320px] flex-shrink-0">

                                  {/* Quiz title */}
                                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                    <span>Quiz ID :</span> {v.quiz_id || "Untitled Quiz"}
                                  </h3>

                                  {/* Status */}
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}
                                  >
                                    {status.icon}
                                    {status.label}
                                  </span>

                                  {/* Info */}
                                  <div className="mt-4 space-y-2 text-gray-600 text-sm">
                                    <div className="flex items-center">
                                      <FaCalendarAlt className="text-indigo-500 mr-2" />
                                      <span>
                                        <strong>Start : </strong> {formatDateTime(v.startDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <FaClock className="text-purple-500 mr-2" />
                                      <span>
                                        <strong>End : </strong> {formatDateTime(v.endDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <FaRegHourglassHalf className="text-orange-500 mr-2" />
                                      <span>
                                        <strong>Duration : </strong> {getDuration(v.startDate, v.endDate)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action */}
                                  <div className="mt-5 group">
                                    <Link
                                      to={`/dashboard/organizer-pannel/${v?._id}`}
                                      state={{ hostId: v._id }}
                                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
                                    >
                                      <MdPlayCircle />
                                      View Details
                                    </Link>

                                    {/* Hover Accent Line */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500"></div>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    )
                  }
                </div>

                {/* present / ongoing quiz */}
                <div className="space-y-6">
                  {classified_data.present.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaRegHourglassHalf className="text-green-500" />
                        Ongoing Quizzes
                      </h2>

                      <div className="flex items-stretch gap-4 w-[290px] custom-sm:w-[700px] custom-lg:w-[1024px] overflow-x-auto thin_scrollbar px-2 py-2">
                        {classified_data.present.map((v, i) => {
                          const status = getStatus(v.startDate, v.endDate);
                          return (
                            <div
                              key={i}
                              className="bg-white shadow-md border-2 border-gray-300 rounded-2xl py-4 sm:py-5 pl-6 hover:shadow-lg transition-all duration-200 min-w-[260px] sm:min-w-[280px] custom-lg:min-w-[320px] flex-shrink-0"
                            >
                              {/* Quiz title */}
                              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                <span>Quiz ID :</span> {v.quiz_id || "Untitled Quiz"}
                              </h3>

                              {/* Status */}
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>

                              {/* Info */}
                              <div className="mt-4 space-y-2 text-gray-600 text-sm">
                                <div className="flex items-center">
                                  <FaCalendarAlt className="text-indigo-500 mr-2" />
                                  <span>
                                    <strong>Start : </strong> {formatDateTime(v.startDate)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FaClock className="text-purple-500 mr-2" />
                                  <span>
                                    <strong>End : </strong> {formatDateTime(v.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FaRegHourglassHalf className="text-orange-500 mr-2" />
                                  <span>
                                    <strong>Duration : </strong> {getDuration(v.startDate, v.endDate)}
                                  </span>
                                </div>
                              </div>

                              {/* Action */}
                              <div className="mt-5 group ">
                                <Link
                                  to={`/dashboard/organizer-pannel/${v?._id}`}
                                  state={{ hostId: v._id }}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
                                >
                                  <MdPlayCircle />
                                  View Details
                                </Link>

                                {/* Hover Accent Line */}
                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* past quizzes */}
                <div className="space-y-6">
                  {
                    classified_data.past.length > 0 && (
                      <div className="py-2 sm:py-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaBusinessTime className="text-red-500" />
                          Past Quizzes
                        </h2>

                        <div className="flex items-stretch pb-3 gap-4 w-[290px] custom-sm:w-[700px] custom-lg:w-[1024px] overflow-x-auto thin_scrollbar px-2 py-2">

                          {
                            classified_data.past.map((v, i) => {
                              const status = getStatus(v.startDate, v.endDate);

                              return (
                                <div className="bg-white shadow-md border-2 border-gray-300 rounded-2xl py-4 sm:py-5 pl-6  hover:shadow-lg transition-all duration-200 min-w-[260px] sm:min-w-[280px] custom-lg:min-w-[320px] flex-shrink-0">
                                  {/* Quiz title */}
                                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                    <span>Quiz ID :</span> {v.quiz_id || "Untitled Quiz"}
                                  </h3>

                                  {/* Status */}
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}
                                  >
                                    {status.icon}
                                    {status.label}
                                  </span>

                                  {/* Info */}
                                  <div className="mt-4 space-y-2 text-gray-600 text-sm">
                                    <div className="flex items-center">
                                      <FaCalendarAlt className="text-indigo-500 mr-2" />
                                      <span>
                                        <strong>Start : </strong> {formatDateTime(v.startDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <FaClock className="text-purple-500 mr-2" />
                                      <span>
                                        <strong>End : </strong> {formatDateTime(v.endDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <FaRegHourglassHalf className="text-orange-500 mr-2" />
                                      <span>
                                        <strong>Duration : </strong> {getDuration(v.startDate, v.endDate)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action */}
                                  <div className="mt-5 group">
                                    <Link
                                      to={`/dashboard/organizer-pannel/${v?._id}`}
                                      state={{ hostId: v._id }}
                                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
                                    >
                                      <MdPlayCircle />
                                      View Details
                                    </Link>

                                    {/* Hover Accent Line */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500"></div>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    )
                  }
                </div>

              </div>
            )}
          </div>
        )
      }
    </section>
  );
};

export default OrganizerPannel;
