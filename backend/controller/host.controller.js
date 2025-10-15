import crypto from 'crypto'
import { questionModel, quizHostModel } from '../model/host_quiz.model.js'
import userModel from '../model/user.model.js'

export const createQuizController = async (request, response) => {
    try {
        const { host_user_nanoId, time_sec_min, quiz_data = [], quiz_start,
            quiz_expire_per_Q, set_negetive_marks = 0, strict = false
        } = request.body || {}

        const userId = request.userId

        if (!quiz_data || quiz_data.length === 0) {
            return response.status(400).json({
                message: "No quiz data found!",
                error: true,
                success: false
            })
        }

        if (!quiz_start) {
            return response.status(400).json({
                message: "Quiz start time required!",
                error: true,
                success: false
            })
        }

        if (!quiz_expire_per_Q) {
            return response.status(400).json({
                message: "Quiz time required!",
                error: true,
                success: false
            })
        }

        // filtered all data
        const filteredData = []

        quiz_data.map(
            (d) => {
                let options = []
                if (d && !d.inputBox) {
                    options = d.options.filter((a) => a.trim())
                }

                if (d.question || d.image) {
                    filteredData.push({
                        ...d,
                        options: options
                    })
                }
            }
        );

        if (filteredData.length < 1) {
            return response.status(400).json({
                message: "Quiz data not found!",
                error: true,
                success: false
            })
        }

        // generate random & unique token
        const join_code = crypto.randomBytes(12).toString('hex')

        // end date compute
        const startDate = new Date(quiz_start)
        const perQuestionTime = parseInt(quiz_expire_per_Q, 10)

        let totalTime;

        if (time_sec_min === "minutes") {
            totalTime = filteredData.length * perQuestionTime * 60
        }
        else {
            totalTime = filteredData.length * perQuestionTime
        }

        const endDate = new Date(startDate.getTime() + totalTime * 1000)


        const payload = {
            host_user_id: userId,
            host_user_nanoId: host_user_nanoId,
            provide_join_code: join_code,
            quiz_start: quiz_start,
            quiz_end: endDate,
            quiz_expire_per_Q: `${quiz_expire_per_Q}|${time_sec_min}`,
            set_negetive_marks: set_negetive_marks,
            total_marks: 0,
            quiz_data: []
        }

        // create question model
        for (const d of filteredData) {
            const createQuestion = new questionModel({
                question: d.question || "",
                image: d.image || "",
                marks: d.marks || "",
                inputBox: d.inputBox || false,
                options: d.options || [],
                correct_option: d.correct || ""
            });

            await createQuestion.save();
            payload.quiz_data.push(createQuestion._id);
            payload.total_marks += parseFloat(d?.marks) || 0;
        }

        const hostModel = new quizHostModel(payload)
        await hostModel.save()

        // fill user host details
        const user = await userModel.findById(userId)
        user.host_info.push({
            quiz_id: hostModel._id,
            createdAt: hostModel.createdAt,
            endDate: endDate,
            startDate: startDate
        })
        user.host_count += 1
        await user.save()

        return response.json({
            message: "Quiz created successfully",
            data: {
                host_id: hostModel._id,
                join_code: join_code,
                total_marks: payload.total_marks,
                start_time: new Date(quiz_start).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                end_time: new Date(endDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })
            },
            host_info: {
                quiz_id: hostModel._id,
                createdAt: hostModel.createdAt,
                endDate: endDate,
                startDate: startDate
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