// Teste rápido de envio: node src/teste-envio.js 5586999999999
// (o número precisa estar na lista de destinatários de teste da Meta)
require("dotenv").config();
const { enviarTexto } = require("./whatsapp");

const numero = process.argv[2];
if (!numero) {
  console.log("Uso: node src/teste-envio.js 5586999999999 (código do país + DDD + número)");
  process.exit(1);
}

enviarTexto(numero, "Teste do Conecta-Zap funcionando! ✅🤖").then((r) => {
  if (r) console.log("Mensagem enviada com sucesso! Confira seu WhatsApp.");
  else console.log("Falhou. Confira o token, o Phone Number ID e se o número está na lista de teste da Meta.");
});
