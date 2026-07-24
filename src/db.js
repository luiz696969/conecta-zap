// Banco de dados simples em arquivo JSON (suficiente para 10-15 contatos)
const fs = require("fs");
const path = require("path");

const ARQUIVO = path.join(__dirname, "..", "data", "contatos.json");

function carregar() {
  if (!fs.existsSync(ARQUIVO)) return [];
  return JSON.parse(fs.readFileSync(ARQUIVO, "utf8"));
}

function salvar(contatos) {
  fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true });
  fs.writeFileSync(ARQUIVO, JSON.stringify(contatos, null, 2));
}

function buscar(telefone) {
  return carregar().find((c) => c.telefone === telefone) || null;
}

function cadastrar(telefone, nome) {
  const contatos = carregar();
  if (contatos.some((c) => c.telefone === telefone)) return false; // já cadastrado
  contatos.push({
    telefone,
    nome: nome || "",
    dia_atual: 0,
    data_cadastro: new Date().toISOString(),
    status: "ativo",
    feedback: []
  });
  salvar(contatos);
  return true;
}

function listarAtivos() {
  return carregar().filter((c) => c.status === "ativo");
}

function avancarDia(telefone) {
  const contatos = carregar();
  const c = contatos.find((x) => x.telefone === telefone);
  if (!c) return;
  c.dia_atual += 1;
  if (c.dia_atual >= 10) c.status = "concluido";
  salvar(contatos);
}

function salvarFeedback(telefone, mensagem) {
  const contatos = carregar();
  const c = contatos.find((x) => x.telefone === telefone);
  if (!c) return;
  c.feedback.push({ data: new Date().toISOString(), mensagem });
  salvar(contatos);
}

// Volta todos os contatos para o dia 0 (útil para testes repetidos)
function resetarTrilha() {
  const contatos = carregar();
  contatos.forEach((c) => {
    c.dia_atual = 0;
    c.status = "ativo";
    c.feedback = [];
  });
  salvar(contatos);
  return contatos.length;
}

// Apaga todos os cadastros
function limparTudo() {
  salvar([]);
}

module.exports = { carregar, buscar, cadastrar, listarAtivos, avancarDia, salvarFeedback, resetarTrilha, limparTudo };
