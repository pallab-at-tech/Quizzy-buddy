import mongoose from "mongoose";

const leaderBoardSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.ObjectId,
        ref: "host", // optional — link to that day's quiz
        default: null,
    },
    date: {
        type: Date,
        required: true
    },
    top_users: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "user"
            },
            marks: {
                type: Number,
                default: 0
            },
            rank: {
                type: Number,
                default: Infinity
            },
            timeTaken: {
                type: Number, // optional: seconds or ms — for tie-breaking
                default: 0,
            },
        }
    ],
},
    { timestamps: true }
)

const leaderBoardModel = mongoose.model("leaderboard", leaderBoardSchema)
export default leaderBoardModel