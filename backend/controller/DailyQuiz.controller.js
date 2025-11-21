import nodeCron from 'node-cron'
import { customAlphabet } from "nanoid"
import DailyQuizModel from '../model/dailyQuiz.model.js'
import generateDailyQuestion from '../utils/generateQuestionForDailyQuiz.js'
import userModel from '../model/user.model.js'
import leaderBoardModel from '../model/leaderBoard.model.js'
import dotenv from 'dotenv'
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

    // Save model

    return await DailyQuiz.save()
}

// Reshedule quiz 
export const startDailyQuizCron = () => {

    nodeCron.schedule("0 0 * * *", async () => {

        console.log("shedule start...")

        // just reshedule the daily quiz...
        await generateAndSaveDailyQuiz()
    })
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
            message: error.message || error,
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

        const user = await userModel.findById(userId)

        if (!user) {
            return response.status(400).json({
                message: "User not found!",
                error: true,
                success: false
            })
        }

        let leaderBoard = await leaderBoardModel.findOne({
            boardType: "Daily"
        })

        const DailyQuiz = await DailyQuizModel.findOne()

        console.log("payload randomId",randomId)
        console.log("model randomId",DailyQuiz.randomId)
        console.log("DailyQuiz.randomId !== randomId",DailyQuiz.randomId !== randomId)

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
        answer.map((v, i) => {
            if (v && Number(v.userAns) === Number(correct_answer[i])) {
                total_correct += 1
                total_solved += 1
                get_total_marks += 2
            }

            if (v && Number(v.userAns) !== -1) {
                total_solved += 1
            }
        })

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

        // Create or update leaderBoard
        if (!leaderBoard) {
            leaderBoard = new leaderBoardModel({
                quizId: DailyQuiz._id,
                boardType: "Daily",
                top_users: [payload]
            })
        }
        else {
            leaderBoard.top_users = [...leaderBoard.top_users, payload]
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
        user.daily_strict_count.last_week_stats.push(
            {
                date: now,
                score: payload.marks,
                accuracy: payload.accuracy
            }
        )

        let sortedStats = user.daily_strict_count.last_week_stats.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
        })
        sortedStats = sortedStats.slice(0 , 7)

        user.daily_strict_count.last_week_stats = sortedStats
        user.daily_strict_count.last_date = now

        await Promise.all([user.save(), leaderBoard.save()])

        return response.json({
            message: "Daily Quiz Submitted",
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

