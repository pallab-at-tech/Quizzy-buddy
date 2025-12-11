import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.ONEVONE_BATTLE_API_KEY
});

async function QuestionGenerate_1V1(topic, difficulty = "High-school level to early-college OR beginner programming level.") {

    const prompt = `
    You are an AI quiz generator.

    Generate EXACTLY 10 quiz questions for the topic : ${topic}.

    Requirements:
    - Each question must be answerable within 10–15 seconds.
    - Difficulty: ${difficulty}
    - Each question must include:
     - question (string)
     - marks: 5
     - options: exactly 4 choices
     - correct_answer: index from 0–3 (string)

    STRICT JSON OUTPUT:
    Return ONLY valid JSON in this structure:

    {
    "questions": [
        {
        "question": "2+3= ?",
        "marks": 5,
        "options": ["4", "3", "5", "2"],
        "correct_answer": 2
        }
    ]
    }

    Rules:
    - No explanation.
    - No extra text.
    - No markdown.
    - No backticks.
    - JSON must be valid and clean.
    `
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    try {
        const ans = response.text.replace('```json', '').replace('```', '').trim()
        try {
            let x = JSON.parse(ans)
            console.log("Response", x)
            return x
        } catch (error) {
            console.log("QuestionGenerate_1V1 error", error)
            return null
        }
    } catch (error) {
        console.log("QuestionGenerate_1V1 error", error)
        return null
    }
}

export default QuestionGenerate_1V1


