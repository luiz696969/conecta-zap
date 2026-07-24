// Disparo diário automático das pílulas
const cron = require("node-cron");
const db = require("./db");
const whatsapp = require("./whatsapp");
const telegram = require("./telegram");
const { PILULAS } = require("./pilulas");

async function dispararPilulas() {
  const ativos = db.listarAtivos();
  const canal = process.env.CANAL || "whatsapp";
  console.log(`[scheduler] disparo iniciado (${canal}) - ${ativos.length} contato(s) ativo(s)`);

  for (const contato of ativos) {
    const dia = contato.dia_atual + 1;
    const pilula = PILULAS.find((p) => p.dia === dia);
    if (!pilula) continue;

    let ok;
    if (canal === "telegram") {
      ok = await telegram.enviarImagem(contato.telefone, pilula.imagem, pilula.texto);
    } else {
      const modoLivre = process.env.MODO_LIVRE === "true";
      ok = modoLivre
        ? await whatsapp.enviarImagem(contato.telefone, pilula.imagem, pilula.texto)
        : await whatsapp.enviarTemplate(contato.telefone, pilula.template, pilula.imagem);
    }

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
