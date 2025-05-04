# 🤖 Furiosinho Bot

Um bot de Telegram feito em Node.js para engajar a comunidade da FURIA Esports sobre CS com curiosidades, wallpapers e um menu interativo de opções.

## 🚀 Tecnologias utilizadas
- **Node.js** com **Express.js**
- **node-telegram-bot-api** para interação com a API do Telegram
- Hospedagem via **Render.com** (Plano free)
- Monitoramento com **UptimeRobot**

## 🛠️ Requisitos

Antes de rodar o projeto, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (recomendado: v18 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes)

## 📁 Instalação local

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/furiosinho-bot.git
   cd furiosinho-bot
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com as seguintes variáveis:
   ```env
   BOT_TOKEN=seu_token_do_telegram_aqui
   PORT=3000
   ```

4. Rode o bot localmente:
   ```bash
   node furiosinho.js
   ```

5. Acesse `http://localhost:3000` para verificar se o servidor está rodando corretamente.

## 🌍 Deploy na Render

Este projeto está hospedado na [Render](https://render.com/). Para replicar:

1. Crie um novo Web Service com o repositório deste bot.
2. Configure as variáveis de ambiente no painel:
   - `BOT_TOKEN`
   - `PORT`
3. Comando de start:
   ```bash
   node furiosinho.js
   ```
4. Deixe ativado o modo **auto deploy** do Render.

## 🟢 Monitoramento com UptimeRobot

Para evitar que a instância Render entre em modo sleep, pois o plano free inativa o bot se ficar 15min sem interatividade, usei [UptimeRobot](https://uptimerobot.com/):

- Configure um monitor tipo HTTP(S)
- Ping no endpoint principal (ex: `https://seu-bot.onrender.com/`) a cada 5 minutos

## 📦 Estrutura do projeto

```
furiosinho-bot/
├── .env              # Variáveis de ambiente
├── imgs/             # Wallpapers enviados pelo bot
├── furiosinho.js     # Arquivo principal com toda a lógica
├── package.json      # Dependências do projeto
└── README.md         # Documentação
```

## 💡 Funcionalidades

- Aceita termos e coleta nome do usuário (podendo ser programada para coletar outras informações necessárias)
- Menu principal com diversas opções
- Curiosidades sobre jogadores
- Wallpapers com botões de próxima imagem
- Timeout por inatividade (1 hora)
- Persistência em memória (em breve: persistência com banco)

---

Feito com dedicação e êxtase por JeffTadeu 🤓 - Um torcedor bem FURIOSO.

---

> Este bot não é oficial da FURIA Esports. Apenas um protótipo de fã. 
