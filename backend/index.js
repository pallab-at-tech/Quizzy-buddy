import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import { app, server } from "./socket/index.js"
import connectDB from './config/connectDB.js'
import userRouter from './router/user.route.js'


app.use(cors({
    credentials: true,
    origin: process.env.FRONTENT_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))




app.get("/", (req, res) => {
    return res.json({
        message: "hey , there i am about to start..."
    })
})

// api end point

app.use("/api", userRouter)


const PORT = 8080 || process.env.PORT

connectDB().then(() => {

    server.listen(PORT, () => {
        console.log(`Server starting at http://localhost:${PORT}`)
    })

})

