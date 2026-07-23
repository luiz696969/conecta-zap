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
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Simulador Conecta-Zap</title>
<style>
  * { box-sizing: border-box }
  body { font-family: Arial, sans-serif; background: #e5ddd5; margin: 0; height: 100vh; display: flex; flex-direction: column; }
  header { background: #075e54; color: #fff; padding: 10px 16px; flex: none; }
  header small { opacity: .8 }
  #topo { background: #f0f0f0; padding: 8px 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; flex: none; }
  #chat { flex: 1; overflow-y: auto; padding: 16px; }
  #chat-inner { max-width: 620px; margin: 0 auto; }
  .msg { max-width: 75%; padding: 8px 12px; border-radius: 8px; margin: 6px 0; white-space: pre-wrap; font-size: 15px; }
  .bot { background: #fff; margin-right: auto; }
  .eu  { background: #dcf8c6; margin-left: auto; }
  .img { display: block; max-width: 100%; border-radius: 8px; margin-bottom: 6px; }
  #barra { background: #f0f0f0; display: flex; gap: 8px; padding: 10px 16px; flex: none; }
  input, button { font-size: 15px; padding: 10px; border-radius: 20px; border: 1px solid #ccc; }
  #texto { flex: 1 }
  button { background: #075e54; color: #fff; border: none; cursor: pointer; padding: 10px 16px; }
  #disparar { background: #128c7e }
</style>
</head>
<body>
<header><b>Simulador Conecta-Zap</b><br><small>Você é o idoso. O bot responde como no WhatsApp de verdade.</small></header>
<div id="topo">
  <label>Seu número: <input id="tel" value="5589994132059" size="14"></label>
  <button id="disparar" onclick="disparar()">⏰ Simular disparo das 9h</button>
</div>
<div id="chat"><div id="chat-inner"></div></div>
<div id="barra">
  <input id="texto" placeholder="Digite como se fosse o idoso... (ex.: quero participar)">
  <button onclick="enviar()">Enviar</button>
</div>
<script>
const chat = document.getElementById("chat");
const chatInner = document.getElementById("chat-inner");
let minhas = [];
let totalAnterior = -1;

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

  // Só redesenha e rola quando chega mensagem nova (não atrapalha quem está lendo)
  if (tudo.length === totalAnterior) return;
  totalAnterior = tudo.length;

  chatInner.innerHTML = tudo.map(m =>
    '<div class="msg ' + m.quem + '">' +
    (m.imagem ? '<img class="img" src="' + m.imagem + '" alt="infográfico">' : '') +
    m.texto.replace(/</g, "&lt;") + '</div>'
  ).join("");
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById("texto").addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });
setInterval(atualizar, 2000);
atualizar();
</script>
</body>
</html>`);
});

module.exports = router;
