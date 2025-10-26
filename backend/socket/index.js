import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { quizHostModel } from '../model/host_quiz.model.js'

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

    socket.on("joined_member", async (data) => {
        try {
            const {} = data || {}

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