import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const server = createServer(app)

const io = new Server(server , {
    cors : {
        credentials : true,
        origin : process.env.FRONTENT_URL
    }
})

io.on('connection' , (server) =>{
    console.log("user connected" , server)
})




export {app , server} 