# Conecta-Zap Bot 🤖💙

Bot do Projeto de Extensão (iCEV) — **Trilha A: Letramento Digital para Idosos**.

Automatiza o fluxo exigido no edital:
**Cadastro do usuário → Mensagem de Boas-vindas → Disparo diário automático (10 pílulas) → Encerramento com coleta de feedback.**

## Como funciona

1. O idoso manda qualquer mensagem (ex.: "quero participar") para o número do projeto.
2. O webhook cadastra o contato e responde a **boas-vindas** automaticamente.
3. Todo dia às **9h**, o cron envia a **pílula do dia** (imagem + texto) para cada contato.
4. No **dia 10**, a pílula final pede a **nota de 0 a 10** — as respostas ficam gravadas em `data/contatos.json`.
5. `GET /relatorio` mostra alcance e feedback (base do Relatório de Impacto).

## Estrutura

```
src/
  index.js      -> servidor + rotas de status/relatório
  webhook.js    -> cadastro, boas-vindas e recebimento de respostas
  scheduler.js  -> cron do disparo diário
  whatsapp.js   -> chamadas à WhatsApp Cloud API
  pilulas.js    -> conteúdo das 10 pílulas
  db.js         -> banco em JSON (data/contatos.json)
```

## Configuração (passo a passo)

### 1. Meta for Developers
1. Crie uma conta em [developers.facebook.com](https://developers.facebook.com) e um **App** do tipo Business.
2. Adicione o produto **WhatsApp** e registre o número do projeto (chip novo, sem WhatsApp).
3. Em *API Setup*, copie o **Token** e o **Phone Number ID**.

### 2. Projeto
```bash
npm install
copy .env.example .env   # e preencha o .env
npm start
```

### 3. Webhook
1. Suba o projeto no [Render](https://render.com) (Web Service grátis, build `npm install`, start `npm start`).
2. No painel da Meta (*WhatsApp > Configuration*), cadastre a URL `https://SEU_APP.onrender.com/webhook` com o mesmo `VERIFY_TOKEN` do `.env` e assine o campo **messages**.

### 4. Infográficos
Gere os 10 infográficos por IA, hospede em link público e cole as URLs em `src/pilulas.js`.

### 5. Templates (operação real)
Fora da janela de 24h o WhatsApp exige **templates aprovados**. Crie na Meta 10 templates
(`pilula_1` … `pilula_10`, categoria *Utility*, idioma pt_BR, imagem no cabeçalho e o texto da pílula no corpo)
e use `MODO_LIVRE=false`.

## Testes

- `MODO_TESTE=true` no `.env`: o cron dispara a cada 10 minutos — dá para simular os 10 dias em ~2h entre os membros do grupo.
- `GET /` mostra o status; `GET /relatorio` mostra o feedback coletado.

## Equipe

- Luiz Antonio — [completar com os membros do grupo]
