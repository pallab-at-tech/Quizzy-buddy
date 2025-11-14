import nodeCron from 'node-cron'
import DailyQuizModel from '../model/dailyQuiz.model.js'
import generateDailyQuestion from '../utils/generateQuestionForDailyQuiz.js'
import userModel from '../model/user.model.js'
import dotenv from 'dotenv'
dotenv.config()

export const startDailyQuizCron = () => {

    nodeCron.schedule("*0 0 * * *", async () => {

        console.log("shedule start...")

        // create question with gemini
        const response = await generateDailyQuestion()

        if (!response) {
            console.log("Daily Quiz Error...")
            return
        }

        // Arrange date
        const now = new Date()

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        let DailyQuiz = await DailyQuizModel.findOne({
            start: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        // Filtered questions

        const questions = []
        let total_marks = 0

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
            start: new Date(now),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 30, 59, 999),
            total_marks: total_marks,
            negative_marks: 0.5,
            question_details: questions
        }

        if (!DailyQuiz) {
            DailyQuiz = new DailyQuizModel(payload)
        }
        else {
            DailyQuiz.topic = payload.topic,
                DailyQuiz.question_details = payload.question_details,
                DailyQuiz.start = payload.start,
                DailyQuiz.end = payload.end,
                DailyQuiz.total_marks = payload.total_marks,
                DailyQuiz.negative_marks = payload.negative_marks
        }

        // Save model

        await DailyQuiz.save()
    })
}

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
                timeTaken: dailyQuiz.timeTaken
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

export const submitDailyQuiz = async (request, response) => {
    try {

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

