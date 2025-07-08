import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
    host_nano_id : {
        type : String,
        default : ""
    },
    provide_join_code : {
        type : String,
        default : ""
    },
    user_id : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "user"
        }
    ],
    quiz_data : {
        type : Object,
        default : {}
    },
    quiz_time : {
        type : Date,
        default : null
    },
    quiz_submission_data : {
        type : Array,
        default : []
    }

},{
    timestamps : true
})

const quizHostModel = new mongoose.model("host" , hostSchema)
export default quizHostModel