# Conecta-Zap Bot 🤖💙

Bot do Projeto de Extensão (iCEV) — **Trilha A: Letramento Digital para Idosos**.

Automatiza o fluxo exigido no edital:
**Cadastro do usuário → Mensagem de Boas-vindas → Disparo diário automático (10 pílulas) → Encerramento com coleta de feedback.**

🔗 **Bot em operação (Telegram):** [@ConectaZapIdososBot](https://t.me/ConectaZapIdososBot)

> O canal oficial da operação real é o **Telegram**, aprovado pelo professor orientador. O projeto também mantém suporte à WhatsApp Cloud API (Meta), disponível como canal alternativo — veja a seção [Canais suportados](#canais-suportados).

## Como funciona

1. O idoso manda qualquer mensagem (ex.: "quero participar") para o bot.
2. O webhook cadastra o contato e responde a **boas-vindas** automaticamente.
3. Todo dia às **9h** (horário de Teresina), o cron envia a **pílula do dia** (imagem + texto) para cada contato.
4. No **dia 10**, a pílula final pede a **nota de 0 a 10** — as respostas ficam gravadas em `data/contatos.json`.
5. `GET /relatorio` mostra alcance e feedback (base do Relatório de Impacto).
6. `/painel?chave=SUA_CHAVE` traz um painel administrativo com métricas em tempo real e botão para disparo manual.

## Canais suportados

O canal é definido pela variável `CANAL` no `.env`:

| Canal | Valor de `CANAL` | Observações |
|---|---|---|
| **Telegram** (operação real) | `telegram` | Sem necessidade de aprovação de templates; requer `TELEGRAM_TOKEN` do @BotFather |
| **WhatsApp Cloud API** | `whatsapp` | Requer app Business na Meta, verificação e (fora da janela de 24h) templates aprovados |

## Estrutura

```
src/
  index.js      -> servidor + rotas de status/relatório/privacidade
  webhook.js    -> cadastro, boas-vindas e recebimento de respostas (canal WhatsApp)
  telegram.js   -> cadastro, boas-vindas, envio e webhook do canal Telegram
  scheduler.js  -> cron do disparo diário (escolhe o canal conforme CANAL)
  whatsapp.js   -> chamadas à WhatsApp Cloud API
  pilulas.js    -> conteúdo das 10 pílulas + textos de boas-vindas
  db.js         -> banco em JSON (data/contatos.json)
  painel.js     -> painel administrativo (métricas + disparo manual + reset)
  simulador.js  -> ambiente de teste local (chat estilo WhatsApp no navegador)
infograficos/
  pilula1.png … pilula10.png  -> os 10 infográficos originais gerados por IA, já usados pelo bot
```

## Configuração (passo a passo)

### 1. Projeto

```bash
npm install
copy .env.example .env   # e preencha o .env
npm start
```

### 2. Canal Telegram (recomendado — operação real)

1. Fale com o [@BotFather](https://t.me/BotFather) no Telegram e crie um novo bot com `/newbot`.
2. Copie o token gerado para `TELEGRAM_TOKEN` no `.env`.
3. Defina `CANAL=telegram` no `.env`.
4. Ao subir o projeto (local ou Render), o próprio servidor registra o webhook do Telegram automaticamente, usando `BASE_URL` (local) ou `RENDER_EXTERNAL_URL` (Render, preenchida automaticamente).

### 3. Canal WhatsApp (alternativo)

1. Crie uma conta em [developers.facebook.com](https://developers.facebook.com) e um **App** do tipo Business.
2. Adicione o produto **WhatsApp** e registre o número do projeto (chip novo, sem WhatsApp).
3. Em *API Setup*, copie o **Token** e o **Phone Number ID** para `WHATSAPP_TOKEN` e `PHONE_NUMBER_ID` no `.env`.
4. Suba o projeto no [Render](https://render.com) (Web Service grátis, build `npm install`, start `npm start`).
5. No painel da Meta (*WhatsApp > Configuration*), cadastre a URL `https://SEU_APP.onrender.com/webhook` com o mesmo `VERIFY_TOKEN` do `.env` e assine o campo **messages**.
6. Defina `CANAL=whatsapp` no `.env`.

Fora da janela de 24h o WhatsApp exige **templates aprovados**. Crie na Meta 10 templates
(`pilula_1` … `pilula_10`, categoria *Utility*, idioma pt_BR, imagem no cabeçalho e o texto da pílula no corpo)
e use `MODO_LIVRE=false`.

### 4. Infográficos

Os 10 infográficos já estão prontos em `infograficos/` e referenciados em `src/pilulas.js` via URL pública do próprio repositório (`raw.githubusercontent.com`). Para substituir por versões novas, gere as imagens por IA e atualize as URLs em `src/pilulas.js`.

## Painel administrativo

Acesse `https://SEU_APP.onrender.com/painel?chave=SUA_CHAVE` (a chave é o `VERIFY_TOKEN` do `.env`) para:

- Ver quantos participantes estão **cadastrados**, **ativos** e **concluíram** a trilha
- Disparar a pílula do dia manualmente, sem esperar o cron das 9h
- Resetar a trilha (volta todos para o dia 0) ou apagar todos os cadastros — útil em testes
- Baixar um backup em JSON de todos os contatos e feedbacks (mesmo conteúdo de `GET /relatorio`)

## Testes

- `MODO_SIMULACAO=true` no `.env`: acesse `http://localhost:3000/simulador` para conversar com o bot em um chat estilo WhatsApp direto no navegador, sem depender de nenhuma API externa.
- `MODO_TESTE=true` no `.env`: o cron dispara a cada 10 minutos — dá para simular os 10 dias em ~2h entre os membros do grupo.
- `GET /` mostra o status (cadastrados/ativos/concluídos); `GET /relatorio` mostra o feedback coletado.

## Privacidade

A rota `GET /privacidade` expõe a política de privacidade do projeto, exigida pela Meta para operação com WhatsApp e usada como referência de tratamento de dados também no canal Telegram.

## Equipe

- Luiz Antonio — [completar com os membros do grupo]
