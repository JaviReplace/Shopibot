const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const chatGPT = require('./chatgpt');
//require("dotenv").config()
//require("dotenv").config({ path: __dirname + "/../.env" });

const promptPath = path.resolve(__dirname, 'prompt.txt');
let systemPrompt = '';
try {
  let raw = fs.readFileSync(promptPath, 'utf8');
  let txt = raw.trim();
  // Extraer si viene envuelto como const promtp = """..."""
  const triple = txt.match(/"""([\s\S]*?)"""/);
  if (triple) {
    txt = triple[1];
  } else {
    // Extraer si viene como const x = '...'; o "..." o `...`
    const backtick = txt.match(/=\`([\s\S]*?)\`;?$/m);
    const singleOrDouble = txt.match(/=['\"]([\s\S]*?)['\"];?$/m);
    if (backtick) txt = backtick[1];
    else if (singleOrDouble) txt = singleOrDouble[1];
  }
  systemPrompt = txt.trim();
} catch (e) {
  console.error('No se pudo leer prompt.txt, usando prompt por defecto.', e);
  systemPrompt = 'Eres un asistente útil.';
}

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')

const flowChatGPT = addKeyword(['chatgpt', 'ia', 'inteligencia artificial'])
    .addAnswer('🤖 Conectando con ChatGPT...', { capture: true },
        async (ctx, ctxfn) => {
            //const systemPrompt2 = promptManager.getPrompt()
            const response = await chatGPT(systemPrompt, ctx.body)
            await ctxfn.flowDynamic(response)
        })


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowChatGPT])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
