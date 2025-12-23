import notificationModel from "../model/notification.model.js"

export const getUnreadNotification = async (request, response) => {
    try {
        const userId = request.userId
        const { page = 1, limit = 10 } = request.body || {}

        const skip = (page - 1) * limit

        const notification = await notificationModel.find({ recipent: userId, isRead: false }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const count = await notificationModel.countDocuments({ recipent: userId, isRead: false })

        return response.json({
            message: "Get all unread message.",
            notification: notification ? notification : [],
            count: count,
            total_page: Math.ceil(count / limit),
            curr_page: page,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}