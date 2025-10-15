import express from 'express'
import auth from '../middleware/auth.js'
import { createQuizController } from '../controller/host.controller.js'

const hostRouter = express()

hostRouter.post("/create-quiz", auth, createQuizController)

export default hostRouter