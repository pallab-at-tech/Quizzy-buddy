import nodeCron from 'node-cron'
import { customAlphabet } from "nanoid"
import DailyQuizModel from '../model/dailyQuiz.model.js'
import generateDailyQuestion from '../utils/generateQuestionForDailyQuiz.js'
import userModel from '../model/user.model.js'
import leaderBoardModel from '../model/leaderBoard.model.js'
import dotenv from 'dotenv'
import notificationModel from '../model/notification.model.js'
dotenv.config()

const randomId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 6)

// Reshedule quiz function 
export const generateAndSaveDailyQuiz = async () => {

    const response = await generateDailyQuestion()
    if (!response) {
        console.log("Daily Quiz Error...")
        return null
    }

    // Arrange date
    const now = new Date()

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    let DailyQuiz = await DailyQuizModel.findOne()

    // Filtered questions

    const questions = []
    let total_marks = 0
    const rand = randomId()

    for (const q of (response?.questions || [])) {

        const question_details = {
            question: q?.question || "",
            marks: q?.marks || 2,
            options: q?.options.filter(Boolean) || [],
            correct_answer: q?.correct_answer || ""
        }

        if (!question_details?.question || !question_details?.correct_answer || question_details.options.length === 0) {
            continue
        }

        total_marks += (question_details.marks || 2)
        questions.push(question_details)
    }

    const payload = {
        topic: response.topic || "",
        start: startOfDay,
        end: endOfDay,
        total_marks: total_marks,
        negative_marks: 0.5,
        question_details: questions,
        randomId: rand
    }

    if (!DailyQuiz) {
        DailyQuiz = new DailyQuizModel(payload)
    }
    else {
        DailyQuiz.topic = payload.topic
        DailyQuiz.question_details = payload.question_details
        DailyQuiz.start = payload.start
        DailyQuiz.end = payload.end
        DailyQuiz.total_marks = payload.total_marks
        DailyQuiz.negative_marks = payload.negative_marks
        DailyQuiz.randomId = payload.randomId
    }

    // LeaderBoard rank extract
    const leaderBoard = await leaderBoardModel.findOne({
        boardType: "Daily"
    })

    // badge update for top10 users
    if (leaderBoard) {
        const topTenUser = leaderBoard.top_users.slice(0, 10)
        let rank = 1

        for (let u of topTenUser) {

            const user = await userModel.findById(u.userId.Id)
            if (!user) continue

            const badges = user.badge_collection
            let badgeToGive = null

            const promiseArr = []

            if (rank === 1) {
                if (!badges.Top1) {
                    badgeToGive = "Top1"
                }
                else if (!badges.Top5) {
                    badgeToGive = "Top5"
                }
                else if (!badges.Top10) {
                    badgeToGive = "Top10"
                }
            }
            else if (rank <= 5) {
                if (!badges.Top5) {
                    badgeToGive = "Top5"
                }
                else if (!badges.Top10) {
                    badgeToGive = "Top10"
                }
            }
            else if (rank <= 10) {
                if (!badges.Top10) {
                    badgeToGive = "Top10"
                }
            }

            if (badgeToGive) {
                badges[badgeToGive] = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "${badgeToGive}" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }

            if (rank === 1) {
                if (!badges.Top1x20) {
                    badges.top_count.top1Count++
                }
                else if (!badges.Top5x20) {
                    badges.top_count.top5Count++
                }
                else if (!badges.Top10x20) {
                    badges.top_count.top10Count++
                }
            }
            else if (rank <= 5) {
                if (!badges.Top5x20) {
                    badges.top_count.top5Count++
                }
                else if (!badges.Top10x20) {
                    badges.top_count.top10Count++
                }
            }
            else if (rank <= 10) {
                if (!badges.Top10x20) {
                    badges.top_count.top10Count++
                }
            }

            if (badges.top_count.top1Count === 5) {
                badges.Top1x5 = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "Top1x5" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }
            if (badges.top_count.top1Count === 20) {
                badges.Top1x20 = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "Top1x20" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }

            if (badges.top_count.top5Count === 5) {
                badges.Top5x5 = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "Top5x5" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }
            if (badges.top_count.top5Count === 20) {
                badges.Top5x20 = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "Top5x20" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }

            if (badges.top_count.top10Count === 5) {
                badges.Top10x5 = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "Top10x5" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }
            if (badges.top_count.top10Count === 20) {
                badges.Top10x20 = true

                promiseArr.push(
                    new notificationModel({
                        recipent: u.userId.Id,
                        notification_type: "Achieve Badge",
                        content: `Unlocked "Top10x20" badge`,
                        isRead: false,
                        navigation_link: "/dashboard/overview"
                    }).save()
                )
            }

            rank++
            await user.save()
            await Promise.all(promiseArr)
        }
    }

    // Save model

    return await DailyQuiz.save()
}

// Reshedule quiz 
export const startDailyQuizCron = () => {

    nodeCron.schedule("0 0 * * *", async () => {

        console.log("Daily Quiz Cron Started:", new Date().toISOString());
        // just reshedule the daily quiz...
        try {
            await generateAndSaveDailyQuiz();
            console.log("Daily Quiz Generated Successfully");
        } catch (error) {
            console.error("Daily Quiz Cron Error:", error.message || error);
        }
    },
        {
            scheduled: true,
            timezone: "Asia/Kolkata"
        }
    )

    console.log("Daily Quiz Cron Initialized");
}

// fetch question and quiz details when quiz about to start
export const startDailyQuizAndFetchQuestion = async (request, response) => {
    try {
        const userId = request.userId

        const user = await userModel.findById(userId)
        if (!user) {
            return response.status(400).json({
                message: "User not found!",
                error: true,
                success: false
            })
        }

        const last_date = user.daily_strict_count.last_date
        const now = new Date()

        if ((last_date && last_date.getFullYear() === now.getFullYear() && last_date.getMonth() === now.getMonth() && last_date.getDate() === now.getDate())) {
            return response.status(400).json({
                message: "You have already completed Daily Quiz!",
                error: true,
                success: false
            })
        }

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        const dailyQuiz = await DailyQuizModel.findOne(
            {
                start: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }
        )

        if (!dailyQuiz) {
            await generateAndSaveDailyQuiz()
            return response.status(400).json({
                message: "Some Error Ocurred!Try Later.",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Fetched Question Details",
            data: {
                topic: dailyQuiz.topic,
                question_details: dailyQuiz.question_details,
                total_marks: dailyQuiz.total_marks,
                negative_marks: dailyQuiz.negative_marks,
                timeTaken: dailyQuiz.timeTaken,
                randomId: dailyQuiz.randomId
            },
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: "Some Error Occured , Try later!" || error.message || error,
            error: true,
            success: false
        })
    }
}

// Submit Quiz
export const submitDailyQuiz = async (request, response) => {
    try {
        const userId = request.userId
        const { answer, correct_answer, time, randomId } = request.body || {}

        const [user, DailyQuiz, leaderBoard] = await Promise.all([
            userModel.findById(userId),
            DailyQuizModel.findOne(),
            leaderBoardModel.findOne({ boardType: "Daily" })
        ])

        if (!user) {
            return response.status(400).json({
                message: "User not found!",
                error: true,
                success: false
            })
        }

        // Quiz already expired
        if (!randomId || DailyQuiz.randomId !== randomId) {
            return response.status(400).json({
                message: "Quiz Expired!",
                error: true,
                success: false
            })
        }

        // check , is already submit daily quiz
        const now = new Date()
        const last_date = user.daily_strict_count.last_date ? new Date(user.daily_strict_count.last_date) : null

        if (last_date && now.getDate() === last_date.getDate() && now.getMonth() === last_date.getMonth() && now.getFullYear() === last_date.getFullYear()) {
            return response.status(400).json({
                message: "You already have attend Quiz!",
                error: true,
                success: false
            })
        }

        // calculate correct answer
        let total_solved = 0, total_correct = 0, get_total_marks = 0

        for (let i = 0; i < correct_answer.length; i++) {
            const userAns = Number(answer[i].userAns ?? -1)
            const correct = Number(correct_answer[i])

            if (userAns !== -1) total_solved++

            if (userAns === correct) {
                total_correct++
                get_total_marks += 2
            }
        }

        // create payload for leaderBoard
        const payload = {
            userId: {
                Id: user._id,
                userId: user.nanoId,
                userName: user.name
            },
            marks: get_total_marks - ((total_solved - total_correct) * Math.abs(DailyQuiz.negative_marks || 0)),
            timeTaken: time,
            accuracy: total_solved === 0 ? 0 : Number(((total_correct / total_solved) * 100).toFixed(4)),
            submittedAt: new Date(),
            negativeMarks: (total_solved - total_correct) * Math.abs(DailyQuiz.negative_marks || 0)
        }

        let board = leaderBoard

        // Create or update leaderBoard
        if (!board) {
            board = new leaderBoardModel({
                quizId: DailyQuiz._id,
                boardType: "Daily",
                top_users: [payload]
            })
        }
        else {
            const updateAt = new Date(board.updatedAt)
            const isBoardSameDay = now.getDate() === updateAt.getDate() && now.getMonth() === updateAt.getMonth() && now.getFullYear() === updateAt.getFullYear()

            if (!isBoardSameDay) {
                board.top_users = [payload]
            }
            else {
                board.top_users.push(payload)
                // sort leaderBoard
                board.top_users.sort((a, b) => {
                    if (b.marks !== a.marks) return b.marks - a.marks
                    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy
                    if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken
                    return (a.negativeMarks ?? 0) - (b.negativeMarks ?? 0)
                })
            }
        }

        // update userDetails 
        if (last_date) {
            const given_dt = new Date(user.daily_strict_count.last_date)

            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)

            const isYesterDay = given_dt.getDate() === yesterday.getDate() && given_dt.getMonth() === yesterday.getMonth() && given_dt.getFullYear() === yesterday.getFullYear()

            if (isYesterDay) {
                user.daily_strict_count.best_strick = Math.max(
                    user.daily_strict_count.best_strick,
                    user.daily_strict_count.strict_count + 1
                )
                user.daily_strict_count.strict_count += 1
            }
            else {
                user.daily_strict_count.strict_count = 1
            }
        }
        else {
            user.daily_strict_count.strict_count = 1
            user.daily_strict_count.best_strick = 1
        }

        user.daily_strict_count.last_week_stats.unshift(
            {
                date: now,
                score: payload.marks,
                accuracy: payload.accuracy
            }
        )

        if (user.daily_strict_count.last_week_stats.length > 7) {
            user.daily_strict_count.last_week_stats = user.daily_strict_count.last_week_stats.slice(0, 7)
        }
        user.daily_strict_count.last_date = now

        const streakCount = user.daily_strict_count.strict_count
        if (streakCount === 7) {
            user.badge_collection.Streak1Week = true
        }
        else if (streakCount === 30) {
            user.badge_collection.Streak1Month = true
        }
        else if (streakCount === 90) {
            user.badge_collection.Streak3Month = true
        }
        else if (streakCount === 180) {
            user.badge_collection.Streak6Month = true
        }
        else if (streakCount === 360) {
            user.badge_collection.Streak1Year = true
        }

        await Promise.all([user.save(), leaderBoard.save()])

        return response.json({
            message: "Daily Quiz Submitted",
            error: false,
            success: true,
            data: user.daily_strict_count
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

