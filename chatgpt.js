const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
const OpenAI = require("openai")

const openaiApiKey = process.env.OPENAI_API_KE;

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
