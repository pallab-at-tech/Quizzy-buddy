import express from 'express'
import auth from "../middleware/auth.js"
import { getUnreadNotification } from '../controller/notification.controller.js'

const notificationRoute = express()

notificationRoute.post("/unread-notify", auth, getUnreadNotification)

export default notificationRoute