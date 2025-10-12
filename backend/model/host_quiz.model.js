import mongoose from "mongoose";

const submitData = new mongoose.Schema({
    solved: {
        type: Number,
        default: 0
    },
    correct: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    get_total_marks: {
        type: Number,
        default: 0
    },
    correctedData: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "question"
            },
            userAnswer: {
                type: String,
                default: ""
            },
            isCorrect: {
                type: Boolean,
                default: false
            }
        }
    ]
},
    {
        timestamps: true
    }
)

const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    marks: {
        type: Number,
        default: 5
    },
    inputBox: {
        type: String,
        default: ""
    },
    option: [
        {
            label: {
                type: String,
                default: ""
            },
            text: {
                type: String,
                default: ""
            }
        }
    ],
    correct_option: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

const hostSchema = new mongoose.Schema({
    host_user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    host_user_nanoId: {
        type: String,
        required: true
    },
    provide_join_code: {
        type: String,
        required: true
    },
    user_id: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        }
    ],
    quiz_data: {
        type: [quizQuestionSchema],
        default: []
    },
    quiz_start: {
        type: Date,
        required: true
    },
    quiz_expire_per_Q: {
        type: Date,
        default: null
    },
    total_marks: {
        type: Number,
        default: 0
    },
    set_negetive_marks: {
        type: Number,
        default: -1
    },
    quiz_submission_data: {
        type: [submitData],
        default: []
    }

}, {
    timestamps: true
})

const quizHostModel = new mongoose.model("host", hostSchema)
const questionModel = new mongoose.model("question", quizQuestionSchema)
const submitDataModel = new mongoose.model("submit", submitData)

export {
    quizHostModel,
    questionModel,
    submitDataModel
}