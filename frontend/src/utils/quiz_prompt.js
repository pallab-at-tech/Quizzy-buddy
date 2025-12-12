import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API
});

async function generateAiQuestions(subject , numberOf = 5 , difficulty) {
    const prompt = `
    Create a multiple-choice quiz in pure JSON format only (no extra text).
      Each quiz question should have:
      - question: string (the actual question text)
      - options: array of 4 strings
      - correct: string (if option 0 is correct give correct : "0")
      - marks: number
      - image: optional URL string (can be empty)
      - inputBox: boolean (true if user must type answer, false otherwise)

      Example structure:
      [
        {
          "question": "What is the capital of France?",
          "options": ["Paris", "London", "Rome", "Berlin"],
          "correct": "0",
          "marks": 5,
          "image": "",
          "inputBox": false
        },
        {
          "question": "Solve: 5 + 7 = ?",
          "options": ["10", "11", "12", "13"],
          "correct": "2",
          "marks": 2,
          "image": "",
          "inputBox": false
        }
      ]

      Now, create a quiz on the topic **"${subject}"** with ${numberOf} questions ${difficulty}.
      Return only valid JSON (no markdown, no explanation).
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text
}

export default generateAiQuestions
