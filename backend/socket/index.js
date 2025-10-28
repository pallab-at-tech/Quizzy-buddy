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
                    userAnswer: v?.userAnswer || "",
                    correctAnswer: question.correct_option || "",
                    isCorrect: false,
                    marks: 0
                }

                if (question.inputBox) {

                    if (ans.userAnswer.trim()) {
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
                    if (ans.userAnswer.trim() && ans.correctAnswer.toString() === ans.userAnswer.toString()) {
                        ans.isCorrect = true
                        ans.marks = question.marks

                        total_correct += 1
                        get_total_marks += question.marks
                    }

                    if(ans.userAnswer) total_solved += 1
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
                score: null
            })

            user.participate_count += 1

            await Promise.all([user.save() , host.save()])

            // send message and data to host
            io.to(host.host_user_id.toString()).emit("host_submitted", {
                message: `${user.name} Submit Quiz`,
                data: payload
            })

            // send message or data to user
            io.to(userId.toString()).emit("user_submitted", {
                message: "Quiz successfully submitted.",
                data: {
                    quiz_id: host._id,
                    quiz_nano_id: host.nano_id,
                    participated_at: new Date(),
                    score: null
                }
            })

        } catch (error) {
            console.log("joined quiz error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
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