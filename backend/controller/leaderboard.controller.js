import { quizHostModel } from "../model/host_quiz.model.js"
import leaderBoardModel from "../model/leaderBoard.model.js"
import userModel from "../model/user.model.js"

export const leaderboardMake = async (payload, quizId, newLeaderBoard = false) => {
    try {
        let leaderboard = null

        if (newLeaderBoard) {
            leaderboard = new leaderBoardModel({
                quizId: payload.quizId,
                top_users: [{ ...payload.user }]
            })
            await leaderboard.save()
            return true
        }
        else {
            leaderboard = await leaderBoardModel.findOne({ quizId: quizId })
        }

        if (!leaderboard) {
            return false
        }

        const existUserId = leaderboard.top_users.findIndex((u) => u.userId.Id.toString() === payload.user.userId.Id.toString())

        if (existUserId !== -1) {
            leaderboard.top_users[existUserId] = {
                ...leaderboard.top_users[existUserId],
                ...payload.user
            }
        }
        else {
            leaderboard.top_users.push(payload.user)
        }

        leaderboard.top_users.sort((a, b) => {

            if (b.marks !== a.marks) return b.marks - a.marks
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy
            if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken
            if ((a.negativeMarks ?? 0) !== (b.negativeMarks ?? 0)) return (a.negativeMarks ?? 0) - (b.negativeMarks ?? 0)
            return new Date(a.submittedAt) - new Date(b.submittedAt)
        })

        await leaderboard.save()
        return true

    } catch (error) {
        console.log("Leaderboard error", error)
        return false
    }
}

export const fetchLeaderBoardDetails = async (request, response) => {
    try {
        const { hostId } = request.query || {}
        // console.log("hostId",hostId)

        if (!hostId) {
            return response.status(400).json({
                message: "Host Id required!",
                error: true,
                success: false
            })
        }

        const host = await quizHostModel.findById(hostId).select("quiz_start quiz_end")

        if (!host) {
            return response.status(400).json({
                message: "Quiz not found!",
                error: true,
                success: false
            })
        }

        if (new Date() < new Date(host.quiz_end)) {
            return response.status(400).json({
                message: "Quiz not end yet!",
                error: true,
                success: false
            })
        }

        const leaderBoard = await leaderBoardModel.findOne({ quizId: hostId })

        if (!leaderBoard) {
            return response.status(400).json({
                message: "LeaderBoard not found!",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "LeaderBoard get",
            leaderboard: leaderBoard,
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

export const fetchDailyQuizLeaderBoard = async (request, response) => {
    try {
        const userId = request.userId

        const dailyLeaderBoard = await leaderBoardModel.findOne({
            boardType: "Daily"
        })

        if (!dailyLeaderBoard) {
            return response.status(400).json({
                message: "Daily LeaderBoard Not Found!",
                error: true,
                success: false
            })
        }

        const now = new Date()
        const updateAt = new Date(dailyLeaderBoard.updatedAt)
        const isToday = now.getDate() === updateAt.getDate() && now.getMonth() === updateAt.getMonth() && now.getFullYear() === updateAt.getFullYear()

        const findRank = dailyLeaderBoard.top_users.findIndex((i) => i.userId.Id.toString() === userId)
        const DailyUserDetails = await userModel.findById(userId).select("daily_strict_count")

        return response.json({
            message: "Get daily quiz leaderboard",
            error: false,
            success: true,
            data: {
                leaderboard: isToday ? dailyLeaderBoard.top_users : [],
                current_userDetails: DailyUserDetails,
                rank : findRank 
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}