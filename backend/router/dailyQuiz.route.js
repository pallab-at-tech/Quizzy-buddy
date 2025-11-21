import express from 'express'
import auth from '../middleware/auth.js'
import { startDailyQuizAndFetchQuestion, submitDailyQuiz } from '../controller/DailyQuiz.controller.js'

const dailyQuizRouter = express()

dailyQuizRouter.get("/fetch-daily-quiz",auth,startDailyQuizAndFetchQuestion)
dailyQuizRouter.post("/submit-daily-quiz",auth,submitDailyQuiz)

export default dailyQuizRouter
