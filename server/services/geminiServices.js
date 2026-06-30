// geminiservices.js
const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateGeminiResponse = async (prompt, retries = 3, delayMs = 1500) => {
    try {
        const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                // System instructions force the model to respect your object keys
                systemInstruction: {
                    parts: [{ text: "You are a structural data generator. You must return valid JSON matching the schema expected by the application: subTopics, questions (short, long, diagram), revisionPoints, charts, diagram." }]
                },
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (response.status === 503 || response.status === 429) {
            if (retries > 0) {
                console.warn(`[Gemini API Warning]: Server busy (${response.status}). Retrying...`);
                await delay(delayMs);
                return await generateGeminiResponse(prompt, retries - 1, delayMs * 2);
            }
        }

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Gemini API HTTP ${response.status}: ${errorDetails}`);
        }

        const data = await response.json();
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!text) throw new Error("No text found in Gemini response");

        // Clean & Parse JSON safely
        text = text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];

        const parsedJSON = JSON.parse(text);
        
        // Critical Fallbacks
        if (!parsedJSON.subTopics) parsedJSON.subTopics = { "⭐": [], "⭐⭐": [], "⭐⭐⭐": [] };
        if (!parsedJSON.questions) parsedJSON.questions = { short: [], long: [], diagram: "" };
        if (!parsedJSON.questions.short) parsedJSON.questions.short = [];
        if (!parsedJSON.questions.long) parsedJSON.questions.long = [];
        if (!parsedJSON.revisionPoints) parsedJSON.revisionPoints = [];
        if (!parsedJSON.charts) parsedJSON.charts = [];
        if (!parsedJSON.diagram) parsedJSON.diagram = { type: "flowchart", data: "" };

        return parsedJSON;
        
    } catch (error) {
        console.error("Detailed Error in generateGeminiResponse:", error.message || error);
        throw error; // Re-throw so generateNotes catches it
    }
};