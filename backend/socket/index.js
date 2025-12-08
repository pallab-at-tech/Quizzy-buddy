import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { customAlphabet } from "nanoid"
import dotenv from 'dotenv'
dotenv.config()

import { questionModel, quizHostModel } from '../model/host_quiz.model.js'
import userModel from '../model/user.model.js'
import checkIsCorrect from '../utils/checkCorrect.js'
import { leaderboardMake } from '../controller/leaderboard.controller.js'
import battleModel from '../model/battle.model.js'
import QuestionGenerate_1V1 from '../utils/OneVOneApiSet.js'

const app = express()
const server = createServer(app)

const io = new Server(server, {
    cors: {
        credentials: true,
        origin: process.env.FRONTENT_URL
    }
})

const alphaCollection = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 12)

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

// Store the online users
const onlineUser = new Map()

// Store timers per room for 1v1 battle , so we can clear later
const battleIntervals = new Map();

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
            payload.get_total_marks = get_total_marks - ((payload.total_solved - payload.total_correct) * Math.abs(host.set_negetive_marks))

            // store data to model
            host.quiz_submission_data.push(payload)

            user.participant_info.push({
                quiz_id: host._id,
                quiz_nano_id: host.nano_id,
                participated_at: new Date(),
                score: null,
            })

            user.participate_count += 1

            const leaderBoard_payload = {
                quizId: host._id,
                user: {
                    userId: {
                        Id: user._id,
                        userId: user.nanoId,
                        userName: user.name
                    },
                    marks: payload.get_total_marks,
                    timeTaken: total_time,
                    accuracy: ((payload.total_correct / payload.total_solved) * 100).toFixed(4),
                    submittedAt: new Date(),
                    negativeMarks: ((payload.total_solved - payload.total_correct) * Math.abs(host.set_negetive_marks))
                }
            }

            await leaderboardMake(leaderBoard_payload, host._id, host.quiz_submission_data.length <= 1)

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

            if (!hostId) {
                return socket.emit("added_error", {
                    message: "Host Id required!"
                })
            }

            const user = await userModel.findById(userId).select("nanoId name")

            const host = await quizHostModel.findById(hostId)

            if (!user) {
                return socket.emit("added_error", {
                    message: "User not found!"
                })
            }

            if (!host) {
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
                startDate: now
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
            endDate: now
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

    // Create room for 1V1 battle

    const filterQuestion = (question) => {
        if (!question) return []

        return question.filter((q) => {
            console.log("qqq", q)
            if (!q.question || !q.marks || !q.options) return false;
            if (q.correct_answer === undefined || q.correct_answer === null) return false;
            if (!Array.isArray(q.options) || q.options.length < 2) return false;
            return true;
        });
    }

    socket.on("create_room1V1", async (data) => {
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
            const { user_nanoId, userName, topic, difficulty } = data || {}

            if (!user_nanoId) {
                return socket.emit("battleError", {
                    message: "User nano-Id not found!"
                })
            }

            if (!userName) {
                return socket.emit("battleError", {
                    message: "User name required!"
                })
            }

            if (!topic) {
                return socket.emit("battleError", {
                    message: "Topic required!"
                })
            }

            if (!difficulty) {
                return socket.emit("battleError", {
                    message: "Difficulty required!"
                })
            }

            // Check already user in a active room
            const existingBattle = await battleModel.findOne({
                "players.userId": userId,
                status: { $in: ["waiting", "active"] }
            })

            if (existingBattle) {
                return socket.emit("battleError", {
                    message: "You already created/are in a room.",
                    roomId: existingBattle.roomId
                })
            }

            const roomId = alphaCollection()

            const questions = await QuestionGenerate_1V1(topic, difficulty)

            const q = filterQuestion(questions?.questions) || []

            if (q.length === 0) {
                return socket.emit("battleError", {
                    message: "Some error occured! try later!"
                })
            }

            const newBattle = await battleModel.create({
                roomId: roomId,
                players: [
                    {
                        userId: userId,
                        user_nanoId: user_nanoId,
                        userName: userName,
                        score: 0,
                        answer: [],
                        admin: true,
                    }
                ],
                questions: q,
                status: "waiting",
                topic: topic
            })

            // Join in socket room
            socket.join(roomId)

            socket.emit("room_created", {
                message: "Battle room created",
                roomId: roomId,
                battleId: newBattle._id,
                topic: topic,
                player: [
                    {
                        userId: userId,
                        user_nanoId: user_nanoId,
                        userName: userName,
                        admin: true,
                    }
                ]
            })

        } catch (error) {
            console.log("Create room error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
            return socket.emit("battleError", {
                message: "Limit exceed , try later!"
            })
        }
    })

    // Join room for 1V1 battle
    socket.on("Join_room1v1", async (data) => {
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
            const { roomId, user_nanoId, userName } = data || {}

            if (!roomId) {
                return socket.emit("Battle_joinErr", {
                    message: "roomId required"
                })
            }

            if (!user_nanoId) {
                return socket.emit("Battle_joinErr", {
                    message: "User Id required!"
                })
            }

            const battle = await battleModel.findOne({
                roomId: roomId
            })

            if (!battle) {
                return socket.emit("Battle_joinErr", {
                    message: "Room doesn't exist"
                })
            }

            if (battle.players.length === 2) {
                return socket.emit("Battle_joinErr", {
                    message: "This room already has 2 players!"
                })
            }

            if (battle.players[0].userId.toString() === userId.toString()) {
                return socket.emit("Battle_joinErr", {
                    message: "You already inside this room."
                })
            }

            const player1 = battle.players[0].userId

            battle.players.push({
                userId: userId,
                user_nanoId: user_nanoId,
                score: 0,
                answer: [],
                admin: false,
                userName: userName
            })

            battle.status = "active"
            await battle.save()

            socket.join(roomId)

            console.log("room is created", socket.rooms.has(roomId))

            const player_payload = []

            battle.players.forEach((p) => {
                player_payload.push({
                    userId: p.userId,
                    user_nanoId: p.user_nanoId,
                    userName: p.userName,
                    admin: p.admin
                })
            })

            io.to(player1.toString()).emit("battle_ready_adT", {
                message: `${user_nanoId} Joined in Battle.`,
                roomId: roomId,
                battleId: battle._id,
                topic: battle.topic,
                player: player_payload
            })

            io.to(userId.toString()).emit("battle_ready_adF", {
                message: `You Joined in Battle.`,
                roomId: roomId,
                battleId: battle._id,
                topic: battle.topic,
                player: player_payload
            })

        } catch (error) {
            console.log("Join room error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    // reconnect the room
    socket.on("reConnect-room", async (data) => {
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

            const { roomId } = data || {}

            const battle = await battleModel.findOne({roomId : roomId})

            if(!battle){
                return
            }

            socket.join(roomId)
            console.log("Rejoined after refresh:", socket.id, roomId);

            socket.emit("reconnected_success",{
                message : "Successfully reconnected",
                roomId
            })

        } catch (error) {
            console.log("Join room error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    // left from the room
    socket.on("battle_left1v1", async (data) => {
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

            const { roomId, user_nano } = data || {}

            if (!roomId) {
                return socket.emit("battle_leftError", {
                    message: "RoomId required!"
                })
            }

            if (!user_nano) {
                return socket.emit("battle_leftError", {
                    message: "User nanoId required!"
                })
            }

            const room = await battleModel.findOne({ roomId: roomId })

            if (!room) {
                return socket.emit("battle_leftError", {
                    message: "Room doesn't exist!"
                })
            }

            if (room.players.length <= 1) {
                await battleModel.deleteOne({ roomId: roomId })

                // socket.leave(roomId)

                io.to(userId).emit("i_left", {
                    message: "You left the room"
                })
            }
            else {
                room.players = room.players.filter((u) => u.userId.toString() !== userId.toString())
                if (room.players.length >= 1) {
                    room.players[0].admin = true
                }
                room.status = "waiting"

                await room.save()

                io.to(userId).emit("i_left", {
                    message: "You left the room"
                })

                io.to(room.players[0].userId.toString()).emit("u_left", {
                    message: `${user_nano} left the room`,
                    data: {
                        roomId: roomId,
                        battleId: room._id,
                        topic: room.topic,
                        player: [
                            {
                                userId: room.players[0].userId,
                                user_nanoId: room.players[0].user_nanoId,
                                userName: room.players[0].userName,
                                admin: room.players[0].admin
                            }
                        ]
                    }
                })
            }

        } catch (error) {
            console.log("Left room error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })

    async function startBattleQuestion(roomId, battle) {

        let index = 0
        const questions = battle.questions

        const scoreMap = {};
        for (const player of battle.players) {
            scoreMap[player.userId] = { score: 0 };
        }

        socket.on("client-score", (data) => {
            const { myUserId, userAnswer, index } = data || {}

            if (userAnswer && index && questions.length > index && userAnswer === questions[index]?.correct_option) {
                scoreMap[myUserId].score += 5
            }

            io.to(roomId).emit("score-update", {
                scoreMap
            })
        })

        const questionInterval = setInterval(async () => {

            if (questions.length <= index) {
                clearInterval(questionInterval)
                battleIntervals.delete(roomId)
                battle.status = "finished"
                await battle.save()

                io.to(roomId).emit("battle_over", {
                    message: "Battle finished",
                    roomId: roomId,
                    score: scoreMap
                });
                return
            }

            io.to(roomId).emit("new_question", {
                index: index,
                question: questions[index]
            })

            index++
        }, 10000)

        battleIntervals.set(roomId, {
            questionInterval: questionInterval,
            scores: scoreMap
        })
    }

    // start the battle
    socket.on("battle_start1v1", async (data) => {
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

            const { roomId } = data || {}

            if (!roomId) {
                return socket.emit("battle_startErr", {
                    message: "RoomId required!"
                })
            }

            const battle = await battleModel.findOne({ roomId: roomId })
            if (!battle) {
                return socket.emit("battle_startErr", {
                    message: "Battle room not found!"
                })
            }

            if (battleIntervals.has(roomId)) {
                return socket.emit("battle_startErr", {
                    message: "Battle already started!"
                })
            }

            const isAdmin = battle.players.find((m) => m.userId.toString() === userId.toString())
            if (!isAdmin.admin) {
                return socket.emit("battle_startErr", {
                    message: "Access denied!"
                })
            }

            io.to(roomId).emit("battle_start", {
                message: "Battle about to start!",
                roomId: roomId
            })

            let countdown = 10

            const countDownInterval = setInterval(() => {
                io.to(roomId).emit("battle_countdown", {
                    secound_left: countdown
                })

                if (countdown === 0) {
                    clearInterval(countDownInterval)

                    io.to(roomId).emit("battle_started", {
                        message: "Battle started!",
                        roomId: roomId
                    })

                    // startBattleQuestion(roomId, battle, userId)
                }
                countdown--;
            }, 1000)

        } catch (error) {
            console.log("Battle start error", error)
            socket.emit("error_500", {
                message: "Unknown error occured , try later!"
            })
        }
    })


    socket.on("battle_end1v1", async (data) => {
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
            const { roomId } = data || {}

            const battle = await battleModel.findById(roomId)

            if (!battle) return

            const isOneSubmit = battle.players[0].submit || battle.players[1].submit

            if (isOneSubmit) {
                await battleModel.deleteOne(roomId)
            }
            else {
                const player = battle.players.find((c) => c.userId.toString() === userId.toString())
                player.submit = true

                await battleModel.save()
            }

        } catch (error) {
            console.log("Battle end error", error)
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