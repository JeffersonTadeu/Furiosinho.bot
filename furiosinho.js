require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const users = {}; // chatId: { accepted, waitingName, name, hasReceivedMenu }

app.get("/", (req, res) => {
  res.send("Bot está rodando!");
});

// Recebendo mensagens do usuário
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log("📥 Mensagem recebida:", { chatId, text });

  // Início da interação
  if (!users[chatId]) {
    users[chatId] = { accepted: false, waitingName: false, name: "", hasReceivedMenu: false };

    bot.sendMessage(chatId, "💥💥 Falaaaa Furioso! Que ótimo te ver por aqui, eu sou o Furiosinho e estou animado para te deixar por dentro de tudo sobre nosso time de CS da Fúria 👊🚀")
    return bot.sendMessage(chatId, "🤖 Para continuar, você precisa aceitar os termos de uso:", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Aceito", callback_data: "aceito" },
            { text: "❌ Não aceito", callback_data: "nao_aceito" }
          ]
        ]
      }
    });
  }

  // Se não aceitou os termos ainda
  if (!users[chatId].accepted) {
    return bot.sendMessage(chatId, "⚠️ Você precisa aceitar os termos antes de continuar.");
  }

  // Se ainda não respondeu o nome
  if (users[chatId].waitingName) {
    users[chatId].name = text;
    users[chatId].waitingName = false;
    users[chatId].hasReceivedMenu = true;

    return sendMainMenu(chatId);
  }

  // Já interagiu, trata comandos normais
  const texto = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (["1", "jogos", "próximos jogos", "proximos", "1️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, `📅 🔥 Próximo jogo confirmado!\n
A FURIA volta aos servidores no dia 17 de junho de 2025, enfrentando a NAVI pela Esports World Cup! 🏆

👊 Esse duelo promete — será a estreia do skullz no elenco principal 🧠
E tem reforço fora do server também: os analistas Lucid e innersh1ne agora fazem parte da tropa! 📊

⚔️ Preparado pro show? Haha!`);
  } else if (["2", "resultados", "últimos jogos", "ultimos", "2️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "🏆 Últimos resultados:\n- FURIA 2x1 Liquid\n- FURIA 0x2 FaZe");
  } else if (["3", "escalacao", "lineup", "jogadores", "time", "players", "3️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId,
      "👥 <b>Lineup atual da FURIA:</b>\n\n" +
      "• <b>FalleN</b> – Rating: 1.01\n" +
      "• <b>yuurih</b> – Rating: 1.17\n" +
      "• <b>KSCERATO</b> – Rating: 1.19\n" +
      "• <b>molodoy</b> – Rating: 0.00\n" +
      "• <b>YEKINDAR</b> – Rating: 0.00\n\n" +
      "📊 Fonte: HLTV.org",
      { parse_mode: 'HTML' }
    );
  } else if (["4", "torneios", "competicao", "campeonato", "4️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId,
      `💣 Próximos torneios onde a FURIA está confirmada\n\n` +
      `📌 <b>PGL Astana 2025</b>: de 10 a 18 de maio, no Cazaquistão\n` +
      `📌 <b>Intel Extreme Masters Dallas 2025</b>: de 19 a 25 de maio, nos Estados Unidos\n` +
      `📌 <b>BLAST.tv Austin Major 2025 – Stage 2</b>: de 7 a 10 de junho, nos Estados Unidos`,
      { parse_mode: 'HTML' }
    );
  } else if (["5", "sair", "ggwp", "tchau", "5️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "Você escolheu sair. Até mais!");
    delete users[chatId];
  } else {
    sendMainMenu(chatId);
  }
});

// Botões de aceite
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  console.log("📲 Callback recebido:", { chatId, data });

  if (data === "aceito") {
    users[chatId] = { accepted: true, waitingName: true, name: "", hasReceivedMenu: false };
    bot.sendMessage(chatId, "Booaa! Estamos seguindo a mesma call!");
    bot.sendMessage("Para melhorarmos nossa comunicação, me responda: Qual é o seu nome?")
  } else if (data === "nao_aceito") {
    bot.sendMessage(chatId, "❌ Você recusou os termos. Encerrando a conversa.");
    delete users[chatId];
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// Envia o menu principal
function sendMainMenu(chatId) {
    const nome = users[chatId]?.name || "player";
    const saudacao = `🔥 Eaaee, FUR ${nome}!!! Sobre o que podemos conversar hoje?\n\n` +
      "1️⃣ - Ver os próximos jogos 📆\n" +
      "2️⃣ - Ver resultados recentes 🖋️\n" +
      "3️⃣ - Ver a escalação atual 👥\n" +
      "4️⃣ - Próximos torneios 🏆\n" +
      "5️⃣ - GGWP (sair) 🤩";
  
    bot.sendMessage(chatId, saudacao);
}
  

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escutando na porta ${PORT}`);
});
