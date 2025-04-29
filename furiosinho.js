// bot.js
const TelegramBot = require('node-telegram-bot-api');

// Coloque o Token que o BotFather te deu
const token = '7145229056:AAEWXsQPcPnXCM1uisgaT6DBVylJoKlcpoU';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  let reply = 'Não entendi sua mensagem.';

  if (text.includes('oi')) {
    reply = 'Oi! Como posso ajudar você?';
  } else if (text.includes('horas')) {
    reply = `Agora são ${new Date().toLocaleTimeString()}`;
  } else if (text.includes('adeus')) {
    reply = 'Até a próxima!';
  }

  bot.sendMessage(chatId, reply);
});
