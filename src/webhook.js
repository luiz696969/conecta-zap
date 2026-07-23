// Webhook: recebe mensagens dos idosos
// Fluxo: 1ª mensagem = cadastro + boas-vindas | demais = gravadas como feedback/resposta
const express = require("express");
const db = require("./db");
const { enviarTexto } = require("./whatsapp");
const { BOAS_VINDAS } = require("./pilulas");

const router = express.Router();

// Verificação do webhook (a Meta chama uma vez ao configurar)
router.get("/webhook", (req, res) => {
  const modo = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (modo === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("[webhook] verificado com sucesso");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Recebimento de mensagens
router.post("/webhook", (req, res) => {
  res.sendStatus(200); // responde logo para a Meta não reenviar

  try {
    const valor = req.body.entry?.[0]?.changes?.[0]?.value;
    const msg = valor?.messages?.[0];
    if (!msg) return; // é status de entrega, não mensagem

    const telefone = msg.from;
    const nome = valor.contacts?.[0]?.profile?.name || "";
    const texto =
      msg.text?.body ||
      (msg.type === "audio" ? "[áudio recebido]" : `[${msg.type} recebido]`);

    console.log(`[webhook] mensagem de ${nome} (${telefone}): ${texto}`);

    const novo = db.cadastrar(telefone, nome);
    if (novo) {
      // Primeira mensagem: cadastro + boas-vindas automática
      enviarTexto(telefone, BOAS_VINDAS);
      console.log(`[webhook] novo cadastro: ${nome} (${telefone})`);
    } else {
      // Já cadastrado: grava a resposta (desafios, perguntas e nota final)
      db.salvarFeedback(telefone, texto);
      console.log(`[webhook] resposta gravada de ${telefone}`);
    }
  } catch (err) {
    console.error("[webhook] erro:", err.message);
  }
});

module.exports = router;
