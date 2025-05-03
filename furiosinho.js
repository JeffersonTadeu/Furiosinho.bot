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
            { text: "✅ Aceito", callback_data: "accept_terms" },
            { text: "❌ Não aceito", callback_data: "no_accept_terms" }
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
      "📊 Fonte: HLTV.org\n\n" +
      "Eu tenho algumas curiosidades bem legais sobre os jogadores, ta a fim de saber?? 👀👀",
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Aceito", callback_data: "curiosities_players" },
              { text: "❌ Não aceito", callback_data: "no_curiosities_players" }
            ]
          ]
        }
      }
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

  if (data === "accept_terms") {
    users[chatId] = { accepted: true, waitingName: true, name: "", hasReceivedMenu: false };
    bot.sendMessage(chatId, "Booaa! Estamos seguindo a mesma call!");
    setTimeout(() => {
        bot.sendMessage(chatId, "Para melhorarmos nossa comunicação, me responda: Qual é o seu nome?");
      }, 500);
  } else if (data === "no_accept_terms") {
    bot.sendMessage(chatId, "❌ Você recusou os termos e está tudo bem, entendo que no momento nossas expectativas não estejam alinhadas 😞\nEspero te ver novamente em uma outra oportunidade 🤞\n\nAté mais!!. 👋👋");
    delete users[chatId];
  } else if (data === "curiosities_players") {
    bot.sendMessage(chatId, "É disso que eu to falando!!! Ninguém resiste a algumas curiosidades, então lá vão elas:")
    setTimeout(() => {
    bot.sendMessage(chatId, 
        "🎓 <b>FalleN (Gabriel Toledo)</b>\n" +
        "• Conhecido como <b>“O Professor”</b>, FalleN é uma lenda viva do CS brasileiro e mundial.\n" +
        "• Bicampeão de Major (MLG Columbus 2016 e ESL One Cologne 2016), ele é muito mais que um jogador: é um <b>líder tático</b> e estrategista nato.\n" +
        "• Comanda o time como IGL e inspira com sua experiência e visão de jogo.\n\n" +
      
        "🪨 <b>yuurih (Yuri Boian)</b>\n" +
        "• Desde 2017 na FURIA, yuurih é a nossa <b>rocha</b> — sempre firme, sempre constante.\n" +
        "• Especialista em <b>clutches impossíveis</b>, ele transforma o improvável em highlight.\n" +
        "• Fora do servidor é discreto, mas dentro dele é puro veneno. 🐍\n\n" +
      
        "💥 <b>KSCERATO (Kaike Cerato)</b>\n" +
        "• Na FURIA desde 2018, KSCERATO é apontado por muitos como o <b>melhor jogador da equipe</b> nos últimos tempos.\n" +
        "• Com mira afiada e um estilo agressivo e inteligente, ele já esteve entre os <b>20 melhores do mundo</b> em vários rankings!\n" +
        "• É a definição de consistência e impacto.\n\n" +
      
        "🧢 <b>molodoy (Ilya Molodoy)</b>\n" +
        "• Nosso <b>recruta</b>! Ainda novo na cena, mas já mostrando que tem potencial de sobra.\n" +
        "• Se você curte acompanhar o nascimento de estrelas, <b>fica de olho</b>: o molodoy tá vindo pra <b>fazer história!</b> ✨\n\n" +
      
        "🚀 <b>YEKINDAR (Mareks Gaļinskis)</b>\n" +
        "• Conhecido por seu estilo <b>extremamente agressivo</b>, YEKINDAR é o cara que <b>abre caminho no rush TR</b>.\n" +
        "• Com grande destaque em 2022 como um dos jogadores de <b>maior impacto por round</b>, ele chega somando força e ousadia ao time.\n",
        { parse_mode: 'HTML' }
      );      
    }, 500);
  } else if (data === "no_curiosities_players") {
    bot.sendMessage(chatId, "Sem problemas, qual será o nosso próximo tópico?\n\n" +
        "1️⃣ - Ver os próximos jogos 📆\n" +
        "2️⃣ - Ver resultados recentes 🖋️\n" +
        "3️⃣ - Ver a escalação atual 👥\n" +
        "4️⃣ - Próximos torneios 🏆\n" +
        "5️⃣ - GGWP (sair) 🤩"
    )
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// Envia o menu principal
function sendMainMenu(chatId) {
    const nome = users[chatId]?.name || "player";
    const saudacao = `🔥 Eaaee, FUR ${nome}!!! É um prazer enorme te ter na nossa comunidade! Sobre o que podemos conversar hoje?\n\n` +
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
