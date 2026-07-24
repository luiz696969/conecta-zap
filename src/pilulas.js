// As 10 pílulas de conhecimento - Trilha A: Letramento Digital para Idosos
// imagem: coloque a URL pública do infográfico gerado por IA (ex.: link do imgur, GitHub raw ou Google Drive público)
// template: nome do template aprovado na Meta (usado quando MODO_LIVRE=false)

const PILULAS = [
  {
    dia: 1,
    titulo: "Boas-vindas ao mundo digital",
    template: "pilula_1",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula1.png",
    texto:
      "Olá! 😊 Que alegria ter você aqui!\n\n" +
      "Este é o Conecta-Zap, um curso gratuito, direto no seu celular, para você usar a internet com mais segurança e confiança.\n\n" +
      "Funciona assim: durante 10 dias, você vai receber 1 mensagem por dia, bem curtinha, com uma imagem para ajudar a entender.\n\n" +
      "Não precisa pagar nada e não precisa sair de casa. É só ler com calma, no seu tempo.\n\n" +
      "🎯 Desafio de hoje: responda esta mensagem com um áudio dizendo \"oi\". É só apertar e segurar o microfone 🎤 aqui embaixo e falar. Vamos tentar?"
  },
  {
    dia: 2,
    titulo: "Golpe do falso parente",
    template: "pilula_2",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula2.png",
    texto:
      "Bom dia! 😊 Hoje vamos falar de um golpe muito comum: o golpe do falso parente.\n\n" +
      "Funciona assim: alguém manda mensagem dizendo \"Mãe/Pai, troquei de número\" e depois pede dinheiro emprestado com pressa.\n\n" +
      "⚠️ Atenção aos 3 sinais: 1) número novo e desconhecido, 2) pedido de dinheiro, 3) muita pressa.\n\n" +
      "Regra de ouro: antes de enviar qualquer dinheiro, LIGUE para o número antigo do seu parente e confirme. Ligou, confirmou, ficou seguro. ✅\n\n" +
      "🎯 Pergunta de hoje: você já recebeu uma mensagem assim? Conte para a gente!"
  },
  {
    dia: 3,
    titulo: "Golpe do falso banco",
    template: "pilula_3",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula3.png",
    texto:
      "Bom dia! 😊 Hoje o assunto é o golpe do falso banco.\n\n" +
      "Golpistas ligam ou mandam mensagem fingindo ser do seu banco e pedem sua senha ou um código.\n\n" +
      "Guarde bem isto: o banco NUNCA liga pedindo senha. O banco NUNCA pede código por mensagem. Nunca. ❌\n\n" +
      "Se alguém pedir sua senha, pode desligar sem medo. Desligar não é falta de educação, é proteção. ✅\n\n" +
      "🎯 Desafio de hoje: olhe a imagem e anote em um papel os 3 sinais de golpe. Deixe o papel perto do telefone."
  },
  {
    dia: 4,
    titulo: "Proteja seu WhatsApp",
    template: "pilula_4",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula4.png",
    texto:
      "Olá! 😊 Você sabia que existe um golpe para roubar o seu WhatsApp?\n\n" +
      "O golpista pede o código de 6 números que chega por mensagem no seu celular. Com esse código, ele rouba sua conta.\n\n" +
      "Regra de ouro: esse código é só seu. NUNCA passe para ninguém, nem para quem diz ser amigo ou empresa. ❌\n\n" +
      "Dica extra: ative a \"confirmação em duas etapas\". Caminho: Configurações > Conta > Confirmação em duas etapas > Ativar. A imagem mostra o passo a passo.\n\n" +
      "🎯 Desafio de hoje: tente ativar a confirmação em duas etapas. Se tiver dúvida, responda aqui que a gente ajuda!"
  },
  {
    dia: 5,
    titulo: "Conhecendo o Gov.br",
    template: "pilula_5",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula5.png",
    texto:
      "Bom dia! 😊 Hoje vamos conhecer o Gov.br.\n\n" +
      "O Gov.br é o site do governo onde você resolve muita coisa sem sair de casa: consulta o INSS, pega documentos e muito mais.\n\n" +
      "Para usar, você precisa criar uma conta. É de graça. Você vai precisar do seu CPF e de uma senha que você mesmo escolhe.\n\n" +
      "A imagem mostra o passo a passo para criar a conta pelo celular. Vá com calma, um passo de cada vez. Você consegue! 💪\n\n" +
      "🎯 Pergunta de hoje: você já tem conta no Gov.br? Responda SIM ou NÃO."
  },
  {
    dia: 6,
    titulo: "Saúde na palma da mão",
    template: "pilula_6",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula6.png",
    texto:
      "Olá! 😊 Hoje é dia de cuidar da saúde.\n\n" +
      "Existe um aplicativo gratuito chamado Meu SUS Digital. Nele você vê sua carteira de vacinação, seus exames e suas consultas.\n\n" +
      "Para entrar, você usa a mesma conta do Gov.br que vimos ontem. Viu como uma coisa ajuda a outra? 😉\n\n" +
      "A imagem mostra onde baixar e como entrar no aplicativo.\n\n" +
      "🎯 Desafio de hoje: baixe o aplicativo Meu SUS Digital na loja de aplicativos do seu celular. Se precisar de ajuda, é só responder aqui!"
  },
  {
    dia: 7,
    titulo: "Cuidado com notícias falsas",
    template: "pilula_7",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula7.png",
    texto:
      "Bom dia! 😊 Hoje vamos aprender a desconfiar de notícias falsas.\n\n" +
      "Notícia falsa é aquela mensagem alarmante que chega em grupos e pede para \"compartilhar com todos\".\n\n" +
      "Antes de compartilhar, faça os 3 testes: 1) Quem enviou? 2) Saiu em algum jornal ou site conhecido? 3) Está pedindo pressa ou causando medo?\n\n" +
      "Se desconfiar, não compartilhe. Não compartilhar também é ajudar. ✅\n\n" +
      "🎯 Pergunta de hoje: você recebeu alguma corrente hoje? Ela passa nos 3 testes?"
  },
  {
    dia: 8,
    titulo: "Videochamada com a família",
    template: "pilula_8",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula8.png",
    texto:
      "Olá! 😊 Hoje a dica é das boas: videochamada!\n\n" +
      "Com a videochamada você vê e conversa com filhos e netos, mesmo de longe. E é de graça pelo WhatsApp.\n\n" +
      "É simples: abra a conversa da pessoa e toque no desenho da câmera 📹 no alto da tela. Para atender, é só arrastar o botão verde.\n\n" +
      "A imagem mostra o passo a passo. Se errar, tudo bem: é só tentar de novo. 😊\n\n" +
      "🎯 Desafio de hoje: faça uma videochamada com alguém querido. Depois conte para a gente como foi!"
  },
  {
    dia: 9,
    titulo: "Pix com segurança",
    template: "pilula_9",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula9.png",
    texto:
      "Bom dia! 😊 Hoje vamos falar do Pix com segurança.\n\n" +
      "O Pix é uma forma rápida de pagar e receber dinheiro pelo celular. É seguro, desde que você siga uma regra de ouro:\n\n" +
      "🔑 Regra de ouro: antes de confirmar, SEMPRE confira o nome de quem vai receber. Apareceu nome estranho? Não confirme.\n\n" +
      "Outras dicas: desconfie de ofertas boas demais e coloque um limite de valor no Pix no aplicativo do seu banco.\n\n" +
      "🎯 Pergunta de hoje: qual é a regra de ouro antes de confirmar um Pix? Responda com suas palavras!"
  },
  {
    dia: 10,
    titulo: "Parabéns! Você concluiu a trilha",
    template: "pilula_10",
    imagem: "https://raw.githubusercontent.com/luiz696969/conecta-zap/main/infograficos/pilula10.png",
    texto:
      "Parabéns! 🎉 Você chegou ao fim dos 10 dias do Conecta-Zap!\n\n" +
      "Veja tudo o que você aprendeu: reconhecer golpes, proteger o WhatsApp, usar o Gov.br e o Meu SUS Digital, fazer videochamada e usar o Pix com segurança. Que orgulho! 👏\n\n" +
      "Guarde estes contatos de ajuda: Procon (telefone 151) e Polícia (telefone 190). E, na dúvida, pergunte sempre a alguém de confiança.\n\n" +
      "Agora queremos saber sua opinião, é rapidinho:\n\n" +
      "🎯 De 0 a 10, quanto este curso ajudou você? Responda com um número. Se quiser, mande também um áudio contando do que mais gostou. Muito obrigado por participar! 💙"
  }
];

const BOAS_VINDAS =
  "Olá! 😊 Bem-vindo(a) ao Conecta-Zap!\n\n" +
  "Seu cadastro foi feito com sucesso. ✅\n\n" +
  "A partir de amanhã, você vai receber 1 mensagem por dia, durante 10 dias, com dicas para usar o celular com segurança.\n\n" +
  "As mensagens chegam sempre de manhã. É só ler com calma, no seu tempo. Até amanhã! 👋";

module.exports = { PILULAS, BOAS_VINDAS };
