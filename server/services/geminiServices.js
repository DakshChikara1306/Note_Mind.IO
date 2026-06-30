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
                systemInstruction: {
                    parts: [{ text: "You are a structural data generator. You must return valid JSON matching the schema expected by the application: subTopics, questions (short, long, diagram), revisionPoints, charts, diagram." }]
                },
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        // Handle temporary Google server throttling natively
        if (response.status === 503 || response.status === 429 || response.status === 500) {
            if (retries > 0) {
                console.warn(`[Gemini API Warning]: Server busy (${response.status}). Retrying attempt left: ${retries}...`);
                await delay(delayMs);
                return await generateGeminiResponse(prompt, retries - 1, delayMs * 1.5);
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

        // This line can throw a syntax error if Gemini formatting glitches
        const parsedJSON = JSON.parse(text); 
        
        // Critical Default Fallbacks
        if (!parsedJSON.subTopics) parsedJSON.subTopics = { "⭐": [], "⭐⭐": [], "⭐⭐⭐": [] };
        if (!parsedJSON.questions) parsedJSON.questions = { short: [], long: [], diagram: "" };
        if (!parsedJSON.questions.short) parsedJSON.questions.short = [];
        if (!parsedJSON.questions.long) parsedJSON.questions.long = [];
        if (!parsedJSON.revisionPoints) parsedJSON.revisionPoints = [];
        if (!parsedJSON.charts) parsedJSON.charts = [];
        if (!parsedJSON.diagram) parsedJSON.diagram = { type: "flowchart", data: "" };

        return parsedJSON;
        
    } catch (error) {
        // 💥 CRITICAL UPGRADE: If JSON parsing fails or another error occurs, 
        // retry the request to get a clean response string from Gemini.
        if (retries > 0) {
            console.error(`[Parsing/Network Exception]: ${error.message}. Re-querying Gemini nodes immediately...`);
            await delay(delayMs);
            return await generateGeminiResponse(prompt, retries - 1, delayMs * 1.5);
        }
        throw error; // If all retries fail, bubble up the error to generateNotes
    }
};