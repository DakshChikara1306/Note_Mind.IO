// geminiservices.js
const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Helper function to create an asynchronous delay timeout
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateGeminiResponse = async (prompt, retries = 3, delayMs = 1500) => {
    try {
        const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        // Handle temporary 503 Overloaded or 429 Throttled server responses smoothly
        if (response.status === 503 || response.status === 429) {
            if (retries > 0) {
                console.warn(`[Gemini API Warning]: Server busy (${response.status}). Retrying execution loop in ${delayMs}ms... (${retries} retries remaining)`);
                await delay(delayMs);
                // Recursively pass the action back down the pipe, doubling the backoff timer length
                return await generateGeminiResponse(prompt, retries - 1, delayMs * 2);
            }
        }

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error generating Gemini response: ${response.statusText} - ${errorDetails}`);
        }

        const data = await response.json();
        
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!text) {
            throw new Error("No text found in Gemini response");
        }

        // 1. Clean explicit markdown formatting tags if present
        text = text.trim();
        text = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

        // 2. Extract ONLY the pure JSON structure from the response.
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        } else {
            throw new Error("Failed to isolate structural JSON data boundaries from raw response payload.");
        }

        // 3. Safe parse fallback: handle cases where Gemini returns an escaped string payload
        if (text.startsWith('"') && text.endsWith('"')) {
            try {
                text = JSON.parse(text);
            } catch {
                // Not a double-serialized string, keep original text
            }
        }

        // 4. Structural Parse & Shield
        const parsedJSON = JSON.parse(text);
        
        // Critical Fallbacks to ensure frontend components never map over missing keys
        if (!parsedJSON.subTopics) parsedJSON.subTopics = { "⭐": [], "⭐⭐": [], "⭐⭐⭐": [] };
        if (!parsedJSON.questions) parsedJSON.questions = { short: [], long: [], diagram: "" };
        if (!parsedJSON.questions.short) parsedJSON.questions.short = [];
        if (!parsedJSON.questions.long) parsedJSON.questions.long = [];
        if (!parsedJSON.revisionPoints) parsedJSON.revisionPoints = [];
        if (!parsedJSON.charts) parsedJSON.charts = [];
        if (!parsedJSON.diagram) parsedJSON.diagram = { type: "flowchart", data: "" };

        return parsedJSON;
        
    } catch (error) {
        console.error("Error in generateGeminiResponse:", error);
        throw error;
    }
};