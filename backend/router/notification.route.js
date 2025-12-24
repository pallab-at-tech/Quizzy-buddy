import express from 'express'
import auth from "../middleware/auth.js"
import { getAllNotification, getOneNotificationMark, getUnreadNotification, markedAllRead } from '../controller/notification.controller.js'

const notificationRoute = express()

notificationRoute.post("/unread-notify", auth, getUnreadNotification)
notificationRoute.post("/marked-one", auth, getOneNotificationMark)
notificationRoute.get("/get-all-notify", auth, getAllNotification)
notificationRoute.post("/marked-all", auth, markedAllRead)

export default notificationRoute
