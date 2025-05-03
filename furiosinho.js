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

const users = {}; // Para guardar o estado dos usuários

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Se o usuário ainda não interagiu
  if (!users[chatId]) {
    users[chatId] = { hasReceivedMenu: true };

    bot.sendMessage(chatId, 
      `🔥 Bem-vindo! Eu sou o Furiosinho, sobre o que podemos conversar hoje?\n
  1️⃣ - Ver os próximos jogos 📆\n
  2️⃣ - Ver resultados recentes 🖋️\n
  3️⃣ - Ver a escalação atual 👥\n
  4️⃣ - Próximos torneios🏆\n
  5️⃣ - GGWP (sair) 🤩`
    );  

    return;
  }

  const texto = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); // Deixa tudo em minúsculo pra facilitar comparação

  if (["1", "jogos", "próximos jogos", "proximos", "1️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, `📅 🔥 Próximo jogo confirmado!\n
A FURIA volta aos servidores no dia 17 de junho de 2025, enfrentando a NAVI pela Esports World Cup! 🏆\n

👊 Esse duelo promete — será a estreia do skullz no elenco principal 🧠\n
E tem reforço fora do server também: os analistas Lucid e innersh1ne agora fazem parte da tropa! 📊\n

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
  // } else if (["4", "meme", "furia"].some(p => texto.includes(p))) {
  //   const memes = [
  //     "https://s2.glbimg.com/Pro9FL9Z2be1rbdkSBoNgVLA5JQ=/1200x/smart/filters:cover():strip_icc()/s.glbimg.com/es/ge/f/original/2019/06/07/meme_furia.jpeg",
  //   ];
  //   const meme = memes[Math.floor(Math.random() * memes.length)];
  //   bot.sendPhoto(chatId, meme);
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
    bot.sendMessage(chatId, `Hm... não entendi. Escolha um dos itens abaixo\n
  1️⃣ - Ver os próximos jogos 📆\n
  2️⃣ - Ver resultados recentes 🏆\n
  3️⃣ - Ver a escalação atual 👥\n
  4️⃣ - Receber um meme da FURIA\n
  5️⃣ - GGWP (sair)`);
  }

});

app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
