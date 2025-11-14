import mongoose from "mongoose";

const DailyQuizSchema = new mongoose.Schema({
    topic: {
        type: String,
        default: ""
    },
    question_details: [
        {
            question : {
                type : String,
                default : ""
            },
            marks : {
                type :Number,
                default : 2
            },
            options : {
                type : Array,
                default : []
            },
            correct_answer : {
                type : String,
                default : ""
            }
        }
    ],
    start: {
        type: Date,
        default: null
    },
    end: {
        type: Date,
        default: null
    },
    total_marks : {
        type : Number,
        default : 0
    },
    negative_marks : {
        type : Number,
        default : 0
    },
},
    {
        timestamps: true
    }
)

const DailyQuizModel = mongoose.model("daily",DailyQuizSchema)
export default DailyQuizModel