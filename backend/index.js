import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import {app , server} from "./socket/index.js"


app.use(cors({
    credentials : true,
    origin : process.env.FRONTENT_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy : false
}))


// api end point



app.get("/" , (req , res) =>{
    return res.json({
        message : "hey , there i am about to start..."
    })
})


const PORT = 8080 || process.env.PORT

server.listen(PORT , ()=>{
    console.log(`Server starting at http://localhost:${PORT}`)
})