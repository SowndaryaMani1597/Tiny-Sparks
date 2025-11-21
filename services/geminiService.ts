import { GoogleGenAI, Type } from "@google/genai";
import { Activity, ActivityRequest, AgeGroup } from "../types";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateActivities = async (request: ActivityRequest): Promise<Activity[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const modelId = 'gemini-2.5-flash';

  const prompt = `
    I need a comprehensive activity plan for a child.
    
    Child Profile:
    - Age Group: ${request.ageGroup}
    ${request.childInterests ? `- Interests/Themes: ${request.childInterests}` : ''}
    ${request.materialsAvailable ? `- Available Materials at Home: ${request.materialsAvailable}` : '- Materials: Common household items only'}
    
    Please generate exactly 9 distinct activities organized into two main sections:

    SECTION 1: Developmental Milestones (4 activities)
    Generate one activity for each of these specific categories:
    1. Fine Motor
    2. Gross Motor
    3. Language
    4. Cognitive

    SECTION 2: Sensory Play Special (5 activities)
    Generate 5 distinct Sensory Play activities focusing on different senses (touch, sight, sound, etc.).
    The category for all of these should be "Sensory Play".

    Requirements:
    - Focus on low-prep, high-engagement ideas suitable for the home.
    - Include specific safety tips relevant to the age group.
    - Ensure the "category" field matches the specific skill (e.g., "Fine Motor") or "Sensory Play".
    
    Return the response as a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are a warm, helpful, and expert parenting consultant. You specialize in child development and Montessori-inspired home activities. Always prioritize safety.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy, fun title for the activity" },
              category: { 
                type: Type.STRING, 
                description: "The category: 'Fine Motor', 'Gross Motor', 'Language', 'Cognitive', or 'Sensory Play'" 
              },
              description: { type: Type.STRING, description: "Clear, step-by-step instructions (2-3 sentences max)" },
              materials: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of items needed"
              },
              duration: { type: Type.STRING, description: "Estimated time (e.g., '15-20 mins')" },
              safetyTip: { type: Type.STRING, description: "Crucial safety warning or supervision advice" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "2-3 keywords describing the activity type (e.g., 'Messy', 'Quiet', 'Outdoor')"
              }
            },
            required: ["title", "category", "description", "materials", "duration", "safetyTip", "tags"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No content generated from AI.");
    }

    const rawActivities = JSON.parse(responseText) as Omit<Activity, 'id'>[];
    
    // Add a unique ID to each activity
    const activities: Activity[] = rawActivities.map((activity, index) => ({
      ...activity,
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    }));

    return activities;

  } catch (error) {
    console.error("Error generating activities:", error);
    throw new Error("Failed to generate activities. Please try again.");
  }
};