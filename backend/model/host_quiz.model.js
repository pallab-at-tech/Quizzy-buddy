import mongoose from "mongoose";

const submitData = new mongoose.Schema({
    userDetails: {
        type: {
            Id: {
                type : String,
                default : ""
            },
            userId : {
                type : String,
                default : ""
            },
            userName : {
                type : String,
                default : ""
            }
        },
        default : {
            Id : "",
            userId : "",
            userName : ""
        }
    },
    total_solved: {
        type: Number,
        default: 0
    },
    total_correct: {
        type: Number,
        default: 0
    },
    total_question: {
        type: Number,
        default: 0
    },
    get_total_marks: {
        type: Number,
        default: 0
    },
    total_time: {
        type: String,
        default: 0
    },
    correctedData: [
        {
            questionId: {
                type: mongoose.Schema.ObjectId,
                ref: "question"
            },
            userAnswer: {
                type: String,
                default: ""
            },
            correctAnswer: {
                type: String,
                default: ""
            },
            isCorrect: {
                type: Boolean,
                default: false
            },
            marks: {
                type: Number,
                default: 0
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
        type: Boolean,
        default: false
    },
    options: {
        type: Array,
        default: []
    },
    correct_option: {
        type: String,
        default: ""
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
    nano_id: {
        type: String,
        required: true
    },
    user_ids: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        }
    ],
    quiz_data: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "question"
        }
    ],
    quiz_start: {
        type: Date,
        required: true
    },
    quiz_end: {
        type: Date,
        required: true
    },
    strict: {
        type: {
            enabled: {
                type: Boolean,
                default: false
            },
            time: {
                type: Number,
                default: 0
            },
            unit: {
                type: String,
                enum: ["min", "sec"],
                default: 'sec'
            }
        },
        default: {
            enabled: false,
            time: 0,
            unit: "sec"
        }
    },
    total_marks: {
        type: Number,
        default: 0
    },
    set_negetive_marks: {
        type: Number,
        default: 0
    },
    quiz_submission_data: {
        type: [submitData],
        default: []
    }

}, {
    timestamps: true
})

const quizHostModel = mongoose.model("host", hostSchema)
const questionModel = mongoose.model("question", quizQuestionSchema)
const submitDataModel = mongoose.model("submit", submitData)

export {
    quizHostModel,
    questionModel,
    submitDataModel
}