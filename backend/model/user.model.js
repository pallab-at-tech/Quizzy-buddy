import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "provided name"]
    },
    email: {
        type: String,
        required: [true, "provided email"],
        unique: true
    },
    nanoId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "provided password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    refresh_token: {
        type: String,
        default: ""
    },
    forgot_Password_otp: {
        type: String,
        default: ""
    },
    forgot_Password_expiry: {
        type: Date,
        default: null
    },
    participant_info: [
        {
            quiz_id: {
                type: mongoose.Schema.ObjectId,
                ref: "host"
            },
            quiz_nano_id : {
                type : String,
                default : ""
            },
            participated_at: {
                type: Date,
                required: true
            },
            score: {
                type: Number,
                default: null
            }
        }
    ],
    host_info: [
        {
            _id: {
                type: mongoose.Schema.ObjectId,
                ref: "host"
            },
            quiz_id : {
                type : String,
                default : ""
            },
            createdAt: {
                type: Date,
                default: null
            },
            endDate : {
                type : Date,
                default : null
            },
            startDate : {
                type : Date,
                default : null
            }
        }
    ],
    participate_count: {
        type: Number,
        default: 0
    },
    host_count: {
        type: Number,
        default: 0
    },
    daily_strict_count : {
        type : {
            strict_count : {
                type : Number,
                default : 0
            },
            last_date : {
                type : Date,
                default : null
            }
        },
        default : {
            strict_count : 0,
            last_date : null
        }
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema);
export default userModel