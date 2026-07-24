// Canal Telegram: recebimento (webhook) e envio das pílulas
// Crie o bot com o @BotFather e coloque TELEGRAM_TOKEN no .env / Render
const express = require("express");
const axios = require("axios");
const db = require("./db");
const { BOAS_VINDAS } = require("./pilulas");

const API = () => `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

// ---------- Envio ----------
async function chamar(metodo, payload) {
  try {
    const r = await axios.post(`${API()}/${metodo}`, payload);
    return r.data;
  } catch (err) {
    console.error(`[telegram] erro em ${metodo}:`, JSON.stringify(err.response?.data || err.message));
    return null;
  }
}

function enviarTexto(chatId, texto) {
  return chamar("sendMessage", { chat_id: chatId, text: texto });
}

// Envia a imagem; se o texto couber na legenda (limite 1024), vai junto. Senão, manda em seguida.
async function enviarImagem(chatId, urlImagem, texto) {
  if (texto && texto.length <= 1000) {
    return chamar("sendPhoto", { chat_id: chatId, photo: urlImagem, caption: texto });
  }
  const foto = await chamar("sendPhoto", { chat_id: chatId, photo: urlImagem });
  const msg = await enviarTexto(chatId, texto);
  return foto && msg;
}

// Registra o webhook na API do Telegram (chamado no boot do servidor)
async function configurarWebhook(urlBase) {
  if (!process.env.TELEGRAM_TOKEN) return;
  const url = `${urlBase}/telegram/webhook`;
  const r = await chamar("setWebhook", { url });
  console.log(`[telegram] webhook configurado em ${url}:`, JSON.stringify(r));
}

// ---------- Recebimento ----------
const router = express.Router();

router.post("/telegram/webhook", (req, res) => {
  res.sendStatus(200);
  try {
    const msg = req.body.message;
    if (!msg) return;

    const chatId = String(msg.chat.id);
    const nome = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ");
    const texto = msg.text || (msg.voice ? "[áudio recebido]" : "[mídia recebida]");

    console.log(`[telegram] mensagem de ${nome} (${chatId}): ${texto}`);

    const novo = db.cadastrar(chatId, nome);
    if (novo) {
      enviarTexto(chatId, BOAS_VINDAS);
      console.log(`[telegram] novo cadastro: ${nome} (${chatId})`);
    } else if (texto !== "/start") {
      db.salvarFeedback(chatId, texto);
      console.log(`[telegram] resposta gravada de ${chatId}`);
    }
  } catch (err) {
    console.error("[telegram] erro no webhook:", err.message);
  }
});

module.exports = { router, enviarTexto, enviarImagem, configurarWebhook };
