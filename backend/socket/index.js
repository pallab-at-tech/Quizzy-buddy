import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

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