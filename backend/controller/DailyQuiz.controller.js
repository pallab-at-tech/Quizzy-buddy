import nodeCron from 'node-cron'
import DailyQuizModel from '../model/dailyQuiz.model.js'
import generateDailyQuestion from '../utils/generateQuestionForDailyQuiz.js'
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

export const fetchDailyQuiz = async(request , response) => {
    try {
        const {} = request.query || {}

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


