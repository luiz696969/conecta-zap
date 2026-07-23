// Disparo diário automático das pílulas
const cron = require("node-cron");
const db = require("./db");
const { enviarImagem, enviarTemplate } = require("./whatsapp");
const { PILULAS } = require("./pilulas");

async function dispararPilulas() {
  const ativos = db.listarAtivos();
  console.log(`[scheduler] disparo iniciado - ${ativos.length} contato(s) ativo(s)`);

  for (const contato of ativos) {
    const dia = contato.dia_atual + 1;
    const pilula = PILULAS.find((p) => p.dia === dia);
    if (!pilula) continue;

    const modoLivre = process.env.MODO_LIVRE === "true";
    const ok = modoLivre
      ? await enviarImagem(contato.telefone, pilula.imagem, pilula.texto)
      : await enviarTemplate(contato.telefone, pilula.template, pilula.imagem);

    if (ok) {
      db.avancarDia(contato.telefone);
      console.log(`[scheduler] pílula ${dia} enviada para ${contato.telefone}`);
    } else {
      console.error(`[scheduler] falha ao enviar pílula ${dia} para ${contato.telefone}`);
    }
  }
  console.log("[scheduler] disparo concluído");
}

function iniciar() {
  // MODO_TESTE=true: a cada 10 minutos (para testar o ciclo completo em ~2h)
  // Normal: todos os dias às 9h (horário de Teresina)
  const expressao = process.env.MODO_TESTE === "true" ? "*/10 * * * *" : "0 9 * * *";
  cron.schedule(expressao, dispararPilulas, { timezone: "America/Fortaleza" });
  console.log(`[scheduler] agendado (${expressao})`);
}

module.exports = { iniciar, dispararPilulas };
