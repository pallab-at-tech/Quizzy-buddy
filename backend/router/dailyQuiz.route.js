import express from 'express'
import auth from '../middleware/auth.js'
import { startDailyQuizAndFetchQuestion } from '../controller/DailyQuiz.controller.js'

const dailyQuizRouter = express()

dailyQuizRouter.get("/fetch-daily-quiz",auth,startDailyQuizAndFetchQuestion)

export default dailyQuizRouter
