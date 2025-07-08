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
    curr_participant_info: {
        type: Array,
        default: []
    },
    old_participant_info: {
        type: Array,
        default: []
    },
    participate_count: {
        type: Number,
        default: 0
    },
    host_count: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema);
export default userModel