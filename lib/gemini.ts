import { GoogleGenerativeAI } from '@google/generative-ai';

// Make sure to set GEMINI_API_KEY in your .env.local
const apiKey = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
