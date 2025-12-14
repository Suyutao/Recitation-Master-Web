import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainQuestionWithAI = async (question: Question): Promise<string> => {
  try {
    const prompt = `
      You are an expert history tutor for high school students using the "Recite King" app.
      
      Question: "${question.question}"
      Options:
      A. ${question.options[0]}
      B. ${question.options[1]}
      C. ${question.options[2]}
      D. ${question.options[3]}
      
      Correct Answer: ${question.answer}
      
      Please provide a detailed but concise explanation of:
      1. The historical context of the question.
      2. Why the correct answer is correct.
      3. Briefly why the other options are incorrect.
      
      Keep the tone encouraging and educational. Format with simple Markdown.
    `;

    // Using gemini-3-pro-preview with thinking budget for complex historical reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
      },
    });

    return response.text || "Sorry, I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("AI Explanation failed:", error);
    return "An error occurred while connecting to the AI Tutor. Please try again later.";
  }
};
