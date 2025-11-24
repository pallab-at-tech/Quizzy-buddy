import mongoose from "mongoose"

const badgeSchema = new mongoose.Schema({
    Streak1Week : {
        type : Boolean,
        default : false
    },
    Streak1Month : {
        type : Boolean,
        default : false
    },
    Streak3Month : {
        type : Boolean,
        default : false
    },
    Streak6Month : {
        type : Boolean,
        default : false
    },
    Streak1Year : {
        type : Boolean,
        default : false
    },
    Host5 : {
        type : Boolean,
        default : false
    },
    Host20 : {
        type : Boolean,
        default : false
    },
    Host50 : {
        type : Boolean,
        default : false
    },
    Host200 : {
        type : Boolean,
        default : false
    },
    Top1 : {
        type : Boolean,
        default : false
    },
    Top5 : {
        type : Boolean,
        default : false
    },
    Top10 : {
        type : Boolean,
        default : false
    },
    Top10x5 : {
        type : Boolean,
        default : false
    },
    Top5x5 : {
        type : Boolean,
        default : false
    },
    Top1x5 : {
        type : Boolean,
        default : false
    },
    Top10x20 : {
        type : Boolean,
        default : false
    },
    Top5x20 : {
        type : Boolean,
        default : false
    },
    Top1x20 : {
        type : Boolean,
        default : false
    },
    top_count : {
        top1Count : {
            type : Number,
            default : 0
        },
        top5Count : {
            type : Number,
            default : 0
        },
        top10Count : {
            type : Number,
            default : 0
        }
    }
})

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
            },
            best_strick : {
                type : Number,
                default : 0
            },
            last_week_stats : [
                {
                    date : {
                        type : Date,
                        default : null
                    },
                    score : {
                        type : Number,
                        default : 0
                    },
                    accuracy : {
                        type : Number,
                        default : 0
                    }   
                }
            ]
        },
        default : {
            strict_count : 0,
            last_date : null,
            best_strick : 0,
            last_week_stats : []
        }
    },
    badge_collection : {
        type : badgeSchema,
        default : {}
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema);
export default userModel