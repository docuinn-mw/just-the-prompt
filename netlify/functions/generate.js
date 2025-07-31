const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { prompt } = JSON.parse(event.body);
    const API_KEY = process.env.API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const modifiedPrompt = `You are writing a message to someone else. Your task is to write a single, complete, and heartfelt message that expresses the following sentiment: '${prompt}'. The message should be detailed, at least three sentences long, and sound very sincere. Tend towards verbosity. Feel free to use emojis, bullet points and sections. Do not provide multiple options or variations.`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: modifiedPrompt
                    }]
                }]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData ? JSON.stringify(errorData.error) : `HTTP error! status: ${response.status}`;
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorMessage })
            };
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ text })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
