import express from 'express'
import auth from '../middleware/auth.js'
import { fetchRoomDetails } from '../controller/battle.controller.js'

const battleRouter = express()

battleRouter.get("/room-details", auth, fetchRoomDetails)

export default battleRouter