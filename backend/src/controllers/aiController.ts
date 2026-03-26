import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const suggestTaskDetails = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured');
    return res.status(500).json({ 
      message: 'AI service is not configured. Please contact administrator.' 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are a smart task manager assistant. 
Given the task title: "${title.trim()}", suggest the following details in JSON format only:

1. A detailed description as a markdown checklist with 3-5 actionable sub-tasks
2. A priority level (must be exactly one of: LOW, MEDIUM, or HIGH)
3. A list of 2-3 relevant short tags (single words or short phrases, lowercase)
4. Estimated time to complete (e.g., "2 hours", "3 days", "1 week")

Return ONLY a valid JSON object with no additional text, explanations, or markdown code blocks.
Format: 
{
  "description": "- [ ] First task\\n- [ ] Second task\\n- [ ] Third task",
  "priority": "MEDIUM",
  "tags": ["tag1", "tag2"],
  "estimatedTime": "2 hours"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(jsonString);

    if (!parsedData.description || !parsedData.priority || !parsedData.tags || !parsedData.estimatedTime) {
      throw new Error('Invalid AI response structure');
    }

    if (!['LOW', 'MEDIUM', 'HIGH'].includes(parsedData.priority)) {
      parsedData.priority = 'MEDIUM';
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('AI suggestion error:', error);
    console.error('Error details:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      errorDetails: error?.errorDetails
    });
    
    let errorMessage = 'AI Assistant is taking a break. Please try again in a moment.';
    let statusCode = 500;
    
    if (error?.status === 404) {
      errorMessage = 'AI model not found. Please check API configuration.';
    } else if (error?.status === 401 || error?.status === 403) {
      errorMessage = 'AI API key is invalid. Please check configuration.';
    } else if (error?.status === 429) {
      errorMessage = 'Too many requests. The magic is resting, please try again in a minute.';
      statusCode = 429;
    } else if (error?.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please verify your Gemini API key.';
    }
    
    res.status(statusCode).json({ message: errorMessage });
  }
};
