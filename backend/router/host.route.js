import express from 'express'
import auth from '../middleware/auth.js'
import { createQuizController, fetchHostPlusQuizDetails, hostOtherDetails, hostTimeUpdate, saveChangesHostDetailsByHost } from '../controller/host.controller.js'

const hostRouter = express()

hostRouter.post("/create-quiz", auth, createQuizController)
hostRouter.post("/get-host-details", auth, fetchHostPlusQuizDetails)
hostRouter.post("/saved-changes", auth, saveChangesHostDetailsByHost)
hostRouter.post("/host-update", auth, hostOtherDetails)
hostRouter.post("/host-time-update", auth, hostTimeUpdate)

export default hostRouter