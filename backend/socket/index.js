import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { questionModel, quizHostModel } from '../model/host_quiz.model.js'
import userModel from '../model/user.model.js'
import checkIsCorrect from '../utils/checkCorrect.js'

const app = express()
const server = createServer(app)

const io = new Server(server, {
    cors: {
        credentials: true,
        origin: process.env.FRONTENT_URL
    }
})

io.use((socket, next) => {
    const token = socket.handshake.auth?.token

    if (!token) {
        return next(new Error("Not authenticated"))
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        socket.userId = payload.id
        next()
    } catch (error) {
        return next(new Error("Not authenticated"));
    }
})

const onlineUser = new Map()

io.on('connection', (socket) => {

    // join in a socket room
    socket.on("join_room", (userId) => {

        socket.join(userId.toString())
        onlineUser.set(socket.id, userId.toString())

        io.emit("online_user", Array.from(new Set(onlineUser.values())))
        console.log("User connected:", `${socket.id} -- ${userId}`);
    })

    socket.on("joined_quiz", async (data) => {
        try {
            const { joined_code, name } = data || {}

            const token = socket.handshake.auth?.token;
            if (!token) {
                return socket.emit("session_expired", { message: "No token found. Please login again." });
            }

            let payload1;
            try {
                payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } catch (err) {
                return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
            }

            const userId = payload1.id;

            if (!joined_code) {
                return socket.emit("joinedQuiz_error", {
                    message: "Joined code not found!"
                })
            }

            const host = await quizHostModel.findOne({ provide_join_code: joined_code })

            if (!host) {
                return socket.emit("joinedQuiz_error", {
                    message: "Joined code not exist!"
                })
            }

            if (userId.toString() === host.host_user_id.toString()) {
                return socket.emit("joinedQuiz_error", {
                    message: "Host can't participate in the quiz!"
                })
            }

            io.to(userId.toString()).emit("joinedQuiz_success", {
                message: "Successfully joined Quiz",
                hostId: host._id
            })

            io.to(host.host_user_id.toString()).emit("joinedQuiz_success", {
                message: `${name} joined`,
                hostId: host._id
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    socket.on("submit_quiz", async (data) => {
        try {
            const { hostId, submitData = [], total_time } = data || {}

            const token = socket.handshake.auth?.token;
            if (!token) {
                return socket.emit("session_expired", { message: "No token found. Please login again." });
            }

            let payload1;
            try {
                payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } catch (err) {
                return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
            }

            const userId = payload1.id;

            // basic input validation
            if (!hostId) {
                return socket.emit("submit_error", {
                    message: "Host Id required!"
                })
            }

            if (!total_time) {
                return socket.emit("submit_error", {
                    message: "Total time missing!"
                })
            }

            // fetch quiz model
            const host = await quizHostModel.findById(hostId)

            if (!host) {
                return socket.emit("submit_error", {
                    message: "Host Id required!"
                })
            }

            if (host.host_user_id.toString() === userId.toString()) {
                return socket.emit("submit_error", {
                    message: "Host can't submit quiz!"
                })
            }

            // check , is time exceed or not
            if (new Date() > new Date(host.quiz_end)) {
                return socket.emit("submit_error", {
                    message: "Submission deadline expired!"
                })
            }

            // check is user already submitted
            const isAlreadySubmitted = host.quiz_submission_data.some((u) => u && userId.toString() === u.userDetails.Id.toString())

            if (isAlreadySubmitted) {
                return socket.emit("submit_error", {
                    message: "You already submitted quiz!"
                })
            }

            // fetch user info
            const user = await userModel.findById(userId).select("_id nanoId name participant_info participate_count")

            if (!user) {
                return socket.emit("submit_error", {
                    message: "User not found!"
                })
            }

            const payload = {
                userDetails: {
                    Id: user._id.toString(),
                    userId: user.nanoId,
                    userName: user.name
                },
                total_solved: 0,
                total_correct: 0,
                total_question: host.quiz_data.length,
                get_total_marks: 0,
                total_time: total_time,
                correctedData: []
            }

            let total_solved = 0, total_correct = 0, get_total_marks = 0

            // analyse and correct data
            for (const v of submitData) {

                if (!v) continue
                const question = await questionModel.findById(v?.q_id)

                if (!question) continue

                const ans = {
                    questionId: question._id,
                    userAnswer: String(v.userAnswer ?? "").trim() || "",
                    correctAnswer: String(question.correct_option || "").trim() || "",
                    isCorrect: false,
                    marks: 0
                }

                if (question.inputBox) {

                    if (String(ans.userAnswer || "").trim()) {
                        const gemini = await checkIsCorrect(question.question, ans.userAnswer)
                        if (gemini) {
                            if (gemini.isCorrect === "Y") {
                                ans.isCorrect = true
                                ans.marks = question.marks


                                total_correct += 1
                                get_total_marks += question.marks
                            }
                            ans.correctAnswer = gemini?.reason || "No reason provided"
                            total_solved += 1
                        }
                        else {
                            ans.correctAnswer = "Err"
                        }
                    }
                }
                else {
                    if (String(ans.userAnswer || "").trim() && ans.correctAnswer.toString() === ans.userAnswer.toString()) {
                        ans.isCorrect = true
                        ans.marks = question.marks

                        total_correct += 1
                        get_total_marks += question.marks
                    }

                    if (String(ans.userAnswer || "").trim()) total_solved += 1
                }

                payload.correctedData.push(ans)
            }

            // calculated result
            payload.total_solved = total_solved
            payload.total_correct = total_correct
            payload.get_total_marks = get_total_marks - ((payload.total_question - payload.total_correct) * Math.abs(host.set_negetive_marks))

            // store data to model
            host.quiz_submission_data.push(payload)

            user.participant_info.push({
                quiz_id: host._id,
                quiz_nano_id: host.nano_id,
                participated_at: new Date(),
                score: null,
            })

            user.participate_count += 1

            await Promise.all([user.save(), host.save()])

            // send message and data to host
            io.to(host.host_user_id.toString()).emit("host_submitted", {
                message: `${user.name} Submit Quiz`,
                data: payload,
                hostId: host._id
            })

            // send message or data to user
            io.to(userId.toString()).emit("user_submitted", {
                message: "Quiz successfully submitted.",
                data: {
                    quiz_id: host._id,
                    quiz_nano_id: host.nano_id,
                    participated_at: new Date(),
                    score: null
                },
                participate_count: user.participate_count
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    socket.on("add_userId", async (data) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return socket.emit("session_expired", { message: "No token found. Please login again." });
            }

            let payload1;
            try {
                payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } catch (err) {
                return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
            }

            const userId = payload1.id;

            const { hostId } = data || {}

            if(!hostId){
                return socket.emit("added_error", {
                    message: "Host Id required!"
                })
            }

            const user = await userModel.findById(userId).select("nanoId name")

            const host = await quizHostModel.findById(hostId)

            if(!user){
                return socket.emit("added_error", {
                    message: "User not found!"
                })
            }

            if(!host){
                return socket.emit("added_error", {
                    message: "Quiz not found!"
                })
            }

            const isAlreadyAdded = host.user_ids.some((m) => m.user_nanoId.toString() === user.nanoId.toString())

            if (isAlreadyAdded) {
                return socket.emit("added_error", {
                    message: "Details already added"
                })
            }

            const now = new Date()

            host.user_ids.push({
                user_nanoId: user.nanoId,
                user_name: user.name,
                joinedAt: now
            })

            await host.save()

            io.to(host.host_user_id.toString()).emit("added_userId", {
                message: "Data added",
                data: {
                    user_nanoId: user.nanoId,
                    user_name: user.name,
                    joinedAt: now
                },
                hostId: hostId
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    socket.on("remove_userId", async (data) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return socket.emit("session_expired", { message: "No token found. Please login again." });
            }

            let payload1;
            try {
                payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } catch (err) {
                return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
            }

            const userId = payload1.id;

            const { hostId } = data || {}

            const user = await userModel.findById(userId).select("nanoId name")

            const host = await quizHostModel.findByIdAndUpdate(hostId, {
                $pull: {
                    user_ids: {
                        user_nanoId: user.nanoId
                    }
                }
            })

            io.to(host.host_user_id.toString()).emit("removed_userId", {
                message: "Data removed",
                data: {
                    user_nanoId: user.nanoId,
                    user_name: user.name
                },
                hostId: hostId
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    socket.on("delete_quiz", async (data) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return socket.emit("session_expired", { message: "No token found. Please login again." });
            }

            let payload1;
            try {
                payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } catch (err) {
                return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
            }

            const userId = payload1.id;

            const { hostId } = data || {}

            if (!hostId) {
                return socket.emit("delete_QuizErr", {
                    message: "Quiz not found!"
                })
            }

            const host = await quizHostModel.findById(hostId)

            if (!host) {
                return socket.emit("delete_QuizErr", {
                    message: "Quiz not found!"
                })
            }

            if (host.host_user_id.toString() !== userId.toString()) {
                return socket.emit("delete_QuizErr", {
                    message: "Access denied!"
                })
            }

            const now = new Date()

            if (new Date(host.quiz_end) > now && now > new Date(host.quiz_start)) {
                return socket.emit("delete_QuizErr", {
                    message: "Ongoing Quiz can't be deleted!"
                })
            }

            const user = await userModel.findById(userId)

            if (!user) {
                return socket.emit("delete_QuizErr", {
                    message: "User not found!"
                })
            }

            user.host_info = user.host_info.filter((h) => h._id.toString() !== hostId.toString())

            await quizHostModel.findByIdAndDelete(hostId)
            await user.save()

            return socket.emit("deleted_quizz", {
                message: "Quiz deleted successfully",
                hostId: hostId
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    socket.on("instant_startQuiz", async (data) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return socket.emit("session_expired", { message: "No token found. Please login again." });
            }

            let payload1;
            try {
                payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } catch (err) {
                return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
            }

            const userId = payload1.id;

            const { hostId } = data || {}

            if (!hostId) {
                return socket.emit("instant_startErr", {
                    message: "Host Id not found!"
                })
            }

            const host = await quizHostModel.findById(hostId)

            if (!host) {
                return socket.emit("instant_startErr", {
                    message: "Quiz not found!"
                })
            }

            if (host.host_user_id.toString() !== userId.toString()) {
                return socket.emit("instant_startErr", {
                    message: "Access denied!"
                })
            }

            const now = new Date()

            if (new Date(host.quiz_end) > now && now > new Date(host.quiz_start)) {
                return socket.emit("instant_startErr", {
                    message: "Quiz has been already started!"
                })
            }

            if (new Date(host.quiz_end) < now) {
                return socket.emit("instant_startErr", {
                    message: "Quiz already expired!"
                })
            }

            const user = await userModel.findById(userId)

            if (!user) {
                return socket.emit("instant_startErr", {
                    message: "User not found!"
                })
            }

            const findVal = user.host_info.find((h) => h._id.toString() === hostId.toString())
            findVal.startDate = now

            host.quiz_start = now

            await Promise.all([user.save(), host.save()])

            socket.emit("instant_started", {
                message: "Quiz started now",
                hostId: hostId,
                startDate : now
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    socket.on("instant_endQuiz", async (data) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return socket.emit("session_expired", { message: "No token found. Please login again." });
        }

        let payload1;
        try {
            payload1 = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        } catch (err) {
            return socket.emit("session_expired", { message: "Your session has expired. Please log in again." });
        }

        const userId = payload1.id;

        const { hostId } = data || {}

        if (!hostId) {
            return socket.emit("instant_endErr", {
                message: "Host Id required!"
            })
        }

        const host = await quizHostModel.findById(hostId)

        if (!host) {
            return socket.emit("instant_endErr", {
                message: "Quiz not found!"
            })
        }

        // check is host user or not
        if (host.host_user_id.toString() !== userId.toString()) {
            return socket.emit("instant_endErr", {
                message: "Access denied!"
            })
        }

        const now = new Date()

        // basic validation check
        if (new Date(host.quiz_start) > now) {
            return socket.emit("instant_endErr", {
                message: "Quiz not start yet!"
            })
        }

        if (new Date(host.quiz_end) < now) {
            return socket.emit("instant_endErr", {
                message: "Quiz already have ended!"
            })
        }

        // fetch host user details
        const user = await userModel.findById(userId)

        if (!user) {
            return socket.emit("instant_endErr", {
                message: "User not found!"
            })
        }

        // update host user's host info
        const targetVal = user.host_info.find((h) => h._id.toString() === hostId.toString())
        if (!targetVal) {
            return socket.emit("instant_endErr", {
                message: "Some error occured!"
            })
        }

        targetVal.endDate = now

        // update quiz model details
        host.quiz_end = now

        // store user id's before update , so later send notification
        const curr_participants = host.user_ids || []
        host.user_ids = []

        await Promise.all([user.save(), host.save()])

        // send message to host
        io.to(userId.toString()).emit("instand_endedHost", {
            message: "Quiz now ended!",
            hostId: hostId,
            endDate : now
        })

        // find user _id for current particiapnts
        const curr_nano = curr_participants.map(v => v.user_nanoId)
        const curr_users = await userModel.find({ nanoId: { $in: curr_nano } }).select("_id")

        await Promise.all(
            curr_users.map(u =>
                io.to(u._id.toString()).emit("instant_endedUser", {
                    message: "Quiz ended by hoster",
                    hostId
                })
            )
        );
    })

    // disconnect user
    socket.on("disconnect", () => {

        const userId = onlineUser.get(socket.id)

        if (userId) {
            onlineUser.delete(socket.id)
            io.emit("online_user", Array.from(new Set(onlineUser.values())))
        }

        console.log("User Disconnected:", `${socket.id} -- ${userId}`);
    })
})




export { app, server } 