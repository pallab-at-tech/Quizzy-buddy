import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY 
});


async function checkIsCorrect(question, userAnswer) {

    const prompt = `
        You are an answer evaluation system.

        Question: ${question}
        User Answer: ${userAnswer}

        Task:
        1. Determine whether the user's answer is factually and logically correct.
        2. If correct, respond with: 
        {
            "isCorrect": "Y",
            "reason": "Brief explanation why it's correct"
        }
        3. If incorrect, respond with:
        {
            "isCorrect": "N",
            "reason": "Brief explanation why it is wrong"
        }

        Important:
        - Respond ONLY in valid JSON format.
        - Do not include any text before or after the JSON.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt
    })

    try {
        const ans = response.text.replace('```json', '').replace('```', '').trim()
        try {
            let x = JSON.parse(ans)
            x = {
                isCorrect: x?.isCorrect.trim(),
                reason: x?.reason.trim()
            }
            return x
        } catch (error) {
            return null
        }
    } catch (error) {
        return null
    }
}

export default checkIsCorrect
