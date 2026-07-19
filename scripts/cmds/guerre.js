const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

if (!global.guerreLevels) global.guerreLevels = {};
if (!global.guerreState) global.guerreState = {};
if (!global.guerreTournois) global.guerreTournois = {};

const decor = "⚔️ ══━━✥ 𝔾𝕌𝔼ℝℝ𝔼 𝕎𝕆ℝ𝕃𝔻 𝕧𝟙𝟘 ✥━━══ ⚔️";
const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

const missionsSolo = [
  { level: 1, type: "Traque", target: "Zetsu Blanc", hp: 110, desc: "Traquez le clone espion.", reward: 5000 },
  { level: 2, type: "Infiltration", target: "Kabuto Yakushi", hp: 130, desc: "Infiltrez les labos.", reward: 7500 },
  { level: 3, type: "Assaut", target: "Deidara", hp: 160, desc: "Évitez l'explosion d'argile.", reward: 10000 },
  { level: 4, type: "Capture", target: "Sasori", hp: 190, desc: "Désactivez la marionnette.", reward: 13000 },
  { level: 5, type: "Survie", target: "Hidan", hp: 220, desc: "Survivez au rituel de sang.", reward: 16000 },
  { level: 6, type: "Traque", target: "Kakuzu", hp: 260, desc: "Détruisez ses cœurs secrets.", reward: 20000 },
  { level: 7, type: "Infiltration", target: "Konan", hp: 310, desc: "Esquivez les papiers explosifs.", reward: 25000 },
  { level: 8, type: "Assaut", target: "Kisame Hoshigaki", hp: 370, desc: "Brisez la prison aqueuse.", reward: 30000 },
  { level: 9, type: "Survie", target: "Itachi Uchiha", hp: 430, desc: "Rompez le Tsukuyomi.", reward: 36000 },
  { level: 10, type: "Capture", target: "Pain (Tendo)", hp: 500, desc: "Contrez l'attraction céleste.", reward: 43000 },
  { level: 11, type: "Traque", target: "Obito Uchiha", hp: 580, desc: "Touchez l'intangible.", reward: 51000 },
  { level: 12, type: "Assaut", target: "Madara Uchiha", hp: 680, desc: "Affrontez le Susanoo.", reward: 60000 },
  { level: 13, type: "Survie", target: "Kaguya Otsutsuki", hp: 790, desc: "Esquivez les os cendreux.", reward: 70000 },
  { level: 14, type: "Élimination", target: "Bot Prime", hp: 950, desc: "Annihilez le noyau du code.", reward: 85000 },
  { level: 15, type: "Ultime", target: "Célestin l'Immortel", hp: 1200, desc: "Détrônez le Maître Suprême.", reward: 105000 }
];

module.exports = {
  config: { 
    name: "guerre", 
    aliases: ["war", "campagne", "mission"],
    version: "10.0.0",
    author: "Célestin & ",
    role: 0,
    category: "game",
    description: { fr: "Système visuel premium sans répétitions textuelles, Top avec Avatars et Cartes de victoires épurées." }
  },

  onStart: async function ({ message, event, usersData, api }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const botID = api.getCurrentUserID();
    const args = event.body.split(" ");

    // --- 1. BANQUE ET CLASSEMENT (AVEC AVATARS DES UTILISATEURS) ---
    if (args[1] === "top" || args[1] === "classement") {
      const allUsers = await usersData.getAll();
      const topPlayers = allUsers
        .filter(u => u.money !== undefined)
        .sort((a, b) => b.money - a.money)
        .slice(0, 5); // Top 5 pour une lisibilité parfaite des photos

      const canvasTop = createCanvas(650, 600);
      const ctxTop = canvasTop.getContext('2d');

      const bgG = ctxTop.createLinearGradient(0, 0, 0, 600);
      bgG.addColorStop(0, '#020617'); bgG.addColorStop(0.5, '#0b1329'); bgG.addColorStop(1, '#020617');
      ctxTop.fillStyle = bgG; ctxTop.fillRect(0, 0, 650, 600);
      ctxTop.strokeStyle = '#0284c7'; ctxTop.lineWidth = 6; ctxTop.strokeRect(10, 10, 630, 580);

      ctxTop.fillStyle = '#f8fafc'; ctxTop.font = 'bold 28px sans-serif'; ctxTop.textAlign = 'center';
      ctxTop.fillText("🏦 BANQUE MILITAIRE SUPRÊME 🏦", 325, 60);

      for (let i = 0; i < topPlayers.length; i++) {
        const u = topPlayers[i];
        const yPos = 130 + (i * 85);

        ctxTop.fillStyle = i === 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(30, 41, 59, 0.5)';
        ctxTop.fillRect(30, yPos - 35, 590, 70);
        ctxTop.strokeStyle = i === 0 ? '#fbbf24' : '#334155'; ctxTop.lineWidth = 2; ctxTop.strokeRect(30, yPos - 35, 590, 70);

        // Récupération de l'avatar du joueur classé
        let uImg;
        try {
          const resAv = await axios.get(`https://graph.facebook.com/${u.id}/picture?width=100&access_token=${token}`, { responseType: 'arraybuffer' });
          uImg = await loadImage(Buffer.from(resAv.data, 'binary'));
        } catch (e) { uImg = null; }

        ctxTop.save(); ctxTop.beginPath(); ctxTop.arc(80, yPos, 25, 0, Math.PI * 2); ctxTop.clip();
        if (uImg) ctxTop.drawImage(uImg, 55, yPos - 25, 50, 50);
        else { ctxTop.fillStyle = '#475569'; ctxTop.fillRect(55, yPos - 25, 50, 50); }
        ctxTop.restore();

        ctxTop.fillStyle = i === 0 ? '#fbbf24' : '#f8fafc'; ctxTop.font = 'bold 20px sans-serif'; ctxTop.textAlign = 'left';
        ctxTop.fillText(`#${i + 1}  ${u.name.substring(0, 18)}`, 150, yPos + 7);
        
        ctxTop.fillStyle = '#10b981'; ctxTop.font = 'bold 20px monospace'; ctxTop.textAlign = 'right';
        ctxTop.fillText(`${(u.money || 0).toLocaleString()} $`, 600, yPos + 7);
      }

      const pathTop = path.join(__dirname, "cache", `guerre_top_${threadID}.png`);
      await fs.ensureDir(path.dirname(pathTop));
      await fs.writeFile(pathTop, canvasTop.toBuffer('image/png'));
      await message.reply({ attachment: fs.createReadStream(pathTop) });
      return fs.unlinkSync(pathTop);
    }

    // --- 2. REGISTRATION DUEL TOURNOI À 4 ---
    if (args[1] === "tournoi") {
      if (global.guerreTournois[threadID]) return;
      const hostData = await usersData.get(userID);
      global.guerreTournois[threadID] = {
        status: "inscription",
        players: [{ id: userID, name: hostData.name || "Hôte" }],
        matches: [], currentMatchIndex: 0, winnersRound1: []
      };
      return message.reply(`📢 **TOURNOI RECRUTEMENT** (4 slots)\n1. ${hostData.name}\n\nTapez **join** sans préfixe.`);
    }

    // --- 3. DUEL ENTRÉE PVP DIRECTE (p1 vs p2) ---
    if (args[1] === "pvp") {
      let p1 = args[2], p2 = args[3];
      if (!p1 || !p2 || p1 === p2) return;

      const p1Data = await usersData.get(p1), p2Data = await usersData.get(p2);
      if (!p1Data || !p2Data) return;

      global.guerreState[threadID] = {
        mode: "pvp", playerID: p1, botID: p2, playerName: p1Data.name, bossName: p2Data.name,
        playerHP: 250, playerMaxHP: 250, bossHP: 250, bossMaxHP: 250, playerChakra: 100, bossChakra: 100,
        turn: "player", lastAction: "Lancement des hostilités PvP", effectType: "none", userMoney: p1Data.money || 0, level: "CONFRONTATION"
      };
      return await sendVisualArena(message, threadID, global.guerreState[threadID]);
    }

    // --- 4. CHARGEMENT MISSION SOLO ---
    if (!global.guerreLevels[userID]) global.guerreLevels[userID] = 1;
    const curLvl = global.guerreLevels[userID];
    if (curLvl > 15) return;

    const mission = missionsSolo[curLvl - 1];
    const uData = await usersData.get(userID);

    global.guerreState[threadID] = {
      mode: "mission", playerID: userID, botID: botID, playerName: uData.name,
      level: `Lvl ${mission.level} | ${mission.type}`, bossName: mission.target,
      playerHP: 100 + (curLvl * 20), playerMaxHP: 100 + (curLvl * 20), bossHP: mission.hp, bossMaxHP: mission.hp,
      playerChakra: 100, bossChakra: 100, turn: "player", lastAction: `${mission.desc}`, effectType: "none",
      userMoney: uData.money || 0, reward: mission.reward
    };
    return await sendVisualArena(message, threadID, global.guerreState[threadID]);
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const body = event.body.toLowerCase().trim();

    if (global.guerreTournois[threadID] && global.guerreTournois[threadID].status === "inscription" && body === "join") {
      const tournoi = global.guerreTournois[threadID];
      if (tournoi.players.some(p => p.id === userID)) return;
      const pData = await usersData.get(userID);
      tournoi.players.push({ id: userID, name: pData.name });

      if (tournoi.players.length === 4) {
        tournoi.status = "en_cours";
        tournoi.matches = [
          { p1: tournoi.players[0], p2: tournoi.players[1], round: "Demi-Finale A" },
          { p1: tournoi.players[2], p2: tournoi.players[3], round: "Demi-Finale B" }
        ];
        startTournoiMatch(message, threadID, tournoi);
      }
      return;
    }

    if (!global.guerreState[threadID]) return;
    const state = global.guerreState[threadID];

    if (state.turn === "player" && userID !== state.playerID) return;
    if (state.turn === "boss" && state.mode !== "mission" && userID !== state.botID) return;

    if (body === 'fin') {
      delete global.guerreState[threadID];
      if (global.guerreTournois[threadID]) delete global.guerreTournois[threadID];
      return;
    }

    const currentTurn = state.turn;
    let activeName = currentTurn === "player" ? state.playerName : state.bossName;
    let dmg = 0, valid = false;

    if (['a', 'b', 'x', 'c', 'd'].includes(body)) {
      valid = true;
      let curChakra = currentTurn === "player" ? state.playerChakra : state.bossChakra;

      switch (body) {
        case 'a':
          dmg = Math.floor(Math.random() * 16) + 16;
          state.lastAction = `${activeName} attaque ! (-${dmg} HP)`;
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
          if (curChakra < 25) return;
          dmg = Math.floor(Math.random() * 26) + 26;
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
          if (curChakra < 70) return;
          dmg = Math.floor(Math.random() * 50) + 50;
          if (currentTurn === "player") {
            state.playerChakra -= 70;
            if (state.bossDefending) { dmg = Math.floor(dmg * 0.33); state.bossDefending = false; }
            state.bossHP = Math.max(0, state.bossHP - dmg);
          } else {
            state.bossChakra -= 70;
            if (state.playerDefending) { dmg = Math.floor(dmg * 0.33); state.playerDefending = false; }
            state.playerHP = Math.max(0, state.playerHP - dmg);
          }
          state.lastAction = `🔥 SOUFFLE ULTIME DE ${activeName} !!`;
          state.effectType = currentTurn === "player" ? "explosion" : "boss_explosion";
          break;
        case 'c':
          if (currentTurn === "player") state.playerChakra = Math.min(100, state.playerChakra + 45);
          else state.bossChakra = Math.min(100, state.bossChakra + 45);
          state.lastAction = `🔋 Recouvrent de Chakra (+45)`;
          state.effectType = currentTurn === "player" ? "aura" : "boss_aura";
          break;
        case 'd':
          if (currentTurn === "player") state.playerDefending = true;
          else state.bossDefending = true;
          state.lastAction = `🛡️ Garde active pour ${activeName}`;
          state.effectType = currentTurn === "player" ? "shield" : "boss_shield";
          break;
      }
    }

    if (!valid) return;

    if (currentTurn === "player") state.playerChakra = Math.min(100, state.playerChakra + 6);
    else state.bossChakra = Math.min(100, state.bossChakra + 6);

    // DÉCISION FIN DE COMBAT
    if (state.bossHP <= 0 || state.playerHP <= 0) {
      const isWin = state.bossHP <= 0;
      const winID = isWin ? state.playerID : state.botID;
      const winName = isWin ? state.playerName : state.bossName;

      if (state.mode === "mission") {
        if (isWin) {
          const uData = await usersData.get(state.playerID);
          const currentMoney = uData.money || 0;
          const finalMoney = currentMoney + state.reward;
          await usersData.set(state.playerID, { money: finalMoney });
          global.guerreLevels[state.playerID] = (global.guerreLevels[state.playerID] || 1) + 1;
          
          return await sendVictoryCard(message, threadID, state.playerName, state.playerID, state.reward, finalMoney);
        }
        delete global.guerreState[threadID];
        return;
      }

      if (global.guerreTournois[threadID]) {
        const tournoi = global.guerreTournois[threadID];
        delete global.guerreState[threadID];
        if (tournoi.currentMatchIndex < 2) {
          tournoi.winnersRound1.push({ id: winID, name: winName });
          tournoi.currentMatchIndex++;
          if (tournoi.currentMatchIndex === 1) startTournoiMatch(message, threadID, tournoi);
          else if (tournoi.currentMatchIndex === 2) {
            tournoi.matches.push({ p1: tournoi.winnersRound1[0], p2: tournoi.winnersRound1[1], round: "GRANDE FINALE" });
            startTournoiMatch(message, threadID, tournoi);
          }
        } else {
          delete global.guerreTournois[threadID];
        }
        return;
      }

      delete global.guerreState[threadID];
      return;
    }

    // ALTERNANCE DE TOURS SANS TEXTES INUTILES
    if (state.mode !== "mission") {
      state.turn = currentTurn === "player" ? "boss" : "player";
      return await sendVisualArena(message, threadID, state);
    } else {
      state.turn = "boss";
      await sendVisualArena(message, threadID, state);

      setTimeout(async () => {
        let bossDmg = Math.floor(Math.random() * 16) + 14;
        state.lastAction = `⚠️ Riposte sauvage de ${state.bossName} ! (-${bossDmg})`;
        state.effectType = "boss_slash";

        if (state.playerDefending) { bossDmg = Math.floor(bossDmg * 0.33); state.playerDefending = false; }
        state.playerHP = Math.max(0, state.playerHP - bossDmg);

        if (state.playerHP <= 0) {
          delete global.guerreState[threadID];
        } else {
          state.turn = "player";
          await sendVisualArena(message, threadID, state);
        }
      }, 1000);
    }
  }
};

function startTournoiMatch(message, threadID, tournoi) {
  const match = tournoi.matches[tournoi.currentMatchIndex];
  global.guerreState[threadID] = {
    mode: "tournoi", playerID: match.p1.id, botID: match.p2.id, playerName: match.p1.name, bossName: match.p2.name,
    playerHP: 240, playerMaxHP: 240, bossHP: 240, bossMaxHP: 240, playerChakra: 100, bossChakra: 100,
    turn: "player", lastAction: `Match : ${match.round}`, effectType: "none", userMoney: 0, level: match.round
  };
  sendVisualArena(message, threadID, global.guerreState[threadID]);
}

async function sendVisualArena(message, threadID, state) {
  const canvas = createCanvas(850, 480);
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, 480);
  bg.addColorStop(0, '#020617'); bg.addColorStop(1, '#0f172a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 850, 480);
  ctx.strokeStyle = state.turn === "player" ? "#38bdf8" : "#ef4444"; ctx.lineWidth = 5; ctx.strokeRect(10, 10, 830, 460);

  let pImg, bImg;
  try {
    const resUser = await axios.get(`https://graph.facebook.com/${state.playerID}/picture?width=250&access_token=${token}`, { responseType: 'arraybuffer' });
    pImg = await loadImage(Buffer.from(resUser.data, 'binary'));
  } catch (e) { pImg = null; }

  try {
    const resBot = await axios.get(`https://graph.facebook.com/${state.botID}/picture?width=250&access_token=${token}`, { responseType: 'arraybuffer' });
    bImg = await loadImage(Buffer.from(resBot.data, 'binary'));
  } catch (e) { bImg = null; }

  ctx.save(); ctx.beginPath(); ctx.arc(130, 110, 60, 0, Math.PI * 2); ctx.clip();
  if (pImg) ctx.drawImage(pImg, 70, 50, 120, 120);
  ctx.restore();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(130, 110, 60, 0, Math.PI * 2); ctx.stroke();

  ctx.save(); ctx.beginPath(); ctx.arc(720, 110, 60, 0, Math.PI * 2); ctx.clip();
  if (bImg) ctx.drawImage(bImg, 660, 50, 120, 120);
  ctx.restore();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(720, 110, 60, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(state.playerName.substring(0, 14), 210, 80);
  ctx.fillStyle = '#1e293b'; ctx.fillRect(210, 95, 180, 16);
  ctx.fillStyle = '#22c55e'; ctx.fillRect(210, 95, (state.playerHP / state.playerMaxHP) * 180, 16);
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(210, 118, (state.playerChakra / 100) * 140, 8);

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(state.bossName.substring(0, 14), 640, 80);
  ctx.fillStyle = '#1e293b'; ctx.fillRect(460, 95, 180, 16);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(460, 95, (state.bossHP / state.bossMaxHP) * 180, 16);
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(500, 118, (state.bossChakra / 100) * 140, 8);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fillRect(40, 180, 770, 120);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fbbf24'; ctx.font = 'italic bold 38px sans-serif';
  ctx.fillText("VS", 425, 225);
  ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 16px sans-serif';
  ctx.fillText(state.lastAction, 425, 275);

  if (state.effectType === "slash") {
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(620, 90); ctx.lineTo(740, 180); ctx.stroke();
  } else if (state.effectType === "explosion") {
    ctx.fillStyle = 'rgba(249,115,22,0.6)'; ctx.beginPath(); ctx.arc(720, 110, 70, 0, Math.PI * 2); ctx.fill();
  } else if (state.effectType === "boss_slash") {
    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(200, 90); ctx.lineTo(80, 180); ctx.stroke();
  } else if (state.effectType === "boss_explosion") {
    ctx.fillStyle = 'rgba(225,29,72,0.6)'; ctx.beginPath(); ctx.arc(130, 110, 70, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; ctx.fillRect(40, 320, 770, 100);
  ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
  ctx.fillText("📡 CONSOLE SYSTEM ACTIVE", 60, 350);
  ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 22px monospace';
  ctx.fillText(`${state.level}  |  Tour : ${state.turn === 'player' ? 'À toi' : 'Ennemi'} (a, b, x, c, d)`, 60, 395);

  const pathImg = path.join(__dirname, "cache", `guerre_canvas_${threadID}.png`);
  await fs.ensureDir(path.dirname(pathImg));
  await fs.writeFile(pathImg, canvas.toBuffer('image/png'));
  await message.reply({ body: decor, attachment: fs.createReadStream(pathImg) });
  fs.unlinkSync(pathImg);
}

async function sendVictoryCard(message, threadID, name, id, reward, total) {
  const canvas = createCanvas(600, 350);
  const ctx = canvas.getContext('2d');

  // Fond Premium Holographique Dark Card
  const grd = ctx.createLinearGradient(0, 0, 600, 350);
  grd.addColorStop(0, '#060b19'); grd.addColorStop(0.5, '#0f172a'); grd.addColorStop(1, '#052e16');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, 600, 350);

  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4; ctx.strokeRect(12, 12, 576, 326);

  // Rendu de la carte bancaire militaire
  ctx.fillStyle = 'rgba(16, 185, 129, 0.08)'; ctx.fillRect(40, 140, 520, 160);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; ctx.strokeRect(40, 140, 520, 160);

  let pImg;
  try {
    const resUser = await axios.get(`https://graph.facebook.com/${id}/picture?width=150&access_token=${token}`, { responseType: 'arraybuffer' });
    pImg = await loadImage(Buffer.from(resUser.data, 'binary'));
  } catch (e) { pImg = null; }

  ctx.save(); ctx.beginPath(); ctx.arc(90, 80, 40, 0, Math.PI * 2); ctx.clip();
  if (pImg) ctx.drawImage(pImg, 50, 40, 80, 80);
  ctx.restore();
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(90, 80, 40, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(name.substring(0, 16), 155, 75);
  ctx.fillStyle = '#10b981'; ctx.font = '16px monospace';
  ctx.fillText("✓ VICTOIRE ÉCRASEANTE", 155, 100);

  ctx.fillStyle = '#94a3b8'; ctx.font = '14px monospace';
  ctx.fillText("COMPTE MILITAIRE DE GUERRE", 60, 175);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px monospace';
  ctx.fillText(`+${reward.toLocaleString()} $`, 60, 220);

  ctx.fillStyle = '#64748b'; ctx.font = '12px monospace';
  ctx.fillText("SOLDE TOTAL ACTUALISÉ :", 60, 260);
  ctx.fillStyle = '#34d399'; ctx.font = 'bold 16px monospace';
  ctx.fillText(`${total.toLocaleString()} $`, 60, 285);

  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.font = 'italic bold 50px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText("MILITARY", 540, 280);

  const pathCard = path.join(__dirname, "cache", `guerre_win_${threadID}.png`);
  await fs.ensureDir(path.dirname(pathCard));
  await fs.writeFile(pathCard, canvas.toBuffer('image/png'));
  await message.reply({ attachment: fs.createReadStream(pathCard) });
  fs.unlinkSync(pathCard);
}
