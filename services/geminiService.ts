import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getArtTutorFeedback = async (taskName: string, action: string, imageBase64?: string) => {
  if (!apiKey) {
    return "请配置 API Key 以获取 AI 导师的点评。";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    let contents: any[] = [];
    
    const textPrompt = `
      You are a wise, poetic, and encouraging ancient Chinese painting master.
      The student is performing the task: "${taskName}" - "${action}".
      
      ${imageBase64 ? "The student has uploaded a photo of their work. Analyze the image to see if it roughly matches the expected brushwork/ink/color technique." : "The student has not uploaded a photo yet, but is asking for guidance."}
      
      Provide a short, 2-sentence feedback in Chinese. 
      1. A poetic observation related to nature or Zen philosophy.
      2. A specific, encouraging tip based on the visual evidence (if provided) or general technique (if no image).
    `;

    if (imageBase64) {
      // Clean base64 string if it contains data URI prefix
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      
      contents = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        },
        {
          text: textPrompt
        }
      ];
    } else {
      contents = [{ text: textPrompt }];
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contents },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "习画在心，笔耕不辍。AI 暂时无法连接，但你的努力已被记录。";
  }
};