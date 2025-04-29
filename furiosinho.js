const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

app.get("/", (req, res) => {
  res.send("Bot está rodando!");
});

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "Olá! Eu sou um bot ativo no Render.");
});

app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
