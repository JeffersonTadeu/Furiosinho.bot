require("dotenv").config();

require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, {
  polling: {
    params: {
      allowed_updates: ['message', 'callback_query']
    }
  }
});

const users = {}; // Armazena o estado dos usuários

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
  console.log('rodando a msg');
  const chatId = msg.chat.id;
  const text = msg.text;

  // Verifica se o usuário já existe
  if (!users[chatId]) {
    users[chatId] = { step: "aguardando_aceite" };

    bot.sendMessage(chatId, "Você aceita os termos para continuar?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Aceito", callback_data: "aceito" },
            { text: "Não aceito", callback_data: "nao_aceito" }
          ]
        ]
      }
    });

    return;
  }

  // Se ainda não aceitou os termos, ignora outras mensagens
  if (users[chatId].step !== "aceitou") {
    return;
  }

  const texto = text
    ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : "";

  if (["1", "jogos", "proximos jogos", "1️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, `📅 🔥 Próximo jogo confirmado!\n
A FURIA volta aos servidores no dia 17 de junho de 2025, enfrentando a NAVI pela Esports World Cup! 🏆\n
👊 Estreia do skullz no time!`);
  } else if (["2", "resultados", "ultimos", "2️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "🏆 Últimos resultados:\n- FURIA 2x1 Liquid\n- FURIA 0x2 FaZe");
  } else if (["3", "escalacao", "lineup", "3️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId,
      "👥 <b>Lineup atual da FURIA:</b>\n\n" +
      "• <b>FalleN</b>\n" +
      "• <b>yuurih</b>\n" +
      "• <b>KSCERATO</b>\n" +
      "• <b>molodoy</b>\n" +
      "• <b>YEKINDAR</b>",
      { parse_mode: 'HTML' }
    );
  } else if (["4", "torneios", "campeonato", "4️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, `💣 Próximos torneios:\n- PGL Astana\n- IEM Dallas\n- BLAST Austin`);
  } else if (["5", "sair", "ggwp", "5️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "Você escolheu sair. Até mais!");
    delete users[chatId];
  } else {
    bot.sendMessage(chatId, `Hm... não entendi. Escolha uma opção:\n
1️⃣ - Ver próximos jogos 📆\n
2️⃣ - Ver resultados 🏆\n
3️⃣ - Ver escalação 👥\n
4️⃣ - Ver torneios 🏆\n
5️⃣ - GGWP (sair) 🤩`);
  }
});

// Lida com os botões
bot.on("callback_query", (callbackQuery) => {
  console.log("Callback recebido:", callbackQuery);
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  bot.answerCallbackQuery(callbackQuery.id); // encerra loading

  if (data === "aceito") {
    users[chatId] = { step: "aceitou" };

    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    }).catch(error => {
      console.error("Erro ao editar teclado:", error);
    });

    bot.sendMessage(chatId,
      `🔥 Bem-vindo! Eu sou o Furiosinho! Escolha:\n
1️⃣ - Ver próximos jogos 📆\n
2️⃣ - Ver resultados 🖋️\n
3️⃣ - Escalação atual 👥\n
4️⃣ - Torneios 🏆\n
5️⃣ - GGWP (sair) 🤩`
    );

  } else if (data === "nao_aceito") {
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    }).catch(error => {
      console.error("Erro ao editar teclado:", error);
    });

    bot.sendMessage(chatId, "❌ Você não aceitou os termos. Até mais!");
    delete users[chatId];
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});