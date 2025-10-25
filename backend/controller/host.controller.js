import crypto from 'crypto'
import { questionModel, quizHostModel } from '../model/host_quiz.model.js'
import userModel from '../model/user.model.js'
import { customAlphabet } from "nanoid"


const hostIdentity = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10)

export const createQuizController = async (request, response) => {
    try {
        const { host_user_nanoId, quiz_data = [], quiz_start,
            quiz_end, set_negetive_marks = 0
        } = request.body || {}

        const userId = request.userId

        if (!quiz_data || quiz_data.length === 0) {
            return response.status(400).json({
                message: "No quiz data found!",
                error: true,
                success: false
            })
        }

        if (!quiz_start.trim()) {
            return response.status(400).json({
                message: "Quiz start time required!",
                error: true,
                success: false
            })
        }

        if (!quiz_end.trim()) {
            return response.status(400).json({
                message: "Quiz end time required!",
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

        // generate unique host id
        const nano_id = hostIdentity()

        const payload = {
            host_user_id: userId,
            host_user_nanoId: host_user_nanoId,
            provide_join_code: join_code,
            quiz_start: quiz_start,
            quiz_end: quiz_end,
            set_negetive_marks: set_negetive_marks,
            total_marks: 0,
            quiz_data: [],
            nano_id: nano_id
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
            _id: hostModel._id,
            quiz_id: hostModel.nano_id,
            createdAt: hostModel.createdAt,
            endDate: quiz_end,
            startDate: quiz_start
        })
        user.host_count += 1
        await user.save()

        return response.json({
            message: "Quiz created successfully",
            data: {
                _id: hostModel._id,
                host_id: nano_id,
                join_code: join_code,
                total_marks: payload.total_marks,
                start_time: new Date(quiz_start).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                end_time: new Date(quiz_end).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })
            },
            host_info: {
                _id: hostModel._id,
                quiz_id: hostModel.nano_id,
                createdAt: hostModel.createdAt,
                endDate: quiz_end,
                startDate: quiz_start
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

export const fetchHostPlusQuizDetails = async (request, response) => {
    try {

        const { hostId } = request.body || {}
        const userId = request.userId

        if (!hostId) {
            return response.status(400).json({
                message: "Host Id Required!",
                error: true,
                success: false
            })
        }

        const host = await quizHostModel.findById(hostId).populate("quiz_data")

        if (userId !== host.host_user_id.toString()) {
            return response.status(400).json({
                message: "Illegal Access",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Host details",
            data: host,
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

export const saveChangesHostDetailsByHost = async (request, response) => {
    try {

        const { editedData, hostId } = request.body || {}
        const userId = request.userId

        if (!hostId) {
            return response.status(400).json({
                message: "Host Id Required!",
                error: true,
                success: false
            })
        }

        if (!editedData || !Array.isArray(editedData) || editedData.length === 0) {
            return response.status(400).json({
                message: "No Changes Found!",
                error: true,
                success: false
            })
        }

        const host = await quizHostModel.findById(hostId).populate("quiz_data").select("quiz_data _id host_user_id")

        if (!host) {
            return response.status(400).json({
                message: "Host model not found!",
                error: true,
                sucess: false
            })
        }

        if (host.host_user_id.toString() !== userId) {
            return response.status(400).json({
                message: "Access denied!",
                error: true,
                success: false
            })
        }

        await Promise.all(
            editedData.map(async (d) => {

                if (!d) return

                // if new question then create new question model
                if (!d?._id) {
                    let options = []
                    if (d && !d.inputBox) {
                        options = d.options.filter((a) => a.trim())
                    }
                    const question = await questionModel.create({
                        question: d.question || "",
                        image: d.image || "",
                        marks: d.marks || "",
                        inputBox: d.inputBox || false,
                        options: options || [],
                        correct_option: d.correct_option || ""
                    })
                    host.quiz_data = [question._id, ...host.quiz_data]
                }
                // existing question update
                else {
                    await questionModel.findByIdAndUpdate(d._id, {
                        question: d.question,
                        image: d.image,
                        marks: d.marks,
                        inputBox: d.inputBox,
                        options: d.options,
                        correct_option: d.correct_option
                    })
                }
            })
        )

        await host.save()
        const savedData = await quizHostModel.findById(host._id).populate("quiz_data")

        return response.json({
            message: "Saved changes",
            savedData: savedData,
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

export const hostOtherDetails = async (request, response) => {
    try {
        const { hostId, strict, time, unit, set_negetive_marks } = request.body || {}
        const userId = request.userId

        if (!hostId) {
            return response.status(400).json({
                message: "Host Id required!",
                error: true,
                success: false
            })
        }

        const host = await quizHostModel.findById(hostId)

        if (!host) {
            return response.status(400).json({
                message: "Host Model not Found!",
                error: true,
                success: false
            })
        }

        if (userId !== host.host_user_id.toString()) {
            return response.status(400).json({
                message: "Access Denied!",
                error: true,
                success: false
            })
        }

        const now = new Date();
        if (now >= new Date(host.quiz_start)) {
            return response.status(400).json({
                message: "You cannot edit quiz settings after the quiz has started!",
                error: true,
                success: false,
            });
        }


        if (strict) {
            host.strict.enabled = true
            host.strict.time = time
            host.strict.unit = unit
        }
        else {
            host.strict.enabled = false
            host.strict.time = 0
            host.strict.unit = "sec"
        }

        host.set_negetive_marks = Number(set_negetive_marks) || 0

        await host.save()

        return response.json({
            message: "Quiz details updated.",
            data: {
                strict: strict,
                time: time,
                unit: unit,
                set_negetive_marks: Number(set_negetive_marks) || 0
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

export const hostTimeUpdate = async (request, response) => {
    try {

        const { hostId, quiz_start, quiz_end } = request.body || {}

        const userId = request.userId

        if (!hostId) {
            return response.status(400).json({
                message: "Host Id Required!",
                error: true,
                success: false
            })
        }

        const host = await quizHostModel.findById(hostId)

        if (!host) {
            return response.status(400).json({
                message: "Host model not found!",
                error: true,
                sucess: false
            })
        }

        if (host.host_user_id.toString() !== userId) {
            return response.status(400).json({
                message: "Access denied!",
                error: true,
                success: false
            })
        }

        if (!quiz_start.trim()) {
            return response.status(400).json({
                message: "Quiz start time can't be null",
                error: true,
                success: false
            })
        }

        if (!quiz_end.trim()) {
            return response.status(400).json({
                message: "Quiz end time can't be null",
                error: true,
                success: false
            })
        }

        const now = new Date()

        if (now >= new Date(quiz_start)) {
            return response.status(400).json({
                message: "past Time can't be selected at quiz start field!",
                error: true,
                sucess: false
            })
        }

        if (now >= new Date(quiz_end)) {
            return response.status(400).json({
                message: "past Time can't be selected at quiz end field!",
                error: true,
                sucess: false
            })
        }

        if (new Date(quiz_end) <= new Date(quiz_start)) {
            return response.status(400).json({
                message: "start time can't be earlier than the end time!",
                error: true,
                sucess: false
            })
        }

        host.quiz_start = quiz_start
        host.quiz_end = quiz_end

        await host.save()

        return response.json({
            message: "Host time updated",
            data: {
                quiz_start: quiz_start,
                quiz_end: quiz_end,
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

// for participants members fetch details
export const fetchParticipantsDetailsController = async (request, response) => {
    try {
        const { hostId } = request.query || {}
        const userId = request.userId

        if (!hostId) {
            return response.status(400).json({
                message: "HostId required!😑",
                error: true,
                success: false
            })
        }

        const host = await quizHostModel.findById(hostId)
        
        if (!host) {
            return response.status(400).json({
                message: "Quiz not found!😑",
                error: true,
                success: false
            })
        }

        if (host.host_user_id.toString() === userId.toString()) {
            return response.status(400).json({
                message: "Host can't Participants in quiz!😑",
                error: true,
                success: false
            })
        }

        const now = new Date()

        if (new Date(host.quiz_start) > now) {
            return response.status(400).json({
                message: "Quiz not start yet!😑",
                error: true,
                success: false
            })
        }

        if (new Date(host.quiz_end) < now) {
            return response.status(400).json({
                message: "Quiz already expired!😑",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Quiz data",
            data: host,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: "Some Error occued!😑" || error.message || error,
            error: true,
            success: false
        })
    }
}