import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaIdBadge
} from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { MdPending, MdOutlineDoneAll, MdPlayCircle } from "react-icons/md";
import { useSelector } from "react-redux";

const OrganizerPannel = () => {

  const host_info = useSelector((state) => state.user).host_info || [];

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
    return `${Math.round(diff)} min`;
  };

  return (
    <section className="h-[calc(100vh-70px)] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8 scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-b-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-3 sm:mb-0">
            Organizer Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and monitor your hosted quizzes in real time
          </p>
        </header>

        {host_info.length === 0 ? (
          <p className="text-gray-500 text-center mt-24 text-lg">
            No hosted quizzes found. Start hosting to see them here 🎯
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {host_info.map((item) => {
              const status = getStatus(item.startDate, item.endDate);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <FaIdBadge className="opacity-90" />
                      <span>{item.quiz_id}</span>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium border ${status.color}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-indigo-500 mr-2" />
                      <span>
                        <strong>Start:</strong> {formatDateTime(item.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-green-500 mr-2" />
                      <span>
                        <strong>End:</strong> {formatDateTime(item.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaRegHourglassHalf className="text-orange-500 mr-2" />
                      <span>
                        <strong>Duration:</strong>{" "}
                        {getDuration(item.startDate, item.endDate)}
                      </span>
                    </div>

                    <p className="text-gray-500 text-xs border-t border-gray-200 pt-3">
                      Created on: {formatDateTime(item.createdAt)}
                    </p>
                  </div>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizerPannel;
