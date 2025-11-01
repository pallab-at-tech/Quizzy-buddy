import express from 'express'
import auth from '../middleware/auth.js'
import { fetchLeaderBoardDetails } from '../controller/leaderboard.controller.js'

const leaderBoardRouter = express()

leaderBoardRouter.get("/fetch-leaderboard", auth, fetchLeaderBoardDetails)

export default leaderBoardRouter