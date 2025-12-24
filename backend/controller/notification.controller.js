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

export const getOneNotificationMark = async (request, response) => {
    try {
        const userId = request.userId
        const { notifyId } = request.body || {}

        if (!notifyId) {
            return response.status(400).json({
                message: "Notification Id required!",
                error: true,
                success: false
            })
        }

        await notificationModel.findOneAndUpdate(
            { _id: notifyId, recipent: userId },
            { isRead: true }
        )

        return response.json({
            message: "Marked One",
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const markedAllRead = async (request, response) => {
    try {
        const userId = request.userId

        await notificationModel.updateMany(
            { recipent: userId, isRead: false },
            { $set: { isRead: true } },
        )

        return response.status(200).json({
            message: "All notifications marked as read",
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAllNotification = async (request, response) => {
    try {
        const userId = request.userId

        const { page = 1, limit = 10 } = request.query || {}

        const skip = (page - 1) * limit

        const notification = await notificationModel.find(
            { recipent: userId }
        ).sort({ createdAt: -1 }).skip(skip).limit(limit)

        const notificationCount = await notificationModel.countDocuments({ recipent: userId })

        return response.json({
            message: "Get all notification",
            total: notificationCount,
            total_page: Math.ceil(notificationCount / limit),
            curr_page: page,
            notifications: notification || [],
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
