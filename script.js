const generateBtn = document.getElementById("generate-btn");
const promptInput = document.getElementById("prompt-input");
const resultContainer = document.getElementById("result-container");
const resultEl = document.getElementById("result");

// This now points to our secure serverless function
const API_URL = `/.netlify/functions/generate`;

generateBtn.addEventListener("click", () => {
    const prompt = promptInput.value;
    if (prompt) {
        generateContent(prompt);
    }
});

promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        generateBtn.click();
    }
});

window.addEventListener("load", () => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    if (prompt) {
        promptInput.value = prompt;
        generateContent(prompt);
    }
});

async function generateContent(prompt) {
    resultContainer.style.display = "block";
    resultEl.textContent = "Generating...";

    try {
        // We send the prompt to our serverless function, not directly to Google
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData ? errorData.error : `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        resultEl.textContent = data.text;

    } catch (error) {
        console.error("Error:", error);
        resultEl.textContent = `An error occurred: ${error.message}. Please check the console for details.`;
    }
}