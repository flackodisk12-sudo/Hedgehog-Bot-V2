const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

if (!global.guerreLevels) global.guerreLevels = {};
if (!global.guerreState) global.guerreState = {};
if (!global.guerreTournois) global.guerreTournois = {};

const decor = "⚔️ ══━━✥ 𝔾𝕌𝔼ℝℝ𝔼 𝕎𝕆ℝ𝕃駄 𝕧𝟡 ✥━━══ ⚔️";
const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

const missionsSolo = [
  { level: 1, type: "Traque", target: "Zetsu Blanc", hp: 110, desc: "Traquez le clone espion dans les bois.", reward: 5000 },
  { level: 2, type: "Infiltration", target: "Kabuto Yakushi", hp: 130, desc: "Infiltrez les laboratoires souterrains.", reward: 7500 },
  { level: 3, type: "Assaut", target: "Deidara", hp: 160, desc: "Neutralisez l'artificier avant l'explosion.", reward: 10000 },
  { level: 4, type: "Capture", target: "Sasori", hp: 190, desc: "Désactivez la marionnette de collection.", reward: 13000 },
  { level: 5, type: "Survie", target: "Hidan", hp: 220, desc: "Survivez au rituel de la faux de sang.", reward: 16000 },
  { level: 6, type: "Traque", target: "Kakuzu", hp: 260, desc: "Détruisez ses cœurs élémentaires cachés.", reward: 20000 },
  { level: 7, type: "Infiltration", target: "Konan", hp: 310, desc: "Traversez le blizzard de papiers explosifs.", reward: 25000 },
  { level: 8, type: "Assaut", target: "Kisame Hoshigaki", hp: 370, desc: "Brisez la bulle d'eau géante du requin.", reward: 30000 },
  { level: 9, type: "Survie", target: "Itachi Uchiha", hp: 430, desc: "Échappez aux illusions oculaires éternelles.", reward: 36000 },
  { level: 10, type: "Capture", target: "Pain (Tendo)", hp: 500, desc: "Résistez au centre d'attraction céleste.", reward: 43000 },
  { level: 11, type: "Traque", target: "Obito Uchiha", hp: 580, desc: "Débusquez la proie à travers les dimensions.", reward: 51000 },
  { level: 12, type: "Assaut", target: "Madara Uchiha", hp: 680, desc: "Affrontez la tempête du Susanoo Parfait.", reward: 60000 },
  { level: 13, type: "Survie", target: "Kaguya Otsutsuki", hp: 790, desc: "Survivez aux failles spatio-temporelles.", reward: 70000 },
  { level: 14, type: "Élimination", target: "Bot Prime", hp: 950, desc: "Détruisez la matrice centrale du code.", reward: 85000 },
  { level: 15, type: "Ultime", target: "Célestin l'Immortel", hp: 1200, desc: "Détrônez le grand souverain de la guerre.", reward: 105000 }
];

function getMenuInstructions(playerName) {
  return `👉 **Action requise pour ${playerName} :**\nTapez directement une lettre dans le chat sans préfixe :\n\n` +
         `🔹 **a** : Assaut Direct (Dégâts physiques)\n` +
         `🔹 **b** : Jutsu Spécial (-25% Chakra)\n` +
         `🔹 **x** : TECHNIQUE ULTIME (-70% Chakra)\n` +
         `🔹 **c** : Charger le Chakra (+45)\n` +
         `🔹 **d** : Garde Tactique (Divise les dégâts par 3 au prochain tour)\n\n` +
         `🏳️ Tapez **fin** pour abandonner.`;
}

module.exports = {
  config: { 
    name: "guerre", 
    aliases: ["war", "campagne", "mission"],
    version: "9.0.0",
    author: "Célestin & AI",
    role: 0,
    category: "game",
    description: { fr: "Missions Solo graphiques, Top Canvas thématique, PvP p1/p2 et Tournois sans préfixe." }
  },

  onStart: async function ({ message, event, usersData, api }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const botID = api.getCurrentUserID();
    const args = event.body.split(" ");

    // --- 1. BANQUE ET CLASSEMENT (CANVAS DESIGN BANQUE) ---
    if (args[1] === "top" || args[1] === "classement") {
      const allUsers = await usersData.getAll();
      const topPlayers = allUsers
        .filter(u => u.money !== undefined)
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);

      const canvasTop = createCanvas(600, 750);
      const ctxTop = canvasTop.getContext('2d');

      // Fond style coffre-fort cyber
      const bgG = ctxTop.createLinearGradient(0, 0, 0, 750);
      bgG.addColorStop(0, '#020617'); bgG.addColorStop(0.5, '#0f172a'); bgG.addColorStop(1, '#020617');
      ctxTop.fillStyle = bgG; ctxTop.fillRect(0, 0, 600, 750);
      ctxTop.strokeStyle = '#10b981'; ctxTop.lineWidth = 6; ctxTop.strokeRect(10, 10, 580, 730);

      ctxTop.fillStyle = '#10b981'; ctxTop.font = 'bold 30px sans-serif'; ctxTop.textAlign = 'center';
      ctxTop.fillText("🏦 BANQUE FINANCIÈRE DE GUERRE 🏦", 300, 60);

      ctxTop.textAlign = 'left';
      ctxTop.font = 'bold 18px monospace';

      for (let i = 0; i < topPlayers.length; i++) {
        const u = topPlayers[i];
        const yPos = 120 + (i * 58);
        ctxTop.fillStyle = i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#1e293b';
        ctxTop.fillRect(30, yPos - 22, 540, 48);
        ctxTop.fillStyle = i < 3 ? '#0f172a' : '#f8fafc';
        ctxTop.fillText(`${i + 1}. ${u.name.substring(0, 22)}`, 45, yPos + 10);
        ctxTop.textAlign = 'right';
        ctxTop.fillText(`${(u.money || 0).toLocaleString()} $`, 550, yPos + 10);
        ctxTop.textAlign = 'left';
      }

      const pathTop = path.join(__dirname, "cache", `guerre_top_${threadID}.png`);
      await fs.ensureDir(path.dirname(pathTop));
      await fs.writeFile(pathTop, canvasTop.toBuffer('image/png'));
      await message.reply({ body: "Voici l'état des coffres de l'armée :", attachment: fs.createReadStream(pathTop) });
      return fs.unlinkSync(pathTop);
    }

    // --- 2. INSCRIPTION AU TOURNOI (4 JOUEURS) ---
    if (args[1] === "tournoi") {
      if (global.guerreTournois[threadID]) return message.reply("❌ Un tournoi est en cours de traitement ici.");
      const hostData = await usersData.get(userID);
      global.guerreTournois[threadID] = {
        status: "inscription",
        players: [{ id: userID, name: hostData.name || "Hôte" }],
        matches: [],
        currentMatchIndex: 0,
        winnersRound1: []
      };
      return message.reply(`📢 **TOURNOI DE GUERRE INITIÉ (4 Joueurs)**\n` +
                           `1. ${hostData.name}\n\n` +
                           `👉 Pour participer, écrivez simplement **join** dans le chat sans préfixe !`);
    }

    // --- 3. MODE EN DUEL PVP PARAMS P1 ET P2 ---
    if (args[1] === "pvp") {
      let p1 = args[2];
      let p2 = args[3];

      if (!p1 || !p2) return message.reply("❌ Format invalide. Exemple : \`guerre pvp [ID_P1] [ID_P2]\`");
      if (p1 === p2) return message.reply("⚔️ Affrontement impossible contre soi-même.");

      const p1Data = await usersData.get(p1);
      const p2Data = await usersData.get(p2);

      if (!p1Data || !p2Data) return message.reply("❌ Identifiants introuvables.");

      global.guerreState[threadID] = {
        mode: "pvp",
        playerID: p1,
        botID: p2, 
        playerName: p1Data.name || "Joueur 1",
        bossName: p2Data.name || "Joueur 2",
        playerHP: 250, playerMaxHP: 250,
        bossHP: 250, bossMaxHP: 250,
        playerChakra: 100, bossChakra: 100,
        turn: "player",
        lastAction: "L'arène PvP s'ouvre !",
        effectType: "none",
        userMoney: p1Data.money || 0,
        level: "DUEL J1 VS J2"
      };

      await sendVisualArena(message, threadID, global.guerreState[threadID], `⚔️ Match Lancé`);
      return message.reply(getMenuInstructions(p1Data.name));
    }

    // --- 4. MODE MISSIONS SOLO / TRAQUE PROIE ---
    if (!global.guerreLevels[userID]) global.guerreLevels[userID] = 1;
    const curLvl = global.guerreLevels[userID];
    if (curLvl > 15) return message.reply("👑 Toutes les proies ont été éradiquées avec succès !");

    const mission = missionsSolo[curLvl - 1];
    const uData = await usersData.get(userID);

    global.guerreState[threadID] = {
      mode: "mission",
      playerID: userID,
      botID: botID,
      playerName: uData.name,
      level: `LVL ${mission.level} | ${mission.type}`,
      bossName: mission.target,
      playerHP: 100 + (curLvl * 20),
      playerMaxHP: 100 + (curLvl * 20),
      bossHP: mission.hp,
      bossMaxHP: mission.hp,
      playerChakra: 100,
      bossChakra: 100,
      turn: "player",
      lastAction: `Cible : ${mission.desc}`, 
      effectType: "none", 
      userMoney: uData.money || 0,
      reward: mission.reward
    };

    await sendVisualArena(message, threadID, global.guerreState[threadID], `🎯 Proie recherchée : ${mission.target}`);
    return message.reply(getMenuInstructions(uData.name));
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const body = event.body.toLowerCase().trim();

    // TOURNOI INSCRIPTION SANS PREFIXE
    if (global.guerreTournois[threadID] && global.guerreTournois[threadID].status === "inscription") {
      const tournoi = global.guerreTournois[threadID];
      if (body === "join") {
        if (tournoi.players.some(p => p.id === userID)) return message.reply("⚠️ Déjà inscrit.");
        const pData = await usersData.get(userID);
        tournoi.players.push({ id: userID, name: pData.name || `Joueur ${tournoi.players.length + 1}` });
        
        let rep = `✅ Soldat prêt au combat (${tournoi.players.length}/4) :\n`;
        tournoi.players.forEach((p, i) => { rep += `${i + 1}. ${p.name}\n`; });
        await message.reply(rep);

        if (tournoi.players.length === 4) {
          tournoi.status = "en_cours";
          tournoi.matches = [
            { p1: tournoi.players[0], p2: tournoi.players[1], round: "Demi-Finale 1" },
            { p1: tournoi.players[2], p2: tournoi.players[3], round: "Demi-Finale 2" }
          ];
          tournoi.currentMatchIndex = 0;
          await message.reply("🔥 Arène pleine ! Lancement des éliminatoires.");
          startTournoiMatch(message, threadID, tournoi);
        }
        return;
      }
    }

    // ETAT DU COMBAT EN COURS
    if (!global.guerreState[threadID]) return;
    const state = global.guerreState[threadID];

    // Vérification des tours restrictifs
    if (state.turn === "player" && userID !== state.playerID) return;
    if (state.turn === "boss" && state.mode !== "mission" && userID !== state.botID) return;

    if (body === 'fin') {
      delete global.guerreState[threadID];
      if (global.guerreTournois[threadID]) delete global.guerreTournois[threadID];
      return message.reply("🏳️ Combat clôturé.");
    }

    const currentTurn = state.turn;
    let activeName = currentTurn === "player" ? state.playerName : state.bossName;
    let dmg = 0;
    let valid = false;

    if (['a', 'b', 'x', 'c', 'd'].includes(body)) {
      valid = true;
      let curChakra = currentTurn === "player" ? state.playerChakra : state.bossChakra;

      switch (body) {
        case 'a':
          dmg = Math.floor(Math.random() * 16) + 14;
          state.lastAction = `⚔️ ${activeName} attaque ! (-${dmg} HP)`;
          if (currentTurn === "player") {
            if (state.bossDefending) { dmg = Math.floor(dmg * 0.33); state.bossDefending = false; }
            state.bossHP = Math.max(0, state.bossHP - dmg);
          } else {
            if (state.playerDefending) { dmg = Math.floor(dmg * 0.33); state.playerDefending = false; }
            state.playerHP = Math.max(0, state.playerHP - dmg);
          }
          state.effectType = currentTurn === "player" ? "slash" : "boss_slash";
          break;
        case 'b':
          if (curChakra < 25) { message.reply("❌ Manque d'énergie (25% requis)"); return; }
          dmg = Math.floor(Math.random() * 26) + 24;
          if (currentTurn === "player") {
            state.playerChakra -= 25;
            if (state.bossDefending) { dmg = Math.floor(dmg * 0.33); state.bossDefending = false; }
            state.bossHP = Math.max(0, state.bossHP - dmg);
          } else {
            state.bossChakra -= 25;
            if (state.playerDefending) { dmg = Math.floor(dmg * 0.33); state.playerDefending = false; }
            state.playerHP = Math.max(0, state.playerHP - dmg);
          }
          state.lastAction = `⚡ Jutsu de ${activeName} ! (-${dmg} HP)`;
          state.effectType = currentTurn === "player" ? "lightning" : "boss_lightning";
          break;
        case 'x':
          if (curChakra < 70) { message.reply("❌ Énergie insuffisante pour l'Ultime (70% requis)"); return; }
          dmg = Math.floor(Math.random() * 50) + 45;
          if (currentTurn === "player") {
            state.playerChakra -= 70;
            if (state.bossDefending) { dmg = Math.floor(dmg * 0.33); state.bossDefending = false; }
            state.bossHP = Math.max(0, state.bossHP - dmg);
          } else {
            state.bossChakra -= 70;
            if (state.playerDefending) { dmg = Math.floor(dmg * 0.33); state.playerDefending = false; }
            state.playerHP = Math.max(0, state.playerHP - dmg);
          }
          state.lastAction = `🔥 SOUFFLE ULTIME DE ${activeName} !! (-${dmg} HP)`;
          state.effectType = currentTurn === "player" ? "explosion" : "boss_explosion";
          break;
        case 'c':
          if (currentTurn === "player") state.playerChakra = Math.min(100, state.playerChakra + 45);
          else state.bossChakra = Math.min(100, state.bossChakra + 45);
          state.lastAction = `🔋 Récupération de Chakra pour ${activeName} (+45)`;
          state.effectType = currentTurn === "player" ? "aura" : "boss_aura";
          break;
        case 'd':
          if (currentTurn === "player") state.playerDefending = true;
          else state.bossDefending = true;
          state.lastAction = `🛡️ Garde active pour ${activeName} !`;
          state.effectType = currentTurn === "player" ? "shield" : "boss_shield";
          break;
      }
    }

    if (!valid) return;

    if (currentTurn === "player") state.playerChakra = Math.min(100, state.playerChakra + 6);
    else state.bossChakra = Math.min(100, state.bossChakra + 6);

    // ANALYSE DE LA FIN DU COMBAT
    if (state.bossHP <= 0 || state.playerHP <= 0) {
      const winID = state.bossHP <= 0 ? state.playerID : state.botID;
      const winName = state.bossHP <= 0 ? state.playerName : state.bossName;

      // MODE SOLO MISSION
      if (state.mode === "mission" && state.bossHP <= 0) {
        const uData = await usersData.get(state.playerID);
        await usersData.set(state.playerID, { money: (uData.money || 0) + state.reward });
        global.guerreLevels[state.playerID] = (global.guerreLevels[state.playerID] || 1) + 1;
        await sendVisualArena(message, threadID, state, `🏆 Proie neutralisée ! Récompense : +${state.reward} $`);
        delete global.guerreState[threadID];
        return;
      }

      // MODE TOURNOI A 4
      if (global.guerreTournois[threadID]) {
        const tournoi = global.guerreTournois[threadID];
        await sendVisualArena(message, threadID, state, `👑 Match terminé ! ${winName} se qualifie.`);
        delete global.guerreState[threadID];

        if (tournoi.currentMatchIndex < 2) {
          tournoi.winnersRound1.push({ id: winID, name: winName });
          tournoi.currentMatchIndex++;

          if (tournoi.currentMatchIndex === 1) {
            await message.reply("➔ Place à la seconde Demi-Finale !");
            startTournoiMatch(message, threadID, tournoi);
          } else if (tournoi.currentMatchIndex === 2) {
            await message.reply("🔥 GRANDE FINALE DU TOURNOI PLANIFIÉE !");
            tournoi.matches.push({ p1: tournoi.winnersRound1[0], p2: tournoi.winnersRound1[1], round: "FINALE ABSOLUE" });
            startTournoiMatch(message, threadID, tournoi);
          }
        } else {
          await message.reply(`🏆👑 **INCROYABLE ! ${winName.toUpperCase()} REMPORTE LE TOURNOI SUPRÊME DE LA GUERRE !**`);
          delete global.guerreTournois[threadID];
        }
        return;
      }

      // PVP STANDARD
      await sendVisualArena(message, threadID, state, `👑 Vainqueur du Duel : ${winName} !`);
      delete global.guerreState[threadID];
      return;
    }

    // PASSAGE DES TOURS
    if (state.mode !== "mission" || global.guerreTournois[threadID]) {
      state.turn = currentTurn === "player" ? "boss" : "player";
      const nextPlayerName = state.turn === "player" ? state.playerName : state.bossName;
      await sendVisualArena(message, threadID, state, `🔄 Au tour suivant.`);
      return message.reply(getMenuInstructions(nextPlayerName));
    } else {
      // ACTIONS DU BOT AUTOMATIQUE (MODE SOLO)
      state.turn = "boss";
      await sendVisualArena(message, threadID, state, `🤖 La proie se défend...`);

      setTimeout(async () => {
        let bossDmg = Math.floor(Math.random() * 16) + 12;
        state.lastAction = `⚠️ ${state.bossName} contre-attaque violemment !`;
        state.effectType = "boss_slash";

        if (state.playerDefending) { bossDmg = Math.floor(bossDmg * 0.33); state.playerDefending = false; }
        state.playerHP = Math.max(0, state.playerHP - bossDmg);

        if (state.playerHP <= 0) {
          await sendVisualArena(message, threadID, state, `💀 Échec. La proie a pris le dessus.`);
          delete global.guerreState[threadID];
        } else {
          state.turn = "player";
          await sendVisualArena(message, threadID, state, `👉 À vous de jouer.`);
          await message.reply(getMenuInstructions(state.playerName));
        }
      }, 1200);
    }
  }
};

function startTournoiMatch(message, threadID, tournoi) {
  const match = tournoi.matches[tournoi.currentMatchIndex];
  global.guerreState[threadID] = {
    mode: "tournoi",
    playerID: match.p1.id,
    botID: match.p2.id,
    playerName: match.p1.name,
    bossName: match.p2.name,
    playerHP: 240, playerMaxHP: 240,
    bossHP: 240, bossMaxHP: 240,
    playerChakra: 100, bossChakra: 100,
    turn: "player",
    lastAction: `Match : ${match.round}`,
    effectType: "none",
    userMoney: 0,
    level: match.round
  };
  sendVisualArena(message, threadID, global.guerreState[threadID], `⚔️ Arène : ${match.round}`);
  setTimeout(() => message.reply(getMenuInstructions(match.p1.name)), 1000);
}

async function sendVisualArena(message, threadID, state, footerText) {
  const canvas = createCanvas(850, 560);
  const ctx = canvas.getContext('2d');

  // RENDER DYNAMIQUE DU THÈME SELON LE MODE DE JEU
  const bg = ctx.createLinearGradient(0, 0, 0, 560);
  if (state.mode === "mission") {
    // Thème Vert Sombre / Jungle pour la Traque des proies
    bg.addColorStop(0, '#022c22'); bg.addColorStop(0.7, '#064e3b'); bg.addColorStop(1, '#022c22');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 850, 560);
    ctx.strokeStyle = '#34d399';
  } else {
    // Thème Rouge/Bleu Électrique pour les Duels et Tournois
    bg.addColorStop(0, '#0f172a'); bg.addColorStop(0.7, '#1e1b4b'); bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 850, 560);
    ctx.strokeStyle = state.turn === "player" ? "#38bdf8" : "#f43f5e";
  }

  ctx.lineWidth = 6; ctx.strokeRect(10, 10, 830, 540);

  let pImg, bImg;
  try {
    const resUser = await axios.get(`https://graph.facebook.com/${state.playerID}/picture?width=512&access_token=${token}`, { responseType: 'arraybuffer' });
    pImg = await loadImage(Buffer.from(resUser.data, 'binary'));
  } catch (e) { pImg = null; }

  try {
    const resBot = await axios.get(`https://graph.facebook.com/${state.botID}/picture?width=512&access_token=${token}`, { responseType: 'arraybuffer' });
    bImg = await loadImage(Buffer.from(resBot.data, 'binary'));
  } catch (e) { bImg = null; }

  // Avatar Joueur 1
  ctx.save(); ctx.beginPath(); ctx.arc(140, 120, 65, 0, Math.PI * 2); ctx.clip();
  if (pImg) ctx.drawImage(pImg, 75, 55, 130, 130);
  else { ctx.fillStyle = '#475569'; ctx.fillRect(75, 55, 130, 130); }
  ctx.restore();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(140, 120, 65, 0, Math.PI * 2); ctx.stroke();

  // Avatar Joueur 2 / Bot Proie
  ctx.save(); ctx.beginPath(); ctx.arc(710, 120, 65, 0, Math.PI * 2); ctx.clip();
  if (bImg) ctx.drawImage(bImg, 645, 55, 130, 130);
  else { ctx.fillStyle = '#dc2626'; ctx.fillRect(645, 55, 130, 130); }
  ctx.restore();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(710, 120, 65, 0, Math.PI * 2); ctx.stroke();

  // Noms et Barres de Vie (HP / Chakra)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(state.playerName.substring(0, 14), 220, 85);
  ctx.fillStyle = '#1e293b'; ctx.fillRect(220, 105, 190, 20);
  ctx.fillStyle = '#22c55e'; ctx.fillRect(220, 105, (state.playerHP / state.playerMaxHP) * 190, 20);
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(220, 132, (state.playerChakra / 100) * 150, 12);

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(state.bossName.substring(0, 14), 630, 85);
  ctx.fillStyle = '#1e293b'; ctx.fillRect(440, 105, 190, 20);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(440, 105, (state.bossHP / state.bossMaxHP) * 190, 20);
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(480, 132, (state.bossChakra / 100) * 150, 12);

  // Historique central des actions
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; ctx.fillRect(50, 190, 750, 130);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fbbf24'; ctx.font = 'italic bold 42px sans-serif';
  ctx.fillText("VS", 425, 235);
  ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 16px sans-serif';
  ctx.fillText(state.lastAction, 425, 290);

  // Rendu des effets d'impacts
  if (state.effectType === "slash") {
    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(600, 100); ctx.lineTo(750, 200); ctx.stroke();
  } else if (state.effectType === "explosion") {
    ctx.fillStyle = 'rgba(249,115,22,0.7)'; ctx.beginPath(); ctx.arc(710, 120, 80, 0, Math.PI * 2); ctx.fill();
  } else if (state.effectType === "boss_slash") {
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(200, 100); ctx.lineTo(80, 200); ctx.stroke();
  } else if (state.effectType === "boss_explosion") {
    ctx.fillStyle = 'rgba(185,28,28,0.8)'; ctx.beginPath(); ctx.arc(140, 120, 80, 0, Math.PI * 2); ctx.fill();
  }

  // Console tactique inférieure
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; ctx.fillRect(50, 345, 750, 145);
  ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText("📡 CONSOLE TACTIQUE DE GUERRE — MODE INTERACTIF", 70, 380);
  ctx.fillStyle = state.mode === "mission" ? "#34d399" : "#38bdf8"; 
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`${state.level}`, 70, 435);

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(footerText, 425, 525);

  const pathImg = path.join(__dirname, "cache", `guerre_canvas_${threadID}.png`);
  await fs.ensureDir(path.dirname(pathImg));
  await fs.writeFile(pathImg, canvas.toBuffer('image/png'));
  await message.reply({ body: decor, attachment: fs.createReadStream(pathImg) });
  fs.unlinkSync(pathImg);
}

