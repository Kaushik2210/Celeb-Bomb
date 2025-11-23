import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "./utils";

export const generateCelebrityPhotobomb = async (
  base64Image: string,
  celebrityName: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const mimeType = getMimeTypeFromBase64(base64Image);
  const rawBase64 = stripBase64Prefix(base64Image);

  const prompt = `
    Insert ${celebrityName} into this image with hyper-realistic integration.
    
    Crucial instructions for realism:
    1. LIGHTING & SHADOWS: specific focus on matching the scene's light source direction, intensity, and color temperature. Render ${celebrityName} with matching lighting. Cast realistic shadows onto the environment that are consistent with existing shadows in the scene.
    2. PHOTOREALISM: Match the camera lens characteristics, including focal length, depth of field (blur/bokeh), film grain, and ISO noise.
    3. INTERACTION: The celebrity must appear to be physically present in the space, interacting naturally with the environment (e.g., photobombing, standing behind someone, peeking over a shoulder).
    4. PRESERVATION: Do not alter the original subjects or background details unless strictly necessary for occlusion.
    
    The result should be indistinguishable from a real photograph.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: rawBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        imageConfig: {
            // gemini-3-pro-image-preview allows imageSize config
            imageSize: "1K", 
            aspectRatio: "1:1" // Standardizing output for this demo, though model supports others
        }
      }
    });

    // Parse response for image data
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};