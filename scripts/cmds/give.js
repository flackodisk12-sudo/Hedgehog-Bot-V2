"use strict";

// ═══════════════════════════════════════════════════════════════════════════════
//  STUDIO ECONOMY SYSTEM v2026 — Minimal Dark & Cobalt Blue Edition
//  Canvas   : 1200 × 540 px — Interface Épurée Premium
// ═══════════════════════════════════════════════════════════════════════════════

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

let loadImage, createCanvas, registerFont;
let canvasAvailable = false;
try {
  const cv = require("canvas");
  loadImage    = cv.loadImage;
  createCanvas = cv.createCanvas;
  registerFont = cv.registerFont;
  canvasAvailable = true;
} catch (e) { console.error("Canvas indisponible :", e.message); }

if (canvasAvailable && registerFont) {
  const fd = path.join(__dirname, "assets", "font");
  [
    ["BeVietnamPro-Bold.ttf",    "BF", "bold"],
    ["BeVietnamPro-Regular.ttf", "BF", "normal"],
    ["BeVietnamPro-SemiBold.ttf","BF", "600"],
  ].forEach(([f, fam, w]) => {
    try {
      const fp = path.join(fd, f);
      if (fs.existsSync(fp)) registerFont(fp, { family: fam, weight: w });
    } catch (_) {}
  });
}

const FB_TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

function fmt(n) {
  if (n == null || isNaN(n)) return "$0";
  n = Number(n);
  if (!isFinite(n)) return "$∞";
  const S = [{v:1e12,s:"T"},{v:1e9,s:"B"},{v:1e6,s:"M"},{v:1e3,s:"K"}];
  const sc = S.find(s => Math.abs(n) >= s.v);
  if (sc) return `${n<0?"-":""}$${(Math.abs(n)/sc.v).toFixed(2).replace(/\.00$/,"")}${sc.s}`;
  const p = Math.abs(n).toFixed(2).split(".");
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n<0?"-":""}$${p.join(".")}`;
}

const SUFFIXES = { k:1e3, m:1e6, b:1e9, t:1e12 };
function parseAmount(input) {
  if (!input || typeof input !== "string") return NaN;
  const m = input.trim().toLowerCase().match(/^([\d,.]+)\s*([kmbt]?)$/i);
  if (!m) return NaN;
  let v = parseFloat(m[1].replace(/,/g, "."));
  if (m[2] && SUFFIXES[m[2]]) v *= SUFFIXES[m[2]];
  return isNaN(v) ? NaN : Math.floor(v);
}

const TIERS = [
  { name:"Standard",  min:0,       max:4999,     color:"#94a3b8" },
  { name:"Premium",   min:5000,    max:49999,    color:"#60a5fa" },
  { name:"Elite",     min:50000,   max:Infinity, color:"#34d399" },
];
function getTier(b) { return TIERS.find(t => (b||0)>=t.min && (b||0)<=t.max) || TIERS[0]; }

const THEME = {
  bg(ctx, W, H) {
    // Fond sombre Studio Slate
    ctx.fillStyle = "#0f172a"; 
    ctx.fillRect(0, 0, W, H);
    
    // Dégradé radial central très subtil
    const g = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.6);
    g.addColorStop(0, "rgba(30, 41, 59, 0.6)");
    g.addColorStop(1, "#0f172a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  },
  primary: "#3b82f6",
  accent: "#60a5fa",
  text: "#f8fafc",
  muted: "#64748b",
  card: "#1e293b",
  border: "rgba(255, 255, 255, 0.05)"
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  ctx.fill();
}

function T(ctx, s, x, y, sz, color, {align="left", weight="normal", alpha=1}={}) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.font = `${weight} ${sz}px BF, system-ui, sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillStyle = color; ctx.fillText(s, x, y); ctx.restore();
}

async function AVATAR(ctx, imgBuf, cx, cy, R) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(imgBuf, cx - R, cy - R, R * 2, R * 2); ctx.restore();
  
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}

async function loadAvatar(uid, name) {
  try {
    const res = await axios.get(
      `https://graph.facebook.com/${uid}/picture?type=large&redirect=true&width=300&height=300`,
      {
        responseType: "arraybuffer",
        headers: { 'user-agent': 'Mozilla/5.0' },
        timeout: 6000
      }
    );
    return await loadImage(Buffer.from(res.data));
  } catch (_) {
    const cv = createCanvas(300, 300);
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = "#60a5fa"; ctx.font = "600 100px system-ui";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText((name || "U").charAt(0).toUpperCase(), 150, 150);
    return await loadImage(cv.toBuffer());
  }
}

const CW = 1200, CH = 540;
const AV_Y = 220, AV_R = 75;    
const LEFT_X = 260, RIGHT_X = 940, MID_X = CW / 2; 

async function buildCanvas(sData, rData, amount) {
  const canvas = createCanvas(CW, CH);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";

  THEME.bg(ctx, CW, CH);

  // Encart global (Main dashboard view)
  ctx.fillStyle = THEME.card;
  ctx.strokeStyle = THEME.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(30, 30, CW - 60, CH - 60, 16) : ctx.rect(30, 30, CW - 60, CH - 60);
  ctx.fill(); ctx.stroke();

  // Ligne d'accent supérieure
  ctx.fillStyle = THEME.primary;
  ctx.fillRect(30, 30, CW - 60, 4);

  // Titre principal de transaction
  T(ctx, "TRANSACTION AUTHENTIFIÉE", MID_X, 85, 22, THEME.text, {align: "center", weight: "600"});

  // Chargement et rendu des avatars
  const [sImg, rImg] = await Promise.all([
    loadAvatar(sData.uid, sData.name),
    loadAvatar(rData.uid, rData.name)
  ]);
  await AVATAR(ctx, sImg, LEFT_X, AV_Y, AV_R);
  await AVATAR(ctx, rImg, RIGHT_X, AV_Y, AV_R);

  // Noms d'utilisateurs
  const sName = sData.name.length > 16 ? sData.name.slice(0, 14) + "…" : sData.name;
  const rName = rData.name.length > 16 ? rData.name.slice(0, 14) + "…" : rData.name;
  T(ctx, sName, LEFT_X, AV_Y + AV_R + 25, 18, THEME.text, {align: "center", weight: "600"});
  T(ctx, rName, RIGHT_X, AV_Y + AV_R + 25, 18, THEME.text, {align: "center", weight: "600"});

  // Tiers de compte
  const sTier = getTier(sData.newBalance);
  const rTier = getTier(rData.newBalance);
  T(ctx, sTier.name.toUpperCase(), LEFT_X, AV_Y + AV_R + 48, 12, sTier.color, {align: "center", weight: "600"});
  T(ctx, rTier.name.toUpperCase(), RIGHT_X, AV_Y + AV_R + 48, 12, rTier.color, {align: "center", weight: "600"});

  // Rôles / Libellés
  T(ctx, "ÉMETTEUR", LEFT_X, AV_Y - AV_R - 25, 12, THEME.muted, {align: "center", weight: "600"});
  T(ctx, "BÉNÉFICIAIRE", RIGHT_X, AV_Y - AV_R - 25, 12, THEME.muted, {align: "center", weight: "600"});

  // Flèche directionnelle linéaire moderne
  const arrStartX = LEFT_X + AV_R + 40;
  const arrEndX = RIGHT_X - AV_R - 40;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(arrStartX, AV_Y); ctx.lineTo(arrEndX, AV_Y); ctx.stroke();
  
  ctx.fillStyle = THEME.muted;
  ctx.beginPath(); ctx.moveTo(arrEndX, AV_Y); ctx.lineTo(arrEndX - 10, AV_Y - 6); ctx.lineTo(arrEndX - 10, AV_Y + 6); ctx.fill();

  // Badge du Montant Central
  const amtStr = fmt(amount);
  ctx.font = "600 32px BF, system-ui";
  const amtW = ctx.measureText(amtStr).width + 48;
  const amtH = 54;
  ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
  rr(ctx, MID_X - amtW / 2, AV_Y - amtH / 2, amtW, amtH, 27);
  T(ctx, amtStr, MID_X, AV_Y, 32, THEME.accent, {align: "center", weight: "600"});

  // Zone d'affichage des soldes mis à jour (Pied de carte)
  const footerY = CH - 85;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, footerY - 20); ctx.lineTo(CW - 60, footerY - 20); ctx.stroke();

  // Affichage Solde Émetteur
  T(ctx, "SOLDE ACTUEL", 60, footerY, 11, THEME.muted, {weight: "600"});
  T(ctx, fmt(sData.newBalance), 60, footerY + 20, 18, THEME.text, {weight: "600"});

  // Affichage Solde Bénéficiaire
  T(ctx, "SOLDE ACTUEL", CW - 60, footerY, 11, THEME.muted, {align: "right", weight: "600"});
  T(ctx, fmt(rData.newBalance), CW - 60, footerY + 20, 18, THEME.text, {align: "right", weight: "600"});

  // Horodatage au centre du footer
  const dateStr = moment().tz("Europe/Paris").format("DD.MM.YYYY // HH:mm");
  T(ctx, dateStr, MID_X, footerY + 10, 12, THEME.muted, {align: "center"});

  return canvas;
}

module.exports = {
  config: {
    name:        "give",
    aliases:     ["gift", "donate", "don"],
    version:     "2026.1",
    author:      "Christus + Célestin",
    countDown:   5,
    role:        0,
    description: { fr: "Transfert sécurisé de fonds inter-comptes avec tableau de bord visuel." },
    category:    "economy",
    guide: {
      fr: "give @user [montant]\nExemples: give @user 5000 | give @user 2.5m"
    },
  },

  onStart: async function ({ message, event, args, usersData, api }) {
    const { senderID, mentions, messageReply } = event;

    let targetID = Object.keys(mentions)[0] || messageReply?.senderID;
    const amountArg = args.find(a => /^[\d,.]+[kmbt]?$/i.test(a));
    const amount    = parseAmount(amountArg);

    if (!targetID) {
      return message.reply(`▫️ Erreur : Veuillez mentionner un bénéficiaire authentifié.`);
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply(`▫️ Erreur : Format de valeur numérique invalide (ex: 100, 2.5k, 1m).`);
    }
    if (targetID === senderID) {
      return message.reply("▫️ Erreur : Opération de transfert vers son propre compte rejetée.");
    }

    const [senderData, receiverData] = await Promise.all([
      usersData.get(senderID),
      usersData.get(targetID),
    ]);
    if (!receiverData) return message.reply("▫️ Erreur : Compte destinataire introuvable.");

    const sMoney = senderData.money || 0;
    if (sMoney < amount) {
      return message.reply(`▫️ Erreur : Solde disponible insuffisant. Votre crédit : ${fmt(sMoney)}`);
    }

    const newSMoney = sMoney - amount;
    const newRMoney = (receiverData.money || 0) + amount;
    await Promise.all([
      usersData.set(senderID, { money: newSMoney }),
      usersData.set(targetID, { money: newRMoney }),
    ]);

    let senderName = senderData.name || `User_${senderID}`;
    let receiverName = receiverData.name || `User_${targetID}`;
    try {
      const fbInfo = await api.getUserInfo([senderID, targetID]);
      senderName   = fbInfo[senderID]?.name   || senderName;
      receiverName = fbInfo[targetID]?.name    || receiverName;
    } catch (_) {}

    if (!canvasAvailable) {
      return message.reply(`✦ Transfert validé. ${fmt(amount)} ont été alloués à ${receiverName}.`);
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
    const outPath = path.join(cacheDir, `give_v2026_${senderID}_${Date.now()}.png`);

    const cvs = await buildCanvas(
      { uid: senderID,   name: senderName,   newBalance: newSMoney },
      { uid: targetID,   name: receiverName, newBalance: newRMoney },
      amount
    );
    fs.writeFileSync(outPath, cvs.toBuffer("image/png"));

    const body  = [
      `✧ [ **NOTIFICATION DE FLUX** ] ✧`,
      `──────────────────────────`,
      `  ▫️ Compte Émetteur : ${senderName}`,
      `  ▫️ Bénéficiaire    : ${receiverName}`,
      `  ▫️ Volume Crédité  : ${fmt(amount)}`,
      `──────────────────────────`,
      `  ✦ Solde ${senderName.slice(0,10)} : ${fmt(newSMoney)}`,
      `  ✦ Solde ${receiverName.slice(0,10)} : ${fmt(newRMoney)}`
    ].join("\n");

    await message.reply({ body, attachment: fs.createReadStream(outPath) });
    setTimeout(() => { try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {} }, 20_000);
  },
};
