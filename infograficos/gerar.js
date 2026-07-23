// Gerador dos 10 infográficos do Conecta-Zap (IA)
// Diretrizes de acessibilidade do edital: letras grandes, alto contraste, uma ideia por imagem.
// Uso: node infograficos/gerar.js  (gera os .svg; converta para .png com ImageMagick/Inkscape ou use os SVGs)
const fs = require("fs");
const path = require("path");

const AZUL = "#1F4E79";
const AZUL_CLARO = "#D6E4F0";
const LARANJA = "#E07B00";
const BRANCO = "#FFFFFF";
const PRETO = "#1A1A1A";

function esc(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Quebra texto em até 2 linhas
function linhas(t, max) {
  if (t.length <= max) return [t];
  const palavras = t.split(" ");
  let l1 = "";
  let i = 0;
  while (i < palavras.length && (l1 + " " + palavras[i]).trim().length <= max) {
    l1 = (l1 + " " + palavras[i]).trim(); i++;
  }
  return [l1, palavras.slice(i).join(" ")];
}

function infografico({ num, titulo, subtitulo, itens, cta }) {
  const W = 1080, H = 1080;
  const tituloLinhas = linhas(titulo, 24);
  const tituloY = tituloLinhas.length === 1 ? 165 : 135;

  let itensSvg = "";
  const areaTopo = 290, areaFim = 895;
  const passo = (areaFim - areaTopo) / itens.length;
  itens.forEach((item, i) => {
    const cy = areaTopo + passo * i + passo / 2;
    const ls = linhas(item, 28);
    const textoY = ls.length === 1 ? cy + 16 : cy - 8;
    itensSvg += `
    <circle cx="120" cy="${cy}" r="52" fill="${LARANJA}"/>
    <text x="120" y="${cy + 26}" font-size="72" font-weight="bold" fill="${BRANCO}" text-anchor="middle" font-family="DejaVu Sans">${i + 1}</text>
    ${ls.map((l, j) => `<text x="210" y="${textoY + j * 52}" font-size="44" font-weight="bold" fill="${PRETO}" font-family="DejaVu Sans">${esc(l)}</text>`).join("")}`;
  });

  const ctaLinhas = linhas(cta, 42);
  const ctaY = ctaLinhas.length === 1 ? 1010 : 990;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BRANCO}"/>
  <rect width="${W}" height="230" fill="${AZUL}"/>
  <text x="60" y="70" font-size="34" font-weight="bold" fill="${AZUL_CLARO}" font-family="DejaVu Sans">CONECTA-ZAP  •  P&#205;LULA ${num} DE 10</text>
  ${tituloLinhas.map((l, j) => `<text x="60" y="${tituloY + j * 62}" font-size="58" font-weight="bold" fill="${BRANCO}" font-family="DejaVu Sans">${esc(l)}</text>`).join("")}
  <text x="60" y="272" font-size="40" font-weight="bold" fill="${AZUL}" font-family="DejaVu Sans">${esc(subtitulo)}</text>
  ${itensSvg}
  <rect y="925" width="${W}" height="155" fill="${AZUL_CLARO}"/>
  ${ctaLinhas.map((l, j) => `<text x="540" y="${ctaY + j * 50}" font-size="42" font-weight="bold" fill="${AZUL}" text-anchor="middle" font-family="DejaVu Sans">${esc(l)}</text>`).join("")}
</svg>`;
}

const PILULAS = [
  { num: 1, titulo: "Bem-vindo ao Conecta-Zap!", subtitulo: "Como funciona:",
    itens: ["São 10 dias de dicas", "Chega 1 mensagem por dia", "É de graça, leia no seu tempo"],
    cta: "Desafio: responda com um áudio dizendo OI" },
  { num: 2, titulo: "Golpe do falso parente", subtitulo: "Desconfie destes 3 sinais:",
    itens: ["Número novo e desconhecido", "Pedido de dinheiro", "Muita pressa"],
    cta: "Na dúvida, LIGUE para o número antigo" },
  { num: 3, titulo: "Banco não pede senha!", subtitulo: "Guarde bem isto:",
    itens: ["Banco não liga pedindo senha", "Nunca passe códigos", "Pode desligar sem medo"],
    cta: "Anote os 3 sinais em um papel" },
  { num: 4, titulo: "Proteja seu WhatsApp", subtitulo: "Ative a confirmação em duas etapas:",
    itens: ["Toque em Configurações", "Toque em Conta", "Confirmação em duas etapas: Ativar"],
    cta: "Nunca passe o código de 6 números" },
  { num: 5, titulo: "Conhecendo o Gov.br", subtitulo: "Crie sua conta pelo celular:",
    itens: ["Baixe o aplicativo Gov.br", "Digite seu CPF", "Crie uma senha sua", "Confirme seus dados"],
    cta: "Vá com calma. Você consegue!" },
  { num: 6, titulo: "Saúde na palma da mão", subtitulo: "No aplicativo Meu SUS Digital você vê:",
    itens: ["Carteira de vacinação", "Exames e consultas", "Entre com a conta Gov.br"],
    cta: "Desafio: baixe o Meu SUS Digital hoje" },
  { num: 7, titulo: "Cuidado com notícias falsas", subtitulo: "Antes de compartilhar, faça os 3 testes:",
    itens: ["Quem enviou?", "Saiu em jornal conhecido?", "Pede pressa ou causa medo?"],
    cta: "Na dúvida, NÃO compartilhe" },
  { num: 8, titulo: "Videochamada com a família", subtitulo: "É fácil e de graça:",
    itens: ["Abra a conversa da pessoa", "Toque na câmera no alto", "Para atender, arraste o verde"],
    cta: "Desafio: ligue para alguém querido hoje" },
  { num: 9, titulo: "Pix com segurança", subtitulo: "Regra de ouro:",
    itens: ["Confira o NOME antes de confirmar", "Nome estranho? Não confirme", "Coloque limite no app do banco"],
    cta: "Sempre confira o nome. Sempre!" },
  { num: 10, titulo: "Parabéns! Você concluiu", subtitulo: "Veja tudo o que você aprendeu:",
    itens: ["Reconhecer golpes", "WhatsApp protegido", "Gov.br e Meu SUS Digital", "Videochamada e Pix seguros"],
    cta: "Ajuda: Procon 151 • Polícia 190. Sua nota de 0 a 10?" }
];

PILULAS.forEach((p) => {
  const arquivo = path.join(__dirname, `pilula${p.num}.svg`);
  fs.writeFileSync(arquivo, infografico(p));
  console.log("gerado:", arquivo);
});
