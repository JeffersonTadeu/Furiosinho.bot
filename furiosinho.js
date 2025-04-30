require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

app.get("/", (req, res) => {
  res.send("Bot está rodando!");
});

// Comando /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🔥 Bem-vindo ao Bot da FURIA! Aqui estão os comandos disponíveis:

/proximos - Ver os próximos jogos
/ultimos - Ver resultados recentes
/lineup - Ver a escalação atual
/meme - Receber um meme da FURIA`
  );
});

// Comando /proximos
bot.onText(/\/proximos/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📅 Próximos jogos:\n- 02/05 vs NAVI\n- 05/05 vs G2"
  );
});

// Comando /ultimos
bot.onText(/\/ultimos/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🏆 Últimos resultados:\n- FURIA 2x1 Liquid\n- FURIA 0x2 FaZe"
  );
});

// Comando /lineup
bot.onText(/\/lineup/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👥 Lineup atual:\n- KSCERATO\n- yuurih\n- arT\n- chelo\n- FalleN"
  );
});

// Comando /meme
bot.onText(/\/meme/, (msg) => {
  const memes = [
    "https://s2.glbimg.com/Pro9FL9Z2be1rbdkSBoNgVLA5JQ=/1200x/smart/filters:cover():strip_icc()/s.glbimg.com/es/ge/f/original/2019/06/07/meme_furia.jpeg",
  ];
  const meme = memes[Math.floor(Math.random() * memes.length)];
  bot.sendPhoto(msg.chat.id, meme);
});

// Mensagem padrão para outras entradas
bot.on("message", (msg) => {
  const text = msg.text;
  if (!text.startsWith("/")) {
    bot.sendMessage(
      msg.chat.id,
      "⚠️ Use /start para ver os comandos disponíveis."
    );
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
