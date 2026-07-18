const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

if (!global.aventureGlobalStats) global.aventureGlobalStats = {};
if (!global.aventureInventories) global.aventureInventories = {};

// Liste complète et officielle des 22 personnages
const characters = [
  { id: "1", name: "ʚʆɞ𝕔é𝕝𝕖𝕤𝕥𝕚𝕟 𝕥𝕙𝗲 𝕜𝕚𝕟げるʚʆɞ ネ", power: 89, basic: "Pouvoir de Mark Zuckerberg", ultimate: "Attaque + Coup Géant 🌪️", price: 0 },
  { id: "2", name: "Naruto (Mode Ermite)", power: 60, basic: "Rasengan 🌀", ultimate: "Fūton - Rasenshuriken 🌪️", price: 0 },
  { id: "3", name: "Naruto (Rikudo)", power: 70, basic: "Rasengan Géant 🌌", ultimate: "Bijuu Dama Rasenshuriken 💣", price: 0 },
  { id: "4", name: "Naruto (Baryon Mode)", power: 85, basic: "Punch Ultra Rapide ⚡", ultimate: "Explosion Chakra Nucléaire ☢️", price: 0 },
  { id: "5", name: "Sasuke Uchiha", power: 60, basic: "Chidori ⚡", ultimate: "Kirin 🐉⚡", price: 0 },
  { id: "6", name: "Sasuke (Taka)", power: 65, basic: "Lame de Chidori ⚔️", ultimate: "Amaterasu 🔥", price: 0 },
  { id: "7", name: "Sasuke (Rinnegan)", power: 70, basic: "Chidori Kagutsuchi 🔥⚡", ultimate: "Indra's Arrow ⚡🏹", price: 0 },
  { id: "8", name: "Kakashi Hatake", power: 60, basic: "Raikiri ⚡", ultimate: "Kamui 🌌", price: 0 },
  { id: "9", name: "Kakashi (DMS)", power: 75, basic: "Kamui Shuriken 🌀", ultimate: "Raikiri Susano'o 🛡️⚡", price: 0 },
  { id: "10", name: "Minato Namikaze", power: 80, basic: "Hiraishin Rasengan ⚡🌀", ultimate: "Mode Kyuubi 🦊", price: 0 },
  { id: "11", name: "Hashirama Senju", power: 70, basic: "Mokuton - Dragon de Bois 🪵", ultimate: "Mokuton - Bouddha aux Mille Mains 🖐️🏯", price: 0 },
  { id: "12", name: "Tobirama Senju", power: 60, basic: "Suiton - Dragon Aqueux 🌊", ultimate: "Parchemin Explosif Multiplicateur 💥", price: 0 },
  { id: "13", name: "Tsunade", power: 60, basic: "Coup de Poing Destructeur 💥", ultimate: "Création Renouveau 🩸", price: 0 },
  { id: "14", name: "Hiruzen Sarutobi", power: 65, basic: "Shuriken Multi-Clonage 🎯", ultimate: "L'Emprisonnement des Morts 👤", price: 0 },
  { id: "15", name: "Pain (Tendo)", power: 68, basic: "Banshō Ten'in 🧲", ultimate: "Shinra Tensei 💥🌌", price: 0 },
  { id: "16", name: "Itachi Uchiha", power: 70, basic: "Genjutsu - Les Corbeaux 🐦", ultimate: "Susano'o Totsuka 🛡️⚔️", price: 0 },
  { id: "17", name: "Madara (Rikudo)", power: 85, basic: "Gudōdama 🔘", ultimate: "Chibaku Tensei Céleste ☄️", price: 0 },
  { id: "18", name: "Obito Uchiha", power: 70, basic: "Kamui Intangibilité 🌪️", ultimate: "Invocation de Gedo Mazo 👹", price: 0 },
  { id: "19", name: "Kaguya Otsutsuki", power: 78, basic: "Aiguilles Capillaires 🪡", ultimate: "Amenominaka 🌍🌌", price: 45000 },
  { id: "20", name: "Boruto (Karma)", power: 75, basic: "Rasengan Compressé 🌪️", ultimate: "Destruction du Karma 🌟", price: 30000 },
  { id: "21", name: "Kawaki", power: 70, basic: "Transformation du Bras 🦾", ultimate: "Décharge de Karma 💥", price: 25000 },
  { id: "22", name: "Isshiki Otsutsuki", power: 90, basic: "Sukunahikona 🔍", ultimate: "Daikokuten ⏳", price: 50000 }
];

const shopItems = [
  { id: "potion", name: "🧪 Potion de Soin (Bonus +20 HP en combat)", price: 5000 },
  { id: "boost", name: "⚡ Relique de Puissance (+5 dégâts constants)", price: 12000 }
];

const damageSystem = {
  basic: { min: 10, max: 18, chakraCost: 0 },
  special: { min: 22, max: 35, chakraCost: 20 },
  ultimate: { min: 45, max: 65, chakraCost: 75, failChance: 0.2 },
  charge: { chakraGain: 30 }
};

const gameState = {};
const decor = "࿇ ══━━✥👑✥━━══ ࿇";

module.exports = {
  config: { 
    name: "aventure", 
    aliases: ["storm", "ns", "topaventure", "shopaventure", "top"],
    version: "14.5-FullUpdate",
    author: "Célestin & AI",
    role: 0,
    category: "game",
    description: { fr: "Jeu Naruto Storm complet avec les 22 personnages, Classement et Boutique." }
  },

  onStart: async function ({ message, event, usersData }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const args = event.body.trim().toLowerCase().split(/\s+/);
    const cmd = args[1];

    let uData = await usersData.get(userID) || {};
    if (!uData.name) uData.name = "Ninja";
    if (!uData.money) uData.money = 0;

    // Initialisation sécurisée de l'inventaire
    if (!global.aventureInventories[userID]) {
      global.aventureInventories[userID] = { 
        items: {}, 
        unlockedChars: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"] 
      };
    }

    // --- FONCTION : CLASSEMENT (TOP) ---
    if (event.body.toLowerCase().includes("top")) {
      const allPlayers = Object.values(global.aventureGlobalStats);
      if (allPlayers.length === 0) return message.reply("🏆 Aucun combat enregistré pour le moment.");
      
      allPlayers.sort((a, b) => (b.wins || 0) - (a.wins || 0));
      const canvas = createCanvas(600, 400); const ctx = canvas.getContext('2d');
      ctx.fillStyle = "#0c0d19"; ctx.fillRect(0, 0, 600, 400);
      ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 5; ctx.strokeRect(8, 8, 584, 384);
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("🏆 MEILLEURS UTILISATEURS D'AVENTURE 🏆", 300, 50);
      ctx.textAlign = "left"; ctx.font = "bold 15px sans-serif";
      
      for (let i = 0; i < Math.min(5, allPlayers.length); i++) {
        const p = allPlayers[i];
        ctx.fillStyle = i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#ffffff";
        ctx.fillText(`${i + 1}. ${p.name.substring(0, 20)} ➔ ${p.wins} Victoires | 💰 ${p.totalEarned} $`, 50, 120 + (i * 50));
      }
      const pathImg = path.join(__dirname, "cache", `top_${threadID}.png`);
      await fs.outputFile(pathImg, canvas.toBuffer('image/png'));
      await message.reply({ body: decor, attachment: fs.createReadStream(pathImg) });
      return fs.unlinkSync(pathImg);
    }

    // --- FONCTION : BOUTIQUE (SHOP) ---
    if (cmd === "shop" || event.body.toLowerCase().includes("shop")) {
      if (args[2]) {
        const itemIndex = parseInt(args[2]) - 1;
        const totalItemsCount = shopItems.length + 4; // 2 items + 4 personnages achetables

        if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= totalItemsCount) return message.reply("❌ Cet article n'existe pas.");
        
        // Achat consommables
        if (itemIndex < shopItems.length) {
          const item = shopItems[itemIndex];
          if (uData.money < item.price) return message.reply("❌ Vous n'avez pas assez d'argent réel pour cet achat !");
          uData.money -= item.price;
          await usersData.set(userID, { money: uData.money });
          global.aventureInventories[userID].items[item.id] = (global.aventureInventories[userID].items[item.id] || 0) + 1;
          return message.reply(`🛍️ Achat réussi ! Vous avez obtenu : **${item.name}**.`);
        } else {
          // Achat personnages premium (Kaguya, Boruto, Kawaki, Isshiki)
          const buyableChars = characters.filter(c => c.price > 0);
          const charItem = buyableChars[itemIndex - shopItems.length];
          
          if (global.aventureInventories[userID].unlockedChars.includes(charItem.id)) return message.reply("❌ Vous possédez déjà ce personnage !");
          if (uData.money < charItem.price) return message.reply("❌ Vous n'avez pas assez d'argent réel pour cet achat !");
          
          uData.money -= charItem.price;
          await usersData.set(userID, { money: uData.money });
          global.aventureInventories[userID].unlockedChars.push(charItem.id);
          return message.reply(`🎉 Personnage déverrouillé ! Vous pouvez maintenant jouer avec **${charItem.name}** !`);
        }
      }

      let shopTxt = `🛍️ ━━━ 𝗕𝗢𝗨𝗧𝗜𝗤𝗨𝗘 𝗗'𝗔𝗩block𝗡𝗧𝗨𝗥block ━━━\n\n🔹 **[ OBJETS ]**\n`;
      shopTxt += shopItems.map((item, i) => `[${i + 1}] ${item.name}\nPrix : **${item.price} $**`).join("\n\n");
      shopTxt += `\n\n👑 **[ NINJAS PREMIUM ]**\n`;
      const buyableChars = characters.filter(c => c.price > 0);
      shopTxt += buyableChars.map((char, i) => `[${shopItems.length + i + 1}] **${char.name}** [★ ${char.power}]\nPrix : **${char.price} $**`).join("\n\n");
      shopTxt += `\n\nPour acheter, tapez : **aventure shop [Numéro]**`;
      return message.reply(shopTxt);
    }

    // --- INITIALISATION DU MODE SOLO OU MULTI ---
    const isSolo = cmd === "solo" || args.includes("solo");
    gameState[threadID] = {
      step: isSolo ? "choose_characters_p1" : "waiting_start",
      isSolo: isSolo,
      players: { p1: userID, p2: isSolo ? "BOT_AI" : null },
      turn: null, p1Character: null, p2Character: null,
      p1HP: 100, p2HP: 100, p1Chakra: 100, p2Chakra: 100, chakraRegen: 8, defending: false,
      lastAction: isSolo ? "Mode Solo activé ! Choisissez votre légende." : "L'arène s'illumine... En attente des combattants."
    };

    if (isSolo) {
      const pInventory = global.aventureInventories[userID]?.unlockedChars || ["1"];
      const myChars = characters.filter(c => pInventory.includes(c.id));

      let characterList = "🎭 ━━━ 𝗠𝗢𝗗block 𝗦𝗢𝗟𝗢 : 𝗖𝗛𝗢𝗜𝗫 𝗗𝗨 𝗡𝗜𝗡𝗝𝗔 ━━━\n\n";
      characterList += myChars.map((char, i) => `📖 ${i + 1}. **${char.name}** [★ ${char.power}]`).join("\n");
      return message.reply(`${characterList}\n\n👉 @${uData.name} **Joueur 1**, tapez le numéro de votre personnage !`);
    }

    return message.reply(`${decor}\n📜 ━━━ 𝗔𝗥È𝗡暴 𝗡𝗔𝗥𝗨𝗧𝗢 𝗦𝗧𝗢𝗥𝗠 𝗛𝗗 ━━━\n\nEnvoyez **aventure start** pour un combat PvP ou **aventure solo** pour affronter l'IA !`);
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID; const userID = event.senderID; const body = event.body.toLowerCase().trim();
    if (!gameState[threadID]) return; const state = gameState[threadID];

    if (state.step !== "waiting_start" && !state.step.startsWith("choose_characters") && state.step !== "choose_p1" && state.step !== "choose_p2" && 
        userID !== state.players.p1 && userID !== state.players.p2 && !state.isSolo) return;

    if (body === 'fin') {
      delete gameState[threadID];
      return message.reply("🔄 Fin du combat. Retour au village.");
    }

    if (!state.isSolo) {
      if (state.step === "waiting_start" && (body === "start" || body === "aventure start")) {
        state.step = "choose_p1"; state.players.p1 = userID;
        return message.reply("🥷 **Joueur 1 prêt !** Envoyez **p1** pour confirmer.");
      }
      if (state.step === "choose_p1" && body === 'p1') {
        if (userID !== state.players.p1) return;
        state.step = "choose_p2";
        return message.reply("🔥 **L'arène attend le second combattant !** Envoyez **p2** pour rejoindre !");
      }
      if (state.step === "choose_p2" && body === 'p2') {
        if (userID === state.players.p1) return message.reply("❌ Mode PvP : vous ne pouvez pas jouer contre vous-même.");
        state.players.p2 = userID; state.step = "choose_characters_p1";
        
        const p1Inventory = global.aventureInventories[state.players.p1]?.unlockedChars || ["1"];
        const myChars = characters.filter(c => p1Inventory.includes(c.id));

        let characterList = "🎭 ━━━ 𝗦É𝗟block𝗖𝗧𝗜𝗢𝗡 𝗗block𝗦 𝗚blockblock𝗥𝗥𝗜block𝗥𝗦 ━━━\n\n";
        characterList += myChars.map((char, i) => `🔹 [${i + 1}] **${char.name}**`).join("\n");
        const p1Name = (await usersData.get(state.players.p1)).name;
        return message.reply(`${characterList}\n\n👉 @${p1Name} **Joueur 1**, choisissez votre numéro.`);
      }
    }

    // --- SÉLECTION DU PERSONNAGE (CONFORME AUX 22 NINJAS) ---
    if (state.step.startsWith("choose_characters")) {
      const index = parseInt(body) - 1;
      const activeUser = state.step === "choose_characters_p1" ? state.players.p1 : state.players.p2;
      const pInventory = global.aventureInventories[activeUser]?.unlockedChars || ["1"];
      const myChars = characters.filter(c => pInventory.includes(c.id));

      if (isNaN(index) || index < 0 || index >= myChars.length) return;

      if (state.step === "choose_characters_p1" && userID === state.players.p1) {
        state.p1Character = myChars[index];
        const p1Name = (await usersData.get(state.players.p1)).name;
        
        if (state.isSolo) {
          state.p2Character = characters[Math.floor(Math.random() * characters.length)];
          state.turn = "p1"; state.step = "battle";
          return message.reply(`⚔️ **DÉBUT DU COMBAT SOLO** ⚔️\n\n👤 **@${p1Name}** incarne **${state.p1Character.name}**.\n🤖 **L'IA** jouera avec **${state.p2Character.name}**.\n\nTapez **a**, **b**, **x**, **c** ou **d** pour lancer les hostilités !`);
        } else {
          state.step = "choose_characters_p2";
          const p2Name = (await usersData.get(state.players.p2)).name;
          
          const p2Inventory = global.aventureInventories[state.players.p2]?.unlockedChars || ["1"];
          const myCharsP2 = characters.filter(c => p2Inventory.includes(c.id));
          
          let characterList = "🎭 ━━━ 𝗦É𝗟block𝗖𝗧𝗜𝗢𝗡 𝗗block𝗦 𝗚blockblock𝗥𝗥𝗜block𝗥𝗦 ━━━\n\n";
          characterList += myCharsP2.map((char, i) => `🔹 [${i + 1}] **${char.name}**`).join("\n");
          
          return message.reply(`${characterList}\n\n✨ **${state.p1Character.name}** sélectionné.\n\n👉 @${p2Name} **Joueur 2**, choisissez votre numéro !`);
        }
      }

      if (state.step === "choose_characters_p2" && userID === state.players.p2) {
        state.p2Character = myChars[index]; state.turn = "p1"; state.step = "battle";
        const p1Name = (await usersData.get(state.players.p1)).name;
        return message.reply(`⚔️ Le combat commence ! @${p1Name}, commencez !`);
      }
    }

    // --- SYSTÈME DE COMBAT AU TOUR PAR TOUR ---
    if (state.step === "battle") {
      let currentPlayer = state.turn === "p1" ? state.players.p1 : state.players.p2;
      
      if (state.isSolo && state.turn === "p2") {
        const aiChoices = ['a', 'b', 'c', 'd'];
        if (state.p2Chakra >= 75) aiChoices.push('x');
        const aiAction = aiChoices[Math.floor(Math.random() * aiChoices.length)];
        return executeTurn(aiAction, "BOT_AI");
      }

      if (userID !== currentPlayer) return;
      return executeTurn(body, userID);

      async function executeTurn(action, playerID) {
        const attacker = state.turn === "p1" ? state.p1Character : state.p2Character;
        const defender = state.turn === "p1" ? state.p2Character : state.p1Character;
        const hpKey = state.turn === "p1" ? "p2HP" : "p1HP";
        const chakraKey = state.turn === "p1" ? "p1Chakra" : "p2Chakra";

        let damage = 0; let chakraUsed = 0; let missed = false;
        let actionType = "attack";

        let dmgBuff = 0;
        if (playerID !== "BOT_AI" && global.aventureInventories[playerID]?.items?.boost) dmgBuff = 5;

        switch (action) {
          case 'a':
            damage = Math.floor(Math.random() * (damageSystem.basic.max - damageSystem.basic.min + 1)) + damageSystem.basic.min + dmgBuff;
            state.lastAction = `${attacker.name} effectue un Enchaînement d'Assaut !`;
            break;
          case 'b':
            if (state[chakraKey] < damageSystem.special.chakraCost) {
              if (playerID === "BOT_AI") return executeTurn('a', "BOT_AI");
              return message.reply("❌ Pas assez de Chakra !");
            }
            damage = Math.floor(Math.random() * (damageSystem.special.max - damageSystem.special.min + 1)) + damageSystem.special.min + dmgBuff;
            chakraUsed = damageSystem.special.chakraCost;
            state.lastAction = `${attacker.name} déchaîne : ${attacker.basic} !`;
            break;
          case 'x':
            if (state[chakraKey] < damageSystem.ultimate.chakraCost) {
              if (playerID === "BOT_AI") return executeTurn('a', "BOT_AI");
              return message.reply("❌ Vos réserves sont vides pour l'Ultime !");
            }
            chakraUsed = damageSystem.ultimate.chakraCost;
            if (Math.random() < damageSystem.ultimate.failChance) {
              missed = true;
              state.lastAction = `💨 Esquive parfaite ! L'Ultime de ${attacker.name} échoue !`;
            } else {
              damage = Math.floor(Math.random() * (damageSystem.ultimate.max - damageSystem.ultimate.min + 1)) + damageSystem.ultimate.min + dmgBuff;
              state.lastAction = `🔥 SPECTACULAIRE ! ${attacker.name} lance : ${attacker.ultimate} !`;
            }
            break;
          case 'c':
            state[chakraKey] = Math.min(100, state[chakraKey] + damageSystem.charge.chakraGain);
            actionType = "charge";
            state.lastAction = `🔋 ${attacker.name} accumule son flux d'énergie (+30% Chakra)`;
            break;
          case 'd':
            state.defending = state.turn;
            actionType = "defend";
            state.lastAction = `🛡️ ${attacker.name} se place en Garde Impériale !`;
            break;
          default:
            if (playerID === "BOT_AI") return executeTurn('a', "BOT_AI");
            return;
        }

        if (actionType === "attack") {
          if (!missed) {
            if (state.defending && state.defending !== state.turn) {
              damage = Math.floor(damage * 0.5);
              state.lastAction += ` (Amorti : -${damage} PV)`;
            } else {
              state.lastAction += ` (-${damage} PV)`;
            }
            state[chakraKey] -= chakraUsed;
            state[hpKey] = Math.max(0, state[hpKey] - damage);
          } else {
            state[chakraKey] = Math.max(0, state[chakraKey] - 10);
          }
        }

        if (state.turn === "p1") state.p1Chakra = Math.min(100, state.p1Chakra + state.chakraRegen);
        else state.p2Chakra = Math.min(100, state.p2Chakra + state.chakraRegen);

        const p1Data = await usersData.get(state.players.p1);
        const p2Name = state.isSolo ? "IA_BOT" : (await usersData.get(state.players.p2)).name;
        const p1Name = p1Data.name;

        // ---- MOTEUR GRAPHIQUE HD ----
        const canvas = createCanvas(800, 500); const ctx = canvas.getContext('2d');
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
        bgGrad.addColorStop(0, '#090b16'); bgGrad.addColorStop(1, '#030408');
        ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, 800, 500);
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 6; ctx.strokeRect(10, 10, 780, 480);

        // Gauche (P1)
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(p1Name.substring(0, 18), 40, 55);
        ctx.fillStyle = "#ffd700"; ctx.font = "bold 15px sans-serif"; ctx.fillText(state.p1Character.name, 40, 80);
        ctx.fillStyle = "#220000"; ctx.fillRect(40, 100, 280, 24);
        ctx.fillStyle = '#ff1a1a'; ctx.fillRect(40, 100, (state.p1HP / 100) * 280, 24);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px sans-serif"; ctx.fillText(`❤️ HP: ${state.p1HP}/100`, 50, 117);
        ctx.fillStyle = "#0c1a30"; ctx.fillRect(40, 135, 220, 16);
        ctx.fillStyle = "#00bfff"; ctx.fillRect(40, 135, (state.p1Chakra / 100) * 220, 16);

        // Droite (P2 / IA)
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "right";
        ctx.fillText(p2Name.substring(0, 18), 760, 55);
        ctx.fillStyle = "#ffd700"; ctx.font = "bold 15px sans-serif"; ctx.fillText(state.p2Character.name, 760, 80);
        ctx.fillStyle = "#220000"; ctx.fillRect(480, 100, 280, 24);
        ctx.fillStyle = '#ff1a1a'; ctx.fillRect(480, 100, (state.p2HP / 100) * 280, 24);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px sans-serif"; ctx.fillText(`❤️ HP: ${state.p2HP}/100`, 490, 117);
        ctx.fillStyle = "#0c1a30"; ctx.fillRect(540, 135, 220, 16);
        ctx.fillStyle = "#00bfff"; ctx.fillRect(540, 135, (state.p2Chakra / 100) * 220, 16);

        // Zone centrale Log Actions
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)"; ctx.fillRect(40, 190, 720, 180);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)"; ctx.lineWidth = 2; ctx.strokeRect(40, 190, 720, 180);
        ctx.textAlign = "center"; ctx.fillStyle = "#00ffff"; ctx.font = "bold 16px sans-serif";
        ctx.fillText("⚡ ÉTAT DES ACTIONS DE L'ARÈNE ⚡", 400, 225);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 18px sans-serif"; ctx.fillText(state.lastAction, 400, 290);

        // Fin du combat
        if (state.p1HP <= 0 || state.p2HP <= 0) {
          const isP1Winner = state.p2HP <= 0;
          const winnerName = isP1Winner ? p1Name : p2Name;
          const winnerID = isP1Winner ? state.players.p1 : state.players.p2;
          const cashReward = state.isSolo ? 7500 : 15000;

          if (winnerID !== "BOT_AI") {
            const wData = isP1Winner ? p1Data : await usersData.get(winnerID);
            await usersData.set(winnerID, { money: (wData.money || 0) + cashReward });

            if (!global.aventureGlobalStats[winnerID]) {
              global.aventureGlobalStats[winnerID] = { name: winnerName, wins: 0, totalEarned: 0 };
            }
            global.aventureGlobalStats[winnerID].wins += 1;
            global.aventureGlobalStats[winnerID].totalEarned += cashReward;
          }

          ctx.fillStyle = "#00ff66"; ctx.font = "bold 22px sans-serif";
          ctx.fillText(`🏆 VICTOIRE DE ${winnerName.toUpperCase()} 🏆`, 400, 425);
          ctx.fillStyle = "#ffd700"; ctx.font = "bold 16px sans-serif";
          ctx.fillText(`💰 CASH DÉVERROUILLÉ : +${cashReward} $ ajoutés sur votre compte réel !`, 400, 460);
        } else {
          state.turn = state.turn === "p1" ? "p2" : "p1";
          state.defending = false;
          const nextPlayerName = state.turn === "p1" ? p1Name : p2Name;
          ctx.fillStyle = "#ffaa00"; ctx.font = "bold 16px sans-serif";
          ctx.fillText(`👉 TOUR SUIVANT : À toi de jouer, ${nextPlayerName} !`, 400, 445);
        }

        const pathImg = path.join(__dirname, "cache", `battle_hd_${threadID}.png`);
        await fs.ensureDir(path.dirname(pathImg));
        await fs.writeFile(pathImg, canvas.toBuffer('image/png'));
        await message.reply({ body: decor, attachment: fs.createReadStream(pathImg) });
        fs.unlinkSync(pathImg);

        if (state.p1HP <= 0 || state.p2HP <= 0) {
          delete gameState[threadID];
        } else if (state.isSolo && state.turn === "p2") {
          setTimeout(() => { executeTurn('a', "BOT_AI"); }, 1500);
        }
        return;
      }
    }
  }
};
