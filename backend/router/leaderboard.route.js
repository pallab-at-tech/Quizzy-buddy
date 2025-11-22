import express from 'express'
import auth from '../middleware/auth.js'
import { fetchDailyQuizLeaderBoard, fetchLeaderBoardDetails } from '../controller/leaderboard.controller.js'

const leaderBoardRouter = express()

leaderBoardRouter.get("/fetch-leaderboard", auth, fetchLeaderBoardDetails)
leaderBoardRouter.get("/fetch-daily-leaderboard", auth, fetchDailyQuizLeaderBoard)

export default leaderBoardRouter