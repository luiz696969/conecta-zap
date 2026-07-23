// Inscreve o app na conta WhatsApp Business (WABA) para receber webhooks
// Uso: node src/assinar-waba.js
require("dotenv").config();
const axios = require("axios");

const WABA_ID = "1004073182633028"; // ID da sua conta WhatsApp Business (veio no payload do webhook)
const H = { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` };

(async () => {
  try {
    const antes = await axios.get(`https://graph.facebook.com/v25.0/${WABA_ID}/subscribed_apps`, { headers: H });
    console.log("Apps inscritos antes:", JSON.stringify(antes.data));

    const r = await axios.post(`https://graph.facebook.com/v25.0/${WABA_ID}/subscribed_apps`, {}, { headers: H });
    console.log("Inscrição:", JSON.stringify(r.data));

    const depois = await axios.get(`https://graph.facebook.com/v25.0/${WABA_ID}/subscribed_apps`, { headers: H });
    console.log("Apps inscritos depois:", JSON.stringify(depois.data));
  } catch (e) {
    console.error("Erro:", JSON.stringify(e.response?.data || e.message));
  }
})();
