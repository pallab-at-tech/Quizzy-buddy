import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import userModel from '../model/user.model.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import generateOTP from '../utils/generateOTP.js'
import sendOtpTemplate from '../utils/sendOtpTemplate.js'


export const userRegisterController = async (request, response) => {

    try {

        const { name, email, password } = request.body || {}

        if (!name || !email || !password) {
            return response.status(400).json({
                message: 'please provide name , email and password',
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email: email })

        if (user) {
            return response.status(400).json({
                message: `user already registerd with ${email}`,
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new userModel(payload)
        const save = await newUser.save()

        const num = Math.floor(100000 + Math.random() * 900000)

        const verify_email = await sendEmail({
            sendTO: email,
            subject: 'email verfication from Quizzy buddy',
            html: verifyEmailTemplate({
                name,
                code: num
            })
        })

        return response.json({
            message: 'user register successfully',
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

export const userLoginController = async (request, response) => {
    try {
        const { email, password } = request.body || {}

        if (!email || !password) {
            return response.status(400).json({
                message: 'please provide email and password',
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: `provide email not registered`,
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if (!checkPassword) {
            return response.status(400).json({
                message: "please enter right password",
                error: true,
                success: false
            })
        }

        // refreshToken and accessToken 
        const accessToken = await generatedAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accesstoken', accessToken, cookiesOption);
        response.cookie('refreshToken', refreshToken, cookiesOption);


        return response.json({

            message: "Login succesfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
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

export const userEmailVerificationController = async (request, response) => {
    try {

        const { code } = request.body || {}

        const user = await userModel.findByIdAndUpdate(code, {
            verify_email: true
        })

        if (!user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }

        return response.json({
            message: 'email verify successfully',
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

export const userLogOutController = async (request, response) => {
    try {

        const userId = request.userId

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        response.clearCookie('accesstoken', cookiesOption)
        response.clearCookie('refreshToken', cookiesOption)

        const removeRefresh = await userModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return response.json({
            message: 'LogOut successfully',
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

export const userForgotPassword = async (request, response) => {
    try {

        const { email } = request.body || {}

        if (!email) {
            return response.status(400).json({
                message: 'please provide your email',
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: 'email not registered',
                error: true,
                success: false
            })
        }

        const otp = (await generateOTP()).toString()
        const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000);

        const update = await userModel.findByIdAndUpdate(user._id, {
            forgot_Password_otp: otp,
            forgot_Password_expiry: oneHourLater
        })

        await sendEmail({
            sendTO: email,
            subject: 'Reset password , from Quizzy buddy',
            html: sendOtpTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: 'otp send to your gmail',
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

export const userVerifyForgotPasswordController = async (request, response) => {
    try {

        const { email, otp } = request.body || {}

        if (!email || !otp) {
            return response.status(400).json({
                message: 'please provide email and otp',
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: 'email not registered',
                error: true,
                success: false
            })
        }

        const currTime = new Date()

        if (currTime > user?.forgot_Password_expiry) {
            return response.status(400).json({
                message: 'otp expired',
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_Password_otp) {
            return response.json({
                message: 'invalid otp',
                error: true,
                success: false
            })
        }

        const updateUser = await userModel.findByIdAndUpdate(user?._id, {
            forgot_Password_expiry: "",
            forgot_Password_otp: ""
        })

        return response.json({
            message: "Verify otp successfully",
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

export const userResetPasswordController = async (request, response) => {
    try {

        const { email, newPassword, confirmPassword } = request.body || {}

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "provide required field (email , new password , confirm password)",
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: 'email not registered',
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New passowrd and confirm password must be same",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const updateUser = await userModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password update successfully",
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

export const userRefressingTokenController = async (request, response) => {
    try {
        const tokenFromcookie = request?.cookies?.refreshToken
        const tokenFromHeader = request?.headers?.authorization?.split(" ")[1]

        const refreshToken = tokenFromcookie || tokenFromHeader

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESSH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?.id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accesstoken', newAccessToken, cookiesOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
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

