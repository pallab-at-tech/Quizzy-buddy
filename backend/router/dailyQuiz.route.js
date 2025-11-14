import express from 'express'
import auth from '../middleware/auth.js'
import { fetchDailyQuiz } from '../controller/DailyQuiz.controller.js'

const dailyQuizRouter = express()

dailyQuizRouter.get("/fetch-daily-quiz",auth,fetchDailyQuiz)

export default dailyQuizRouter
