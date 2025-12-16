
import { GoogleGenAI, Type } from "@google/genai";
import { Pet, CheckResult, RiskLevel, Species } from '../types';
import { localization } from './localizationService';

const REASONING_MODEL = "gemini-3-pro-preview";
const IMAGE_GEN_MODEL = "gemini-2.5-flash-image";

export const geminiService = {
  
  /**
   * 1. Identifies the pet species/breed from the photo.
   * 2. Generates a stylized portrait based on the visual description.
   */
  createPetProfile: async (
    name: string,
    age: number,
    weight: number,
    imageBase64: string
  ): Promise<Pet> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Step 1: Identify the animal
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    
    const idPrompt = `
      Analyze this image. 
      1. First, determine strictly if this image contains a real, living animal (or a photo of one). 
      2. If it is an inanimate object, a human, a car, a landscape, or anything that is NOT a pet animal, set 'isAnimal' to false.
      3. If it IS an animal:
         - Identify the species (Dog, Cat, or Other).
         - Identify the likely breed.
         - Provide a short visual description of the pet's appearance (color, pattern, distinctive features) to be used for generating a painting.
    `;

    const idResponse = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: {
        role: 'user',
        parts: [
          { text: idPrompt },
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAnimal: { type: Type.BOOLEAN, description: "True only if a real animal is detected" },
            species: { type: Type.STRING, enum: ["Dog", "Cat", "Other"] },
            breed: { type: Type.STRING },
            visualDescription: { type: Type.STRING }
          },
          required: ["isAnimal"]
        }
      }
    });

    const idData = JSON.parse(idResponse.text || "{}");
    
    // VALIDATION: Reject non-animals
    // STRICT CHECK: We use !== true to catch undefined, null, or false.
    if (idData.isAnimal !== true) {
      throw new Error("We couldn't spot a pet in this photo! Please upload a clear photo of your animal friend.");
    }

    const species = idData.species as Species || Species.OTHER;
    const breed = idData.breed || "Unknown Mix";
    const description = idData.visualDescription || "A cute pet";

    // Step 2: Generate Portrait
    // Using gemini-2.5-flash-image for generation
    const genPrompt = `Generate a cute, high-quality, vibrant, sticker-style vector art portrait of a ${breed} ${species}. 
    Appearance: ${description}. 
    The background should be a solid soft circle color.
    Ensure the face is clearly visible and cute.`;

    let portraitUrl = undefined;

    try {
      const genResponse = await ai.models.generateContent({
        model: IMAGE_GEN_MODEL,
        contents: {
          parts: [{ text: genPrompt }]
        },
        config: {
          // No responseMimeType for image gen models
        }
      });

      // Extract image from response
      for (const part of genResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          portraitUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (e) {
      console.warn("Portrait generation failed, using fallback", e);
    }

    return {
      id: crypto.randomUUID(),
      name,
      age,
      weight,
      species,
      breed,
      avatarColor: '#10b981', // Fallback
      originalImage: imageBase64,
      portraitUrl: portraitUrl
    };
  },

  /**
   * Analyzes food from image OR barcode context.
   */
  analyzeFood: async (
    pet: Pet,
    input: { type: 'IMAGE' | 'BARCODE', data: string, additionalContext?: string }
  ): Promise<CheckResult> => {
    
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Localization context
    const lang = localization.language; 
    const unit = localization.unitSystem;

    // Pet Health Context
    const healthContext = `
      Allergies: ${pet.allergies?.join(', ') || 'None known'}.
      Conditions: ${pet.conditions?.join(', ') || 'None known'}.
    `;

    const systemPrompt = `
      You are an expert veterinary assistant.
      
      **Pet Profile:**
      - Name: ${pet.name}
      - Species/Breed: ${pet.breed} ${pet.species}
      - Age: ${pet.age}
      - Weight: ${pet.weight}kg
      - **CRITICAL HEALTH CONTEXT**: ${healthContext}

      **User Preferences:**
      - Language: Respond STRICTLY in ${lang === 'en' ? 'English' : lang === 'de' ? 'German' : lang === 'es' ? 'Spanish' : 'Turkish'}.
      - Units: Use ${unit === 'imperial' ? 'Imperial (lbs, oz)' : 'Metric (kg, g)'} for portions.

      **Task:** 
      1. Analyze the input (Image or Product Name via Barcode).
      2. Identify the food item.
      3. Determine safety.
      4. **CHECK SPECIFIC ALLERGIES**: If the pet is allergic to Chicken and the food is "Chicken Jerky", this is DANGEROUS.
      5. **CHECK HEALTH CONDITIONS**: If the pet has Diabetes and the food is high sugar, this is DANGEROUS or CAUTION.
      
      **Output Rules:**
      - If safe, provide max portion for a ${pet.weight}kg animal.
      - If toxic or allergic match, risk is DANGEROUS.
    `;

    const parts = [];
    if (input.type === 'IMAGE') {
      const cleanBase64 = input.data.split(',')[1] || input.data;
      parts.push({ text: "What is this and is it safe for my pet?" });
      parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
    } else {
      // Barcode lookup simulated by passing the product name found by the scanner logic (passed in additionalContext)
      parts.push({ text: `I scanned a barcode. The product is "${input.additionalContext}". Is this safe for my pet?` });
    }

    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedFoodName: { type: Type.STRING, description: "The name of the food or object identified" },
            canEat: { type: Type.BOOLEAN },
            riskLevel: { 
              type: Type.STRING, 
              enum: [RiskLevel.SAFE, RiskLevel.CAUTION, RiskLevel.DANGEROUS, RiskLevel.UNKNOWN] 
            },
            shortSummary: { type: Type.STRING },
            detailedExplanation: { type: Type.STRING },
            maxPortionGrams: { type: Type.NUMBER, nullable: true },
            emergencyWarning: { type: Type.STRING, nullable: true, description: "Alert if toxic or allergic match" },
            disclaimer: { type: Type.STRING }
          },
          required: ["detectedFoodName", "canEat", "riskLevel", "shortSummary", "detailedExplanation", "disclaimer"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as CheckResult;
  }
};
