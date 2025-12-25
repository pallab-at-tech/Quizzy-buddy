import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SumarryApi";

const LeaderBoardComponent = () => {

    const [data, setData] = useState([])

    const fetchTop2Player = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.daily_top2
            })

            const { data: responseData } = response

            if (responseData?.success) {
                setData(responseData?.players || [])
            }
            else {
                setData([])
            }
        } catch (error) {
            setData([])
            console.log("fetchTop2Player error", error)
        }
    }

    useEffect(() => {
        fetchTop2Player()
    }, [])

    return (
        <div className="mt-6 rounded-xl bg-gradient-to-b from-[#ffffff] to-[#f0f0f3] p-4 shadow-md border-2 border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                🏆 Today’s Top Players
            </h2>

            <div className="space-y-2">
                {data.map((player, index) => (
                    <div
                        key={player?._id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 border border-gray-300 sm:px-5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">
                                {index === 0 ? "🥇" : "🥈"}
                            </span>

                            <div>
                                <p className="font-medium text-gray-900">
                                    {player?.userId?.userName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Score: {player?.marks || 0}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm flex items-center gap-2">
                            <p className="text-sm font-semibold">acc :</p>
                            <p className="block">{player?.accuracy}</p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-3 text-xs text-gray-900 text-center animate-pulse">
                Rankings update live ⚡
            </p>
        </div>
    );
};

export default LeaderBoardComponent;
