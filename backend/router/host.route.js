import express from 'express'
import auth from '../middleware/auth.js'
import { createQuizController, fetchHostPlusQuizDetails } from '../controller/host.controller.js'

const hostRouter = express()

hostRouter.post("/create-quiz", auth, createQuizController)
hostRouter.post("/get-host-details",auth,fetchHostPlusQuizDetails)

export default hostRouter