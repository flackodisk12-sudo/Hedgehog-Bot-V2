const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

if (!global.aventureGlobalStats) global.aventureGlobalStats = {};
if (!global.aventureInventories) global.aventureInventories = {};
if (!global.aventureCooldowns) global.aventureCooldowns = {};

const characters = [
  { name: "ʚʆɞ𝕔é𝕝𝕖𝕤𝕥𝕚𝕟 𝕥𝕙𝗲 𝕜𝕚𝕟げるʚʆɞ ネ", power: 89, basic: "Pouvoir de Mark Zuckerberg", ultimate: "Attaque + Coup Géant 🌪️" },
  { name: "Naruto (Baryon Mode)", power: 85, basic: "Punch Ultra Rapide ⚡", ultimate: "Explosion Chakra Nucléaire ☢️" },
  { name: "Sasuke (Rinnegan)", power: 70, basic: "Amaterasu 🔥", ultimate: "Indra's Arrow ⚡🏹" },
  { name: "Minato Namikaze", power: 80, basic: "Hiraishin Rasengan ⚡🌀", ultimate: "Mode Kyuubi 🦊" },
  { name: "Isshiki Otsutsuki", power: 90, basic: "Sukunahikona 🔍", ultimate: "Daikokuten ⏳" }
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
    aliases: ["storm", "ns", "topaventure", "shopaventure", "top", "profil", "entrainement"],
    version: "13.0-SoloFixUpdate",
    author: "Célestin & AI",
    role: 0,
    category: "game",
    description: { fr: "Jeu Naruto Storm amélioré avec un meilleur bot Solo, Profil et Entraînement." }
  },

  onStart: async function ({ message, event, usersData }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const args = event.body.trim().toLowerCase().split(" ");
    const cmd = args[1];

    // --- FONCTION : PROFIL / INVENTAIRE ---
    if (cmd === "profil" || event.body.toLowerCase().includes("profil")) {
      const uData = await usersData.get(userID);
      const stats = global.aventureGlobalStats[userID] || { wins: 0, totalEarned: 0 };
      const inv = global.aventureInventories[userID] || {};
      
      let msg = `👤 ━━━ 𝗣𝗥𝗢𝗙𝗜𝗟 𝗗'𝗔𝗩𝗘𝗡𝗧𝗨𝗥𝗘 ━━━\n\n`;
      msg += `👑 Nom : **${uData.name}**\n`;
      msg += `💰 Argent : **${uData.money || 0} $**\n`;
      msg += `🏆 Victoires : **${stats.wins}**\n`;
      msg += `💸 Total Gagné : **${stats.totalEarned} $**\n\n`;
      msg += `🎒 𝗜𝗡𝗩𝗘𝗡𝗧𝗔𝗜𝗥𝗘 :\n`;
      msg += `🧪 Potions : ${inv.potion || 0}\n`;
      msg += `⚡ Reliques : ${inv.boost || 0}\n`;
      return message.reply(msg);
    }

    // --- FONCTION : ENTRAÎNEMENT (GAIN D'ARGENT) ---
    if (cmd === "entrainement" || event.body.toLowerCase().includes("entrainement")) {
      const cooldown = 3600000; // 1 heure de temps de recharge
      if (global.aventureCooldowns[userID] && Date.now() - global.aventureCooldowns[userID] < cooldown) {
        const remaining = Math.ceil((cooldown - (Date.now() - global.aventureCooldowns[userID])) / 60000);
        return message.reply(`⏳ Tu es fatigué ! Reviens t'entraîner dans **${remaining} minute(s)**.`);
      }
      
      const gain = Math.floor(Math.random() * (3000 - 1500 + 1)) + 1500;
      const uData = await usersData.get(userID);
      await usersData.set(userID, { money: (uData.money || 0) + gain });
      global.aventureCooldowns[userID] = Date.now();
      
      return message.reply(`💪 **Entraînement réussi !** Tu as bossé dur avec les clones et gagné **${gain} $** !`);
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
        if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= shopItems.length) return message.reply("❌ Cet article n'existe pas.");
        const item = shopItems[itemIndex];
        const uData = await usersData.get(userID);
        if ((uData.money || 0) < item.price) return message.reply("❌ Vous n'avez pas assez d'argent réel pour cet achat !");
        
        await usersData.set(userID, { money: uData.money - item.price });
        if (!global.aventureInventories[userID]) global.aventureInventories[userID] = {};
        global.aventureInventories[userID][item.id] = (global.aventureInventories[userID][item.id] || 0) + 1;
        
        return message.reply(`🛍️ Achat réussi ! Vous avez obtenu : **${item.name}**.`);
      }

      let shopTxt = `🛍️ ━━━ 𝗕𝗢𝗨𝗧𝗜𝗤𝗨𝗘 𝗗'𝗔𝗩block𝗡𝗧𝗨𝗥block ━━━\n\n`;
      shopTxt += shopItems.map((item, i) => `🔹 [${i + 1}] ${item.name}\nPrix : **${item.price} $**`).join("\n\n");
      shopTxt += `\n\nPour acheter, tapez : **aventure shop [Numéro]**`;
      return message.reply(shopTxt);
    }

    // --- INITIALISATION DU MODE SOLO OU MULTI ---
    const isSolo = cmd === "solo";
    gameState[threadID] = {
      step: isSolo ? "choose_characters_p1" : "waiting_start",
      isSolo: isSolo,
      players: { p1: userID, p2: isSolo ? "BOT_AI" : null },
      turn: null, p1Character: null, p2Character: null,
      p1HP: 100, p2HP: 100, p1Chakra: 100, p2Chakra: 100, chakraRegen: 8, defending: false,
      lastAction: isSolo ? "Mode Solo activé ! Choisissez votre légende." : "L'arène s'illumine... En attente des combattants."
    };

    if (isSolo) {
      let characterList = "🎭 ━━━ 𝗠𝗢𝗗block 𝗦𝗢𝗟𝗢 : 𝗖𝗛𝗢𝗜𝗫 𝗗𝗨 𝗡𝗜𝗡𝗝𝗔 ━━━\n\n";
      characterList += characters.map((char, i) => `🔹 [${i + 1}] **${char.name}** (Puissance: ${char.power})`).join("\n");
      return message.reply(`${characterList}\n\n👉 Entrez le numéro de votre personnage !`);
    }

    return message.reply(`${decor}\n📜 ━━━ 𝗔𝗥È𝗡È 𝗡𝗔𝗥𝗨𝗧𝗢 𝗦𝗧𝗢𝗥𝗠 𝗛𝗗 ━━━\n\nEnvoyez **start** pour un combat PvP ou **start solo** pour affronter l'IA !`);
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID; const userID = event.senderID; const body = event.body.toLowerCase().trim();
    if (!gameState[threadID]) return; const state = gameState[threadID];

    if (state.step !== "waiting_start" && state.step !== "choose_p1" && state.step !== "choose_p2" && 
        userID !== state.players.p1 && userID !== state.players.p2 && !state.isSolo) return;

    if (body === 'fin') {
      delete gameState[threadID];
      return message.reply("🔄 Fin du combat. Retour au village.");
    }

    if (!state.isSolo) {
      if (state.step === "waiting_start" && body === "start") {
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
        let characterList = "🎭 ━━━ 𝗦É𝗟block𝗖𝗧𝗜𝗢𝗡 𝗗block𝗦 𝗚blockblock𝗥𝗥𝗜block𝗥𝗦 ━━━\n\n";
        characterList += characters.map((char, i) => `🔹 [${i + 1}] **${char.name}**`).join("\n");
        const p1Name = (await usersData.get(state.players.p1)).name;
        return message.reply(`${characterList}\n\n👉 @${p1Name} **Joueur 1**, choisissez votre numéro.`);
      }
    }

    // --- SÉLECTION DU PERSONNAGE ---
    if (state.step.startsWith("choose_characters")) {
      const index = parseInt(body) - 1;
      if (isNaN(index) || index < 0 || index >= characters.length) return message.reply("❌ Numéro invalide.");

      if (state.step === "choose_characters_p1" && userID === state.players.p1) {
        state.p1Character = characters[index];
        
        if (state.isSolo) {
          state.p2Character = characters[Math.floor(Math.random() * characters.length)];
          state.turn = "p1"; state.step = "battle";
          return message.reply(`⚔️ **DÉBUT DU COMBAT SOLO** ⚔️\n\nVous incarnez **${state.p1Character.name}**.\nVotre adversaire (IA) sera **${state.p2Character.name}**.\n\nTapez **a**, **b**, **x**, **c** ou **d** pour lancer les hostilités !`);
        } else {
          state.step = "choose_characters_p2";
          const p2Name = (await usersData.get(state.players.p2)).name;
          return message.reply(`✨ **${state.p1Character.name}** sélectionné.\n\n👉 @${p2Name} **Joueur 2**, choisissez votre numéro !`);
        }
      }

      if (state.step === "choose_characters_p2" && userID === state.players.p2) {
        state.p2Character = characters[index]; state.turn = "p1"; state.step = "battle";
        const p1Name = (await usersData.get(state.players.p1)).name;
        return message.reply(`⚔️ Le grand Showing commence ! @${p1Name}, commencez !`);
      }
    }

    // --- SYSTÈME DE COMBAT AU TOUR PAR TOUR ---
    if (state.step === "battle") {
      let currentPlayer = state.turn === "p1" ? state.players.p1 : state.players.p2;
      
      if (userID !== currentPlayer && state.turn === "p1") return;
      return executeTurn(body, userID);

      async function executeTurn(action, playerID) {
        const attacker = state.turn === "p1" ? state.p1Character : state.p2Character;
        const defender = state.turn === "p1" ? state.p2Character : state.p1Character;
        const hpKey = state.turn === "p1" ? "p2HP" : "p1HP";
        const chakraKey = state.turn === "p1" ? "p1Chakra" : "p2Chakra";

        let damage = 0; let tech = ""; let chakraUsed = 0; let missed = false;
        let actionType = "attack";

        // Buff permanent du shop
        let dmgBuff = 0;
        if (playerID !== "BOT_AI" && global.aventureInventories[playerID]?.boost) dmgBuff = 5;

        switch (action) {
          case 'a':
            damage = Math.floor(Math.random() * (damageSystem.basic.max - damageSystem.basic.min + 1)) + damageSystem.basic.min + dmgBuff;
            state.lastAction = `${attacker.name} effectue un Enchaînement d'Assaut !`;
            break;
          case 'b':
            if (state[chakraKey] < damageSystem.special.chakraCost) {
              return message.reply("❌ Pas assez de Chakra !");
            }
            damage = Math.floor(Math.random() * (damageSystem.special.max - damageSystem.special.min + 1)) + damageSystem.special.min + dmgBuff;
            chakraUsed = damageSystem.special.chakraCost;
            state.lastAction = `${attacker.name} déchaîne le Showing : ${attacker.basic} !`;
            break;
          case 'x':
            if (state[chakraKey] < damageSystem.ultimate.chakraCost) {
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
            return message.reply("❌ Action invalide.");
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

        // ---- DESSIN DE L'ARÈNE ----
        const canvas = createCanvas(800, 500); const ctx = canvas.getContext('2d');
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
        bgGrad.addColorStop(0, '#090b16'); bgGrad.addColorStop(1, '#030408');
        ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, 800, 500);
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 6; ctx.strokeRect(10, 10, 780, 480);

        // P1 Canvas
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(p1Name.substring(0, 18), 40, 55);
        ctx.fillStyle = "#ffd700"; ctx.font = "bold 15px sans-serif"; ctx.fillText(state.p1Character.name, 40, 80);
        ctx.fillStyle = "#220000"; ctx.fillRect(40, 100, 280, 24);
        ctx.fillStyle = '#ff1a1a'; ctx.fillRect(40, 100, (state.p1HP / 100) * 280, 24);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px sans-serif"; ctx.fillText(`❤️ HP: ${state.p1HP}/100`, 50, 117);
        ctx.fillStyle = "#0c1a30"; ctx.fillRect(40, 135, 220, 16);
        ctx.fillStyle = "#00bfff"; ctx.fillRect(40, 135, (state.p1Chakra / 100) * 220, 16);

        // P2 Canvas
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "right";
        ctx.fillText(p2Name.substring(0, 18), 760, 55);
        ctx.fillStyle = "#ffd700"; ctx.font = "bold 15px sans-serif"; ctx.fillText(state.p2Character.name, 760, 80);
        ctx.fillStyle = "#220000"; ctx.fillRect(480, 100, 280, 24);
        ctx.fillStyle = '#ff1a1a'; ctx.fillRect(480, 100, (state.p2HP / 100) * 280, 24);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px sans-serif"; ctx.fillText(`❤️ HP: ${state.p2HP}/100`, 490, 117);
        ctx.fillStyle = "#0c1a30"; ctx.fillRect(540, 135, 220, 16);
        ctx.fillStyle = "#00bfff"; ctx.fillRect(540, 135, (state.p2Chakra / 100) * 220, 16);

        // Logs
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)"; ctx.fillRect(40, 190, 720, 180);
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)"; ctx.lineWidth = 2; ctx.strokeRect(40, 190, 720, 180);
        ctx.textAlign = "center"; ctx.fillStyle = "#00ffff"; ctx.font = "bold 16px sans-serif";
        ctx.fillText("⚡ ÉTAT DES ACTIONS DE L'ARÈNE ⚡", 400, 225);
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 18px sans-serif"; ctx.fillText(state.lastAction, 400, 290);

        // Fin de match
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
          ctx.fillText(`💰 CASH DÉVERROUILLÉ : +${cashReward} $`, 400, 460);
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
          // INTELLIGENCE ARTIFICIELLE CORRIGÉE : Choix dynamique de l'action
          setTimeout(() => {
            let aiAction = 'a'; // Action par défaut
            const currentChakra = state.p2Chakra;

            if (currentChakra >= 75 && Math.random() < 0.6) {
              aiAction = 'x'; // Ultime
            } else if (currentChakra >= 20 && Math.random() < 0.5) {
              aiAction = 'b'; // Spécial
            } else if (currentChakra < 30 && Math.random() < 0.7) {
              aiAction = 'c'; // Recharge de chakra si trop bas
            } else if (state.p2HP < 40 && Math.random() < 0.3) {
              aiAction = 'd'; // Se défendre si low HP
            }

            executeTurn(aiAction, "BOT_AI");
          }, 2000);
        }
        return;
      }
    }
  }
};
