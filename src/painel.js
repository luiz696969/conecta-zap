// Painel de controle: veja os cadastrados e dispare as pílulas quando quiser
// Acesse: https://SEU_APP.onrender.com/painel?chave=SUA_CHAVE (a chave é o VERIFY_TOKEN)
const express = require("express");
const db = require("./db");
const { dispararPilulas } = require("./scheduler");

const router = express.Router();

function autorizado(req) {
  return req.query.chave === process.env.VERIFY_TOKEN;
}

router.post("/painel/disparar", async (req, res) => {
  if (!autorizado(req)) return res.status(403).send("Chave errada");
  await dispararPilulas();
  res.json({ ok: true });
});

// Volta todo mundo para o dia 0 (testes repetidos)
router.post("/painel/resetar", (req, res) => {
  if (!autorizado(req)) return res.status(403).send("Chave errada");
  const n = db.resetarTrilha();
  res.json({ ok: true, contatos: n });
});

// Apaga todos os cadastros
router.post("/painel/limpar", (req, res) => {
  if (!autorizado(req)) return res.status(403).send("Chave errada");
  db.limparTudo();
  res.json({ ok: true });
});

router.get("/painel", (req, res) => {
  if (!autorizado(req)) return res.status(403).send("Acesso negado. Use /painel?chave=SUA_CHAVE");

  const contatos = db.carregar();
  const chave = req.query.chave;
  const linhas = contatos.map((c) => `
    <tr>
      <td>${(c.nome || "-").replace(/</g, "&lt;")}</td>
      <td>${c.telefone}</td>
      <td style="text-align:center">${c.dia_atual}/10</td>
      <td>${c.status}</td>
      <td style="text-align:center">${c.feedback.length}</td>
    </tr>`).join("");

  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel Conecta-Zap</title>
<style>
  body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 20px; }
  .box { max-width: 760px; margin: 0 auto; }
  h1 { color: #1F4E79; }
  .cards { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .card { background: #fff; border-radius: 10px; padding: 14px 22px; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
  .card b { font-size: 26px; color: #1F4E79; display: block; }
  table { width: 100%; background: #fff; border-collapse: collapse; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
  th, td { padding: 10px 12px; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
  th { background: #1F4E79; color: #fff; }
  .acoes { margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap; }
  button, a.btn { background: #1F4E79; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-size: 15px; cursor: pointer; text-decoration: none; display: inline-block; }
  #disparar { background: #128c7e; }
  #resetar { background: #b8860b; }
  #limpar { background: #a32d2d; }
  #aviso { margin: 10px 0; font-weight: bold; color: #128c7e; }
</style>
</head>
<body>
<div class="box">
  <h1>📊 Painel Conecta-Zap</h1>
  <div class="cards">
    <div class="card">Cadastrados<b>${contatos.length}</b></div>
    <div class="card">Ativos<b>${contatos.filter(c => c.status === "ativo").length}</b></div>
    <div class="card">Concluíram<b>${contatos.filter(c => c.status === "concluido").length}</b></div>
  </div>
  <div class="acoes">
    <button id="disparar" onclick="disparar()">🚀 Disparar pílula do dia agora</button>
    <button id="resetar" onclick="resetar()">🔁 Resetar trilha (dia 0)</button>
    <button id="limpar" onclick="limpar()">🗑 Apagar cadastros</button>
    <button onclick="location.reload()">🔄 Atualizar</button>
    <a class="btn" href="/relatorio" target="_blank">💾 Backup (JSON)</a>
  </div>
  <div id="aviso"></div>
  <table>
    <tr><th>Nome</th><th>Contato</th><th>Pílula</th><th>Status</th><th>Respostas</th></tr>
    ${linhas || '<tr><td colspan="5">Nenhum cadastrado ainda.</td></tr>'}
  </table>
</div>
<script>
async function disparar() {
  if (!confirm("Enviar a pílula do dia para todos os contatos ativos agora?")) return;
  document.getElementById("aviso").textContent = "Enviando...";
  const r = await fetch("/painel/disparar?chave=${chave}", { method: "POST" });
  document.getElementById("aviso").textContent = r.ok ? "✅ Disparo concluído! Clique em Atualizar." : "❌ Erro no disparo.";
}
async function resetar() {
  if (!confirm("Voltar TODOS os contatos para o dia 0 (trilha reiniciada)?")) return;
  const r = await fetch("/painel/resetar?chave=${chave}", { method: "POST" });
  document.getElementById("aviso").textContent = r.ok ? "✅ Trilha resetada! Dispare para receber a pílula 1." : "❌ Erro.";
}
async function limpar() {
  if (!confirm("Apagar TODOS os cadastros? Isso não tem volta.")) return;
  const r = await fetch("/painel/limpar?chave=${chave}", { method: "POST" });
  if (r.ok) location.reload();
}
</script>
</body>
</html>`);
});

module.exports = router;
