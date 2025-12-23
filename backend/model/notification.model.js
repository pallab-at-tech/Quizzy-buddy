import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipent: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    notification_type: {
        type: String,
        enum: [
            "submit quiz",
            "score realised",
            "Quiz ended",
            "Achieve Badge"
        ],
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    isRead: {
        type: Boolean,
        default: false
    },
    navigation_link: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
)

const notificationModel = mongoose.model("notification", notificationSchema)
export default notificationModel