import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface AIAnalysisRequest {
    userSql: string;
    exercisePrompt: string;
    exerciseLevel: string;
    schema: string;
}

export const aiController = {
    analyze: async (req: Request, res: Response) => {
        try {
            const { userSql, exercisePrompt, exerciseLevel, schema }: AIAnalysisRequest = req.body;

            if (!userSql || !exercisePrompt || !schema) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const systemPrompt = `You are an expert SQL Server tutor for data analysts. Your goal is to analyze the student's SQL code and provide helpful, encouraging feedback.
      
      You will receive:
      1. The student's SQL query.
      2. The exercise prompt/question.
      3. The difficulty level.
      4. The database schema (tables and columns).

      Your task is to return a JSON object with the following structure:
      {
        "isCorrect": boolean, // strict check if the logic solves the problem
        "feedback": string, // clear explanation of what is good or bad. Be encouraging.
        "hints": string[], // 1-2 progressive hints if incorrect.
        "warnings": string[], // syntax errors, performance issues, or bad practices.
        "correctedQuery": string | null, // only provide if the student is consistently wrong or asks for it (but here, provide if incorrect for now as reference, frontend can hide it).
        "explanation": string // explain the concepts used in the correct query.
      }

      Rules:
      - Focus on SQL Server T-SQL syntax.
      - If there are syntax errors, point them out clearly.
      - If the logic is wrong (e.g., wrong join type, missing filter), explain why.
      - Relate the query to real-world data analysis scenarios.
      - Start with positive reinforcement if possible.
      `;

            const userMessage = `
      Exercise Level: ${exerciseLevel}
      Prompt: "${exercisePrompt}"
      Schema: ${schema}
      
      Student SQL:
      \`\`\`sql
      ${userSql}
      \`\`\`
      `;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                ],
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
            });

            const responseContent = completion.choices[0].message.content;
            if (!responseContent) {
                throw new Error("No response from AI");
            }

            const analysis = JSON.parse(responseContent);
            res.json(analysis);

        } catch (error) {
            console.error('AI Analysis Error:', error);
            res.status(500).json({ error: 'Failed to analyze SQL' });
        }
    }
};
