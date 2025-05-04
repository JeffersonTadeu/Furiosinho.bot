require("dotenv").config();


const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const path = require("path");

const users = {}; // chatId: { accepted, waitingName, name, hasReceivedMenu }

app.get("/", (req, res) => {
  res.send("Bot está rodando!");
});

const wallpapers = [
  { path: "./imgs/wallpaper_1.png", caption: "🖼️ Aqui está o primeiro wallpaper da FURIA! Quer ver os outros?" },
  { path: "./imgs/wallpaper_2.jpg", caption: "🔥 Segundo wallpaper da FURIA, monstro né? Bora pro próximo?" },
  { path: "./imgs/wallpaper_3.png", caption: "👀 Curte esse estilo? Veja mais!" },
  { path: "./imgs/wallpaper_4.jpg", caption: "💣 Último da série! Já escolheu o seu favorito?" }
];

// Recebendo mensagens do usuário
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log("📥 Mensagem recebida:", { chatId, text });

  // Início da interação
  if (!users[chatId]) {
    users[chatId] = { accepted: false, waitingName: false, name: "", hasReceivedMenu: false, changingName: false };
  
    bot.sendMessage(chatId, "💥💥 Falaaaa Furioso! Que ótimo te ver por aqui, eu sou o Furiosinho e estou animado para te deixar por dentro de tudo sobre nosso time de CS da Fúria 👊🚀")
      .then(() => {
        return bot.sendMessage(chatId, "⚠️ Você precisa aceitar os termos antes de continuar.");
      })
      .then(() => {
        return bot.sendMessage(chatId, "🤖 Termos de uso: exemplo.com", {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Aceito", callback_data: "accept_terms" },
                { text: "❌ Não aceito", callback_data: "no_accept_terms" }
              ]
            ]
          }
        });
      });
  
    return; 
  }
  

  // Se não aceitou os termos ainda
  if (!users[chatId].accepted) {
    return bot.sendMessage(chatId, "⚠️ Você precisa aceitar os termos antes de continuar.");
  }

  // Se ainda não respondeu o nome
  if (users[chatId].waitingName) {
    users[chatId].name = text;
    users[chatId].waitingName = false;

    resetInactivityTimeout(chatId);

    return sendMainMenu(chatId);
  }

  if (users[chatId].changingName) {
    users[chatId].name = text;
    users[chatId].changingName = false;
  
    resetInactivityTimeout(chatId);
  
    const nome = users[chatId].name || "player";
  
    (async () => {
      await bot.sendMessage(chatId, `✅ Ótimo nome! Sobre o que podemos falar agora então, FUR ${nome} 🇧🇷?`);
  
      const menuDireto =
        "🔥 Segue os tópicos do nosso menu \n\n" +
        "1️⃣ - Ver os próximos jogos 📆\n" +
        "2️⃣ - Ver resultados recentes 🖋️\n" +
        "3️⃣ - Ver a escalação atual 👥\n" +
        "4️⃣ - Próximos torneios 🏆\n" +
        "5️⃣ - Link da nossa lojinha 🛒\n" +
        "6️⃣ - História da Fúria no CS 🔥\n" +
        "7️⃣ - Wallpaper para celular 📱\n" +
        "8️⃣ - Trocar apelido ✏️\n" +
        "9️⃣ - GGWP (sair) 🤩";
  
      await bot.sendMessage(chatId, menuDireto);
    })();
  
    return;
  }

  // Já interagiu, trata comandos normais
  const texto = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (["1", "jogos", "próximos jogos", "proximos", "1️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, `📅 🔥 Próximo jogo confirmado!\n
A FURIA volta aos servidores no dia 17 de junho de 2025, enfrentando a NAVI pela Esports World Cup! 🏆

👊 Esse duelo promete — será a estreia do skullz no elenco principal 🧠
E tem reforço fora do server também: os analistas Lucid e innersh1ne agora fazem parte da tropa! 📊

⚔️ Preparado pro show? Haha!`, 
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📖 Menu", callback_data: "menu" },
              { text: "❌ Encerrar chat", callback_data: "close_chat" }
            ]
          ]
        }
      }
    );
  } else if (["2", "resultados", "últimos jogos", "ultimos", "2️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "🏆 Últimos resultados:\n- FURIA 2x1 Liquid\n- FURIA 0x2 FaZe", 
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📖 Menu", callback_data: "menu" },
              { text: "❌ Encerrar chat", callback_data: "close_chat" }
            ]
          ]
        }
      });
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
              { text: "📖 Menu", callback_data: "menu" }
            ],
            [
              { text: "❌ Encerrar chat", callback_data: "close_chat" }
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
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📖 Menu", callback_data: "menu" },
              { text: "❌ Encerrar chat", callback_data: "close_chat" }
            ]
          ]
        }
      }
    );
  } else if (["5", "loja", "link", "compra", "compras", "comprar", "adquirir", "camisa", "bone", "roupa", "vestuario", "acessorios", "5️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "🛒Opa! Então você quer o link da loja? Então toma:⚡\n\n https://www.furia.gg/",
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📖 Menu", callback_data: "menu" },
              { text: "❌ Encerrar chat", callback_data: "close_chat" }
            ]
          ]
        }
      }
    );
  } else if (["6", "historia", "cenario", "furia", "6️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, `🔥 FURIA no CS 🔫

A FURIA é um time brabo de eSports do Brasil 🇧🇷, criado em 2017, e que mandou ver no CS:GO desde 2018! Eles ficaram famosos pelo estilo de jogo super agressivo 😈, com o art puxando a galera pra cima dos adversários sem medo!

Com nomes como KSCERATO e yuurih, a FURIA brilhou em vários campeonatos gringos 🌍 e fez história ao bater gigantes como a Astralis. O auge foi no Major do Rio em 2022, quando jogaram em casa e chegaram até as semis com a torcida toda gritando 🏟️🔥.

Em 2023, o lendário FalleN entrou no time e trouxe ainda mais experiência 💪. Agora, no CS2, a FURIA continua firme, representando o Brasil com garra e jogadas insanas! 💥🎯`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📖 Menu", callback_data: "menu" },
              { text: "❌ Encerrar chat", callback_data: "close_chat" }
            ]
          ]
        }
      }
    );
  } else if (["7", "wallpaper", "plano de fundo", "celular", "plano", "fundo", "tela", "7️⃣"].some(p => texto.includes(p))) {
    sendWallpaper(chatId, 0);

  } else if (["8", "trocar", "nome", "apelido", "nick", "8️⃣"].some(p => texto.includes(p))) {
    users[chatId].changingName = true;
    bot.sendMessage(chatId, "✏️ Sem problemas! Qual nome você gostaria de usar a partir de agora?");
  } else if (["9", "sair", "ggwp", "tchau", "9️⃣"].some(p => texto.includes(p))) {
    bot.sendMessage(chatId, "Foi um prazer enooorme trocar essa ideia contigo, eu espero te ver mais vezes por aqui em? GGWP! GO FURIA! 🐾🐾😼");
    users[chatId].hasReceivedMenu = false;
    users[chatId].awaitingFirstMessageAfterClose = true;
  } else {
    const user = users[chatId];

    if (user && user.awaitingFirstMessageAfterClose) {
      user.awaitingFirstMessageAfterClose = false;
      return sendMainMenu(chatId); // envia saudação personalizada
    }

    // Fallback padrão se não for a primeira após retorno
    bot.sendMessage(chatId, "❓ Desculpe, não entendi sua mensagem, nós podemos conversar sobre os tópicos abaixo:");
    sendMainMenu(chatId);
  }
});

// Botões de aceite
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  console.log("📲 Callback recebido:", { chatId, data });

  if (data === "accept_terms") {
    users[chatId] = {
      accepted: true,
      waitingName: true,
      name: "",
      hasReceivedMenu: false,
      timeout: null, 
      awaitingFirstMessageAfterClose: false
    };
  
    resetInactivityTimeout(chatId); 
  
    bot.sendMessage(chatId, "Booaa! Estamos seguindo a mesma call! 🤙🎧");
    setTimeout(() => {
      bot.sendMessage(chatId, "✍️ Para melhorarmos nossa comunicação, me responda: Qual é o seu nome?");
    }, 500);
  
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "curiosities_players") {
    bot.sendMessage(chatId, "É disso que eu to falando!!! Ninguém resiste a algumas curiosidades, então escolhe um jogador:", {
      reply_markup: {
        inline_keyboard: [
          [ 
            { text: "🎓 FalleN", callback_data: "curiosity_fallen" },
            { text: "🪨 yuurih", callback_data: "curiosity_yuurih" }
          ],
          [ 
            { text: "💥 KSCERATO", callback_data: "curiosity_kscerato" },
            { text: "🧢 molodoy", callback_data: "curiosity_molodoy" }
          ],
          [
            { text: "🚀 YEKINDAR", callback_data: "curiosity_yekindar" },
            { text: "⬅️ Voltar ao menu", callback_data: "menu" }
          ],
          [
            { text: "❌ Encerrar conversa", callback_data: "close_chat" }
          ]
        ]
      }      
    })

    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "curiosity_fallen") {
    bot.sendMessage(chatId, 
      "🎓 <b>FalleN (Gabriel Toledo)</b>\n" +
      "• Conhecido como <b>“O Professor”</b>, FalleN é uma lenda viva do CS brasileiro e mundial.\n" +
      "• Bicampeão de Major (MLG Columbus 2016 e ESL One Cologne 2016).\n" +
      "• Líder tático e estrategista nato, comanda o time como IGL com maestria.",
      { parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [ 
              { text: "🪨 yuurih", callback_data: "curiosity_yuurih" }
            ],
            [ 
              { text: "💥 KSCERATO", callback_data: "curiosity_kscerato" },
              { text: "🧢 molodoy", callback_data: "curiosity_molodoy" }
            ],
            [
              { text: "🚀 YEKINDAR", callback_data: "curiosity_yekindar" },
              { text: "⬅️ Voltar ao menu", callback_data: "menu" }
            ],
            [
              { text: "❌ Encerrar conversa", callback_data: "close_chat" }
            ]
          ]
        } 
      }
    );

    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "curiosity_yuurih") {
    bot.sendMessage(chatId,
      "🪨 <b>yuurih (Yuri Boian)</b>\n" +
      "• Na FURIA desde 2017, é a nossa <b>rocha</b> — sempre firme.\n" +
      "• Mestre dos clutches e extremamente consistente.\n" +
      "• Fora do servidor é discreto, mas no game é mortal. 🐍",
      { parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [ 
              { text: "🎓 FalleN", callback_data: "curiosity_fallen" }
            ],
            [ 
              { text: "💥 KSCERATO", callback_data: "curiosity_kscerato" },
              { text: "🧢 molodoy", callback_data: "curiosity_molodoy" }
            ],
            [
              { text: "🚀 YEKINDAR", callback_data: "curiosity_yekindar" },
              { text: "⬅️ Voltar ao menu", callback_data: "menu" }
            ],
            [
              { text: "❌ Encerrar conversa", callback_data: "close_chat" }
            ]
          ]
        }      
      }
    );
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "curiosity_kscerato") {
    bot.sendMessage(chatId,
      "💥 <b>KSCERATO (Kaike Cerato)</b>\n" +
      "• Um dos melhores jogadores da FURIA desde 2018.\n" +
      "• Mira absurda, estilo agressivo e inteligente.\n" +
      "• Já esteve entre os <b>20 melhores do mundo</b>.",
      { parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [ 
              { text: "🎓 FalleN", callback_data: "curiosity_fallen" },
              { text: "🪨 yuurih", callback_data: "curiosity_yuurih" }
            ],
            [ 
              { text: "🧢 molodoy", callback_data: "curiosity_molodoy" }
            ],
            [
              { text: "🚀 YEKINDAR", callback_data: "curiosity_yekindar" },
              { text: "⬅️ Voltar ao menu", callback_data: "menu" }
            ],
            [
              { text: "❌ Encerrar conversa", callback_data: "close_chat" }
            ]
          ]
        }      
      }
    );
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "curiosity_molodoy") {
    bot.sendMessage(chatId,
      "🧢 <b>molodoy (Ilya Molodoy)</b>\n" +
      "• Nosso recruta! Chegando com vontade de brilhar.\n" +
      "• Ainda novo, mas com um futuro promissor!\n" +
      "• Fica de olho, ele promete fazer história! ✨",
      { parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [ 
              { text: "🎓 FalleN", callback_data: "curiosity_fallen" },
              { text: "🪨 yuurih", callback_data: "curiosity_yuurih" }
            ],
            [ 
              { text: "💥 KSCERATO", callback_data: "curiosity_kscerato" }
            ],
            [
              { text: "🚀 YEKINDAR", callback_data: "curiosity_yekindar" },
              { text: "⬅️ Voltar ao menu", callback_data: "menu" }
            ],
            [
              { text: "❌ Encerrar conversa", callback_data: "close_chat" }
            ]
          ]
        }      
      }
    );
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "curiosity_yekindar") {
    bot.sendMessage(chatId,
      "🚀 <b>YEKINDAR (Mareks Gaļinskis)</b>\n" +
      "• Estilo extremamente agressivo e impactante.\n" +
      "• Brilha abrindo espaço nos rounds TR.\n" +
      "• Destaque em 2022 como um dos maiores impactadores por round.",
      { parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [ 
              { text: "🎓 FalleN", callback_data: "curiosity_fallen" },
              { text: "🪨 yuurih", callback_data: "curiosity_yuurih" }
            ],
            [ 
              { text: "💥 KSCERATO", callback_data: "curiosity_kscerato" },
              { text: "🧢 molodoy", callback_data: "curiosity_molodoy" }
            ],
            [
              { text: "⬅️ Voltar ao menu", callback_data: "menu" }
            ],
            [
              { text: "❌ Encerrar conversa", callback_data: "close_chat" }
            ]
          ]
        }      
      }
    );
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "menu") {
    sendMainMenu(chatId); // usa a lógica que já diferencia as mensagens

    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    resetInactivityTimeout(chatId); 

  } else if (data === "close_chat") {
    bot.sendMessage(chatId, "Foi um prazer enooorme trocar essa ideia contigo, eu espero te ver mais vezes por aqui em? GGWP! GO FURIA! 🐾🐾😼");
    
    users[chatId].hasReceivedMenu = false;
    users[chatId].awaitingFirstMessageAfterClose = true;
  
    // Cancela o timeout ativo, se existir
    if (users[chatId].timeout) {
      clearTimeout(users[chatId].timeout);
      users[chatId].timeout = null;
    }
  
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });

  } else if (data.startsWith("other_wallpaper_")) {
    const index = parseInt(data.split("_").pop());
    sendWallpaper(chatId, index);
    resetInactivityTimeout(chatId);
  }
  
  bot.answerCallbackQuery(callbackQuery.id);
});

// Envia o menu principal
function sendMainMenu(chatId) {
  const user = users[chatId];

  if (!user) return; // segurança extra

  const nome = user.name || "player";

  if (!user.hasReceivedMenu) {
    user.hasReceivedMenu = true;

    const saudacao =
      `🔥 Eaaee, FUR ${nome} 🇧🇷!!! É um prazer enorme te ter na nossa comunidade! Sobre o que podemos conversar hoje?\n\n` +
      "1️⃣ - Ver os próximos jogos 📆\n" +
      "2️⃣ - Ver resultados recentes 🖋️\n" +
      "3️⃣ - Ver a escalação atual 👥\n" +
      "4️⃣ - Próximos torneios 🏆\n" +
      "5️⃣ - Link da nossa lojinha 🛒\n" +
      "6️⃣ - História da Fúria no CS 🔥\n" +
      "7️⃣ - Wallpaper para celular 📱\n" +
      "8️⃣ - Trocar apelido ✏️\n" +
      "9️⃣ - GGWP (sair) 🤩";

    bot.sendMessage(chatId, saudacao);
  } else {
    const menuDireto =
  "🔥 Segue os tópicos do nosso menu \n\n" +
    "1️⃣ - Ver os próximos jogos 📆\n" +
    "2️⃣ - Ver resultados recentes 🖋️\n" +
    "3️⃣ - Ver a escalação atual 👥\n" +
    "4️⃣ - Próximos torneios 🏆\n" +
    "5️⃣ - Link da nossa lojinha 🛒\n" +
    "6️⃣ - História da Fúria no CS 🔥\n" +
    "7️⃣ - Wallpaper para celular 📱\n" +
    "8️⃣ - Trocar apelido ✏️\n" +
    "9️⃣ - GGWP (sair) 🤩";

    bot.sendMessage(chatId, menuDireto);
  }
}


function resetInactivityTimeout(chatId) {
  const user = users[chatId];
  if (!user) return;

  // ❌ Não define timeout enquanto aguarda o nome do usuário
  if (user.waitingName) return;

  // Limpa timeout anterior se existir
  if (user.timeout) {
    clearTimeout(user.timeout);
  }

  // Define novo timeout
  user.timeout = setTimeout(() => {
    bot.sendMessage(chatId, "🕒 Devido à nossa inatividade, vou estar encerrando automaticamente nosso bate-papo, mas não se preocupe, quando você voltar estarei aqui para conversarmos novamente. 👋");
    users[chatId].hasReceivedMenu = false;
    users[chatId].timeout = null;
    users[chatId].awaitingFirstMessageAfterClose = true;
  }, 60 * 60 * 1000); // 1 hora
}

const fs = require("fs");

function sendWallpaper(chatId, index) {
  const item = wallpapers[index];
  if (!item) return;

  const nextIndex = index + 1;

  const buttons = [
    nextIndex < wallpapers.length
      ? [{ text: "➡️ Ver outro", callback_data: `other_wallpaper_${nextIndex}` }]
      : [],
    [
      { text: "📖 Menu", callback_data: "menu" },
      { text: "❌ Encerrar", callback_data: "close_chat" }
    ]
  ].filter(row => row.length > 0);

  const absolutePath = path.resolve(__dirname, item.path);
  const fileStream = fs.createReadStream(absolutePath); // <-- Correção aqui!

  bot.sendPhoto(chatId, fileStream, {
    caption: item.caption,
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}


// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escutando na porta ${PORT}`);
});
