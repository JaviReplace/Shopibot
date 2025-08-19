//require("dotenv").config();
require("dotenv").config({ path: __dirname + "/../.env" });


const OpenAI = require("openai")
console.log("API KEY leída:", process.env.OPENAI_API_KEY?.slice(0, 10));

const openaiApiKey = process.env.OPENAI_API_KEY;

const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(envPath)) {
    console.log("📂 Encontré el archivo .env en:", envPath);
} else {
    console.warn("⚠️ No encontré .env en:", envPath);
}

require("dotenv").config({ path: envPath });

const chat = async (prompt, text) => {
    try {
        const openai = new OpenAI({
            apiKey: openaiApiKey,
        });
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: text },
            ],
        });
        const answ = completion.choices[0].message.content
        console.log(answ)
        return answ;
    } catch (err) {
        console.error("Error al conectar con OpenAI:", err);
        return "ERROR";
    }
};

module.exports = chat;