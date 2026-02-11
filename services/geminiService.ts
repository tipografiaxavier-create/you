
import { GoogleGenAI, Type } from "@google/genai";
import { YouTubeScript, Niche } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateScript = async (topic: string, niche: Niche): Promise<YouTubeScript> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a high-retention YouTube script for a video about "${topic}" in the ${niche} niche.
      Follow best SEO practices:
      - Include 3 catchy titles.
      - 10 high-ranking tags.
      - Optimized video description.
      - Structure: Hook (0-10s), Introduction, Body (divided into logical segments), CTA, Outro.
      - For EACH segment, provide a "visualDescription" which is a prompt to generate a photorealistic image that illustrates what's happening on screen.
      - Also provide a "thumbnailPrompt" for a high-click-through-rate thumbnail.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The best catchy title for the video' },
          seoTags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'List of 10 SEO keywords'
          },
          description: { type: Type.STRING, description: 'SEO optimized description with timestamps' },
          targetAudience: { type: Type.STRING },
          thumbnailPrompt: { type: Type.STRING, description: 'Prompt for generating the thumbnail image' },
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: 'HOOK, INTRO, BODY, CTA, or OUTRO' },
                text: { type: Type.STRING, description: 'The spoken script' },
                visualDescription: { type: Type.STRING, description: 'A highly detailed prompt for an image generator representing this part of the script.' }
              },
              required: ['type', 'text', 'visualDescription']
            }
          }
        },
        required: ['title', 'seoTags', 'description', 'segments', 'thumbnailPrompt']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text) as YouTubeScript;
};

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `High quality YouTube visual: ${prompt}. Cinematographic lighting, 4k, photorealistic.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Could not generate image");
};

export const generateThumbnail = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Epic YouTube Thumbnail: ${prompt}. High contrast, vibrant colors, clickbait style, 4k, professional.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Could not generate thumbnail");
};
