import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the required output structure for the slides
const outputSchema = {
    type: "object", 
    properties: {
        slides: {
            type: "array",
            description: "An array of slides for a presentation. MUST contain a minimum of 4 slides and a maximum of 8 slides.",
            items: {
                type: "object",
                properties: {
                    title: { type: "string", description: "The main title of the slide." },
                    content: { 
                        type: "array", 
                        description: "4-6 key bullet points covering the slide content. Use Markdown bolding (**text**) for emphasis.",
                        items: { type: "string" }
                    },
                    image_url: { type: "string", description: "A placeholder or sample image URL. This will be ignored in the final PPTX for stability." }, 
                },
                required: ["title", "content", "image_url"]
            },
        },
    },
    required: ["slides"]
};

export async function POST(request: Request) {
    try {
        const { prompt, currentSlides } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // --- CORE EDITING LOGIC: Dynamic System Instruction ---
        let systemInstruction: string;
        let userContent: string;
        
        if (currentSlides && Array.isArray(currentSlides) && currentSlides.length > 0) {
            // EDIT MODE
            systemInstruction = `You are a presentation editor. Your task is to update the provided JSON object of slides based on the user's specific editing request. You MUST return the complete, modified JSON object (including the outer 'slides' array) only. Do not add any commentary or surrounding text. The structure must strictly adhere to the defined schema.`;
            
            userContent = `CURRENT SLIDE JSON TO EDIT:\n\`\`\`json\n${JSON.stringify({ slides: currentSlides }, null, 2)}\n\`\`\`\n\nUSER EDIT REQUEST: "${prompt}"`;
            
        } else {
            // GENERATION MODE
            systemInstruction = `You are an expert presentation content generator. Your task is to generate a comprehensive presentation on the user's topic. You MUST return the slide content as a single JSON object (with a top-level 'slides' array), strictly adhering to the defined schema. Do not add any commentary or surrounding text.`;

            userContent = `TOPIC: "${prompt}"`;
        }
        // ---------------------------------------------

        const response = await ai.models.generateContent({
            // Using a high-quality model for better generation and editing reliability
            model: 'gemini-2.5-pro', 
            contents: [{ role: "user", parts: [{ text: userContent }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: outputSchema,
            },
        });

        // 1. TypeScript Safety Check (Fixes 'response.text is possibly undefined')
        const jsonText = response.text?.trim();

        if (!jsonText) {
            console.error('Gemini API returned no text content.', response);
            return NextResponse.json({ error: 'AI failed to generate a valid presentation structure.' }, { status: 500 });
        }
        
        // 2. Parse the JSON and return
        const slidesData = JSON.parse(jsonText);

        return NextResponse.json(slidesData, { status: 200 });

    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'Failed to generate content from AI.' }, { status: 500 });
    }
}