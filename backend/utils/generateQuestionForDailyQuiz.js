import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.DAILY_QUIZ_KEY
})

async function generateDailyQuestion() {

    const prompt = `
You are an AI quiz generator.

Your tasks:
1. Choose ONE random topic automatically from the following categories:

   **High School / Higher Standard Subjects**
   - Physics
   - Chemistry
   - Biology
   - Mathematics
   - Geography
   - History
   - Economics
   - English Grammar
   - Logical Reasoning

   **Modern Technology / Computer Science**
   - Artificial Intelligence
   - Machine Learning Basics
   - Cybersecurity Basics
   - Cloud Computing
   - Operating Systems
   - Computer Networks

   **Programming Languages**
   - Java
   - C Programming
   - JavaScript
   - Python Basics

   **General Knowledge**
   - World GK
   - Indian GK
   - Science & Technology GK
   - Current Affairs (neutral & basic)

Choose one random topic yourself each time.

2. Generate EXACTLY 10 quiz questions for the chosen topic.

Requirements:
- Each question must be answerable within 10–15 seconds.
- Difficulty: High-school level to early-college OR beginner programming level.
- Each question must include:
   - question (string)
   - marks: 2
   - options: exactly 4 choices
   - correct_answer: index from 0–3 (string)

STRICT JSON OUTPUT:
Return ONLY valid JSON in this structure:

{
  "topic": "chosen_topic_here",
  "questions": [
    {
      "question": "",
      "marks": 2,
      "options": ["", "", "", ""],
      "correct_answer": "0"
    }
  ]
}

Rules:
- No explanation.
- No extra text.
- No markdown.
- No backticks.
- JSON must be valid and clean.
    `;

    const response = await ai.models.generateContent({
        model : "gemini-2.5-pro",
        contents : prompt
    })

    try {
        const ans = response.text.replace('```json', '').replace('```', '').trim()
        try {
            let x = JSON.parse(ans)
            return x
        } catch (error) {
            return null
        }
    } catch (error) {
        return null
    }
}

export default generateDailyQuestion
