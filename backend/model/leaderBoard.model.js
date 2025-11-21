import mongoose from "mongoose";

const leaderBoardSchema = new mongoose.Schema({
    quizId: {
        type: String,
        default: "",
    },
    boardType : {
        type : String,
        enum : ["Daily","Normal"],
        default : "Normal"
    },
    top_users: [
        {
            userId: {
                type: {
                    Id: {
                        type: mongoose.Schema.ObjectId,
                        ref: "user",
                        required : true
                    },
                    userId: {
                        type: String,
                        default: ""
                    },
                    userName: {
                        type: String,
                        default: ""
                    }
                },
                required: true
            },
            marks: {
                type: Number,
                default: 0
            },
            timeTaken: {
                type: Number,
                default: 0,
            },
            accuracy: {
                type: Number,
                default: 0
            },
            negativeMarks: {
                type: Number,
                default: 0
            },
            submittedAt: {
                type: Date,
                default: null
            }
        }
    ],
},
    { timestamps: true }
)

const leaderBoardModel = mongoose.model("leaderboard", leaderBoardSchema)
export default leaderBoardModel