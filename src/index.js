// Conecta-Zap Bot - Projeto de Extensão (Trilha A: Idosos)
require("dotenv").config();
const express = require("express");
const webhook = require("./webhook");
const scheduler = require("./scheduler");
const simulador = require("./simulador");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(webhook);
app.use(simulador);

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
  console.log(`[bot] Conecta-Zap no ar na porta ${PORT}`);
  scheduler.iniciar();
});
