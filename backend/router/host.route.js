import express from 'express'
import auth from '../middleware/auth.js'
import { createQuizController, fetchHostPlusQuizDetails, saveChangesHostDetailsByHost } from '../controller/host.controller.js'

const hostRouter = express()

hostRouter.post("/create-quiz", auth, createQuizController)
hostRouter.post("/get-host-details",auth,fetchHostPlusQuizDetails)
hostRouter.post("/saved-changes",auth,saveChangesHostDetailsByHost)

export default hostRouter