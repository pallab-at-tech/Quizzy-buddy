import express from 'express'
import auth from '../middleware/auth.js'
import { checkingUserCanAttendQuiz, createQuizController, fetchHostPlusQuizDetails, fetchParticipantsDetailsController, fetchQuestionDetails, hostOtherDetails, hostTimeUpdate, saveChangesHostDetailsByHost } from '../controller/host.controller.js'

const hostRouter = express()

hostRouter.post("/create-quiz", auth, createQuizController)
hostRouter.post("/get-host-details", auth, fetchHostPlusQuizDetails)
hostRouter.post("/saved-changes", auth, saveChangesHostDetailsByHost)
hostRouter.post("/host-update", auth, hostOtherDetails)
hostRouter.post("/host-time-update", auth, hostTimeUpdate)
hostRouter.get("/participants-details", auth, fetchParticipantsDetailsController)
hostRouter.post("/check-canParticipate", auth, checkingUserCanAttendQuiz)
hostRouter.post("/get-question-details", auth, fetchQuestionDetails)

export default hostRouter