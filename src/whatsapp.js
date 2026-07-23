// Funções de envio via WhatsApp Cloud API (Meta)
const axios = require("axios");

const URL = () =>
  `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`;

// Caixa de saída do modo simulação (MODO_SIMULACAO=true):
// as mensagens ficam aqui em vez de irem para a Meta
const caixaSaida = [];

async function enviar(payload) {
  if (process.env.MODO_SIMULACAO === "true") {
    const texto =
      payload.text?.body ||
      payload.image?.caption ||
      `[template ${payload.template?.name}]`;
    caixaSaida.push({
      para: payload.to,
      tipo: payload.type,
      imagem: payload.image?.link || null,
      texto,
      data: new Date().toISOString()
    });
    console.log(`[simulação] mensagem para ${payload.to}: ${texto.slice(0, 60)}...`);
    return { simulado: true };
  }
  try {
    const r = await axios.post(URL(), payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    return r.data;
  } catch (err) {
    console.error("[whatsapp] erro ao enviar:", err.response?.data || err.message);
    return null;
  }
}

// Texto simples (válido dentro da janela de 24h após mensagem do usuário)
function enviarTexto(telefone, texto) {
  return enviar({
    messaging_product: "whatsapp",
    to: telefone,
    type: "text",
    text: { body: texto }
  });
}

// Imagem com legenda (válido dentro da janela de 24h)
function enviarImagem(telefone, urlImagem, legenda) {
  return enviar({
    messaging_product: "whatsapp",
    to: telefone,
    type: "image",
    image: { link: urlImagem, caption: legenda }
  });
}

// Template aprovado na Meta com imagem no cabeçalho
// (obrigatório fora da janela de 24h - usar na operação real)
function enviarTemplate(telefone, nomeTemplate, urlImagem) {
  return enviar({
    messaging_product: "whatsapp",
    to: telefone,
    type: "template",
    template: {
      name: nomeTemplate,
      language: { code: "pt_BR" },
      components: [
        {
          type: "header",
          parameters: [{ type: "image", image: { link: urlImagem } }]
        }
      ]
    }
  });
}

module.exports = { enviarTexto, enviarImagem, enviarTemplate, caixaSaida };
