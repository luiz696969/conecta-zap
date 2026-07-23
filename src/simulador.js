// Ambiente de teste local: simula o WhatsApp do idoso no navegador
// Acesse http://localhost:3000/simulador com MODO_SIMULACAO=true no .env
const express = require("express");
const { caixaSaida } = require("./whatsapp");
const { dispararPilulas } = require("./scheduler");

const router = express.Router();

// Mensagens que o "bot" enviou para um número
router.get("/simulador/caixa", (req, res) => {
  const tel = req.query.telefone;
  res.json(caixaSaida.filter((m) => m.para === tel));
});

// Simula o cron das 9h (o disparo diário)
router.post("/simulador/disparar", async (req, res) => {
  await dispararPilulas();
  res.json({ ok: true });
});

// Página do simulador (chat estilo WhatsApp)
router.get("/simulador", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Simulador Conecta-Zap</title>
<style>
  body { font-family: Arial, sans-serif; background: #e5ddd5; margin: 0; }
  header { background: #075e54; color: #fff; padding: 12px 16px; }
  header small { opacity: .8 }
  #chat { max-width: 620px; margin: 0 auto; padding: 16px; min-height: 60vh; }
  .msg { max-width: 75%; padding: 8px 12px; border-radius: 8px; margin: 6px 0; white-space: pre-wrap; font-size: 15px; }
  .bot { background: #fff; margin-right: auto; }
  .eu  { background: #dcf8c6; margin-left: auto; }
  .img { font-size: 12px; color: #555; border: 1px dashed #999; padding: 4px 8px; border-radius: 6px; margin-bottom: 4px; }
  #barra { max-width: 620px; margin: 0 auto; display: flex; gap: 8px; padding: 12px 16px 24px; }
  input, button { font-size: 15px; padding: 10px; border-radius: 20px; border: 1px solid #ccc; }
  #texto { flex: 1 }
  button { background: #075e54; color: #fff; border: none; cursor: pointer; padding: 10px 16px; }
  #topo { max-width: 620px; margin: 0 auto; padding: 10px 16px; display: flex; gap: 8px; align-items: center; }
  #disparar { background: #128c7e }
</style>
</head>
<body>
<header><b>Simulador Conecta-Zap</b><br><small>Você é o idoso. O bot responde como no WhatsApp de verdade.</small></header>
<div id="topo">
  <label>Seu número: <input id="tel" value="5589994132059" size="14"></label>
  <button id="disparar" onclick="disparar()">⏰ Simular disparo das 9h</button>
</div>
<div id="chat"></div>
<div id="barra">
  <input id="texto" placeholder="Digite como se fosse o idoso... (ex.: quero participar)">
  <button onclick="enviar()">Enviar</button>
</div>
<script>
const chat = document.getElementById("chat");
let minhas = [];

function tel() { return document.getElementById("tel").value.trim(); }

async function enviar() {
  const t = document.getElementById("texto");
  if (!t.value.trim()) return;
  minhas.push({ texto: t.value, data: new Date().toISOString() });
  await fetch("/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry: [{ changes: [{ value: {
      contacts: [{ profile: { name: "Idoso Simulado" } }],
      messages: [{ from: tel(), type: "text", text: { body: t.value } }]
    } }] }] })
  });
  t.value = "";
  atualizar();
}

async function disparar() {
  await fetch("/simulador/disparar", { method: "POST" });
  setTimeout(atualizar, 400);
}

async function atualizar() {
  const r = await fetch("/simulador/caixa?telefone=" + tel());
  const doBot = await r.json();
  const tudo = [
    ...minhas.map(m => ({ ...m, quem: "eu" })),
    ...doBot.map(m => ({ ...m, quem: "bot" }))
  ].sort((a, b) => a.data.localeCompare(b.data));
  chat.innerHTML = tudo.map(m =>
    '<div class="msg ' + m.quem + '">' +
    (m.imagem ? '<div class="img">🖼 infográfico: ' + m.imagem + '</div>' : '') +
    m.texto.replace(/</g, "&lt;") + '</div>'
  ).join("");
  window.scrollTo(0, document.body.scrollHeight);
}

document.getElementById("texto").addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });
setInterval(atualizar, 2000);
atualizar();
</script>
</body>
</html>`);
});

module.exports = router;
