import mongoose from "mongoose";

const battleQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        default: ""
    },
    marks: {
        type: Number,
        default: 0
    },
    options: {
        type: Array,
        default: []
    },
    correct_option: {
        type: String,
        default: ""
    }
})

const playerAnswerSchema = new mongoose.Schema({
    questionId: { type: String, default: "" },
    selectedOption: { type: Number, default: -1 },
    isCorrect: { type: Boolean, default: false },
    timeTaken: { type: Number, default: 0 }
}, {
    _id : false
});

const battleSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    players: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            user_nanoId: {
                type: String,
                default: ""
            },
            userName : {
                type : String,
                default : ""
            },
            score: {
                type: Number,
                default: 0
            },
            answer: {
                type: [playerAnswerSchema],
                default: []
            },
            admin : {
                type : Boolean,
                default : false
            },
            submit : {
                type : Boolean,
                default : false
            }
        }
    ],
    status: {
        type: String,
        enum: ["waiting", "active", "finished"],
        default: "waiting"
    },
    questions: [
        battleQuestionSchema
    ],
    topic : {
        type : String,
        default : ""
    }
})

const battleModel = mongoose.model("battle", battleSchema)
export default battleModel