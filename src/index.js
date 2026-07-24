// Conecta-Zap Bot - Projeto de Extensão (Trilha A: Idosos)
require("dotenv").config();
const express = require("express");
const webhook = require("./webhook");
const scheduler = require("./scheduler");
const simulador = require("./simulador");
const telegram = require("./telegram");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(webhook);
app.use(simulador);
app.use(telegram.router);
app.use(require("./painel"));

// Página inicial: status do bot (útil para mostrar no vídeo demo)
app.get("/", (req, res) => {
  const contatos = db.carregar();
  res.json({
    projeto: "Conecta-Zap - Letramento Digital para Idosos",
    status: "no ar",
    cadastrados: contatos.length,
    ativos: contatos.filter((c) => c.status === "ativo").length,
    concluidos: contatos.filter((c) => c.status === "concluido").length
  });
});

// Política de privacidade (exigida pela Meta para publicar o app)
app.get("/privacidade", (req, res) => {
  res.send(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Política de Privacidade - Conecta-Zap</title></head>
<body style="font-family:Arial;max-width:700px;margin:40px auto;padding:0 16px;line-height:1.6">
<h1>Política de Privacidade — Conecta-Zap</h1>
<p>O Conecta-Zap é um projeto de extensão acadêmica (iCEV) sem fins lucrativos, que envia dicas educativas de letramento digital para idosos via WhatsApp.</p>
<h2>Dados coletados</h2>
<p>Armazenamos apenas: número de telefone, primeiro nome do perfil do WhatsApp e as respostas enviadas ao projeto. Nada mais.</p>
<h2>Uso dos dados</h2>
<p>Os dados são usados exclusivamente para enviar as 10 mensagens educativas do projeto e medir seu impacto de forma anônima no relatório acadêmico. Não vendemos nem compartilhamos dados com terceiros.</p>
<h2>Cancelamento e exclusão</h2>
<p>O participante pode sair a qualquer momento respondendo "SAIR". Para excluir seus dados, basta solicitar pelo próprio WhatsApp ou pelo e-mail luizjogador9@gmail.com.</p>
<h2>Contato</h2>
<p>Responsável: equipe do projeto Conecta-Zap — iCEV, Teresina-PI. E-mail: luizjogador9@gmail.com</p>
</body></html>`);
});

// Relatório de impacto: alcance + feedback coletado
app.get("/relatorio", (req, res) => {
  const contatos = db.carregar();
  res.json({
    total_cadastrados: contatos.length,
    concluiram_trilha: contatos.filter((c) => c.status === "concluido").length,
    feedbacks: contatos.map((c) => ({
      nome: c.nome,
      dia_atual: c.dia_atual,
      status: c.status,
      respostas: c.feedback
    }))
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[bot] Conecta-Zap no ar na porta ${PORT} (canal: ${process.env.CANAL || "whatsapp"})`);
  scheduler.iniciar();
  // No Render, RENDER_EXTERNAL_URL é preenchida automaticamente
  const urlBase = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL;
  if (urlBase) telegram.configurarWebhook(urlBase);
});
