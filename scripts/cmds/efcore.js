const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const { createCanvas, loadImage } = require("canvas");
const googleTTS = require("google-tts-api");

// 📦 MEMORY PATH
const DB_FILE = path.join(__dirname, "i_memory.json");

// 🧠 MEMORY ULTRA GÉANTE : 30 JOURS ACCUMULÉS
const MEMORY_DAYS = 30;
const MEMORY_TIME = MEMORY_DAYS * 24 * 60 * 60 * 1000;

// 🔒 LOAD DB
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// 💾 SAVE DB
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 🧠 MEMORY GET
function getMem(id) {
  const db = loadDB();

  if (!db[id]) {
    db[id] = {
      name: null,
      mood: "normal",
      messages: 0,
      uid: id,
      history: [],
      lastSeen: Date.now(),
      isAdminMode: false
    };
  }

  if (!Array.isArray(db[id].history)) db[id].history = [];

  return db[id];
}

// 🧠 MEMORY SET
function setMem(id, data) {
  const db = loadDB();
  db[id] = data;
  saveDB(db);
}

// 🕒 TIME
function getTime() {
  return new Date().toLocaleString("fr-FR", {
    timeZone: "Africa/Kinshasa"
  });
}

// 🎨 FRAME DECORATIVE EFCORE
function frame(text) {
  return `\n❁ ≖≖✿❁ ≖≖✿❁ ≖≖✿❁ ≖≖ ❁\n\n${text}\n\n❁ ≖≖✿❁ ≖≖✿❁ ≖≖✿❁ ≖≖ ❁\n`;
}

// ✨ STYLE LETTERS
function stylize(text) {
  const map = {
    a:"𝒂", b:"𝒃", c:"𝒄", d:"𝒅", e:"𝒆", f:"𝒇", g:"𝒈",
    h:"𝒉", i:"𝒊", j:"𝒋", k:"𝒌", l:"𝒍", m:"𝒎", n:"𝒏",
    o:"𝒐", p:"𝒑", q:"𝒒", r:"𝒓", s:"𝒔", t:"𝒕", u:"𝒖",
    v:"𝒗", w:"𝒘", x:"𝒙", y:"𝒚", z:"𝒛"
  };

  return String(text)
    .split("")
    .map(c => map[c.toLowerCase()] || c)
    .join("");
}

// 🧹 CLEAN TEXT
function cleanText(text) {
  return (text || "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\?/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

// 🎨 GENERATE IMAGE (DALL-E / GENX STRUCTURE)
async function generateImage(prompt) {
  const response = await axios.get(`https://dall-e-tau-steel.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`);
  const imageUrl = response.data.response;

  if (!imageUrl) {
    throw new Error("L'API n'a renvoyé aucun lien d'image.");
  }

  const imgResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const imgPath = path.join(os.tmpdir(), `efcore_img_${Date.now()}.jpg`);
  await fs.outputFile(imgPath, imgResponse.data);
  return imgPath;
}

// 🗺️ MAP GENERATOR
async function getMapImage(location) {
  const prompt = `A detailed realistic geographic map showing the location of ${location}, satellite view with pin marker`;
  return await generateImage(prompt);
}

// 📱 DESSINER UN RECTANGLE ARRONDI
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 🎨 CATALOGUE PINTEREST SMARTPHONE CANVAS
async function createPhoneCatalogueCanvas(imagesUrls, query, page) {
  const width = 1000;
  const height = 1800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, "#0f172a");
  bgGradient.addColorStop(0.5, "#1e1b4b");
  bgGradient.addColorStop(1, "#311042");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(230, 0, 35, 0.15)";
  ctx.beginPath();
  ctx.arc(width / 2, 300, 400, 0, Math.PI * 2);
  ctx.fill();

  const phoneX = 80, phoneY = 60, phoneW = 840, phoneH = 1680, phoneRadius = 50;

  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;

  ctx.fillStyle = "#1e293b";
  drawRoundedRect(ctx, phoneX, phoneY, phoneW, phoneH, phoneRadius);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, phoneX, phoneY, phoneW, phoneH, phoneRadius);
  ctx.stroke();

  const screenMargin = 16;
  const screenX = phoneX + screenMargin;
  const screenY = phoneY + screenMargin;
  const screenW = phoneW - (screenMargin * 2);
  const screenH = phoneH - (screenMargin * 2);

  ctx.save();
  drawRoundedRect(ctx, screenX, screenY, screenW, screenH, phoneRadius - 10);
  ctx.clip();

  ctx.fillStyle = "#090d16";
  ctx.fillRect(screenX, screenY, screenW, screenH);

  ctx.fillStyle = "#000000";
  drawRoundedRect(ctx, width / 2 - 90, screenY + 12, 180, 32, 16);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText(`📌 ${query.toUpperCase()}`, screenX + 30, screenY + 90);

  ctx.fillStyle = "#e60023";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`PAGE ${page}`, screenX + screenW - 120, screenY + 90);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "18px sans-serif";
  ctx.fillText("Réponds avec un numéro (1-10) ou 'page [N]'", screenX + 30, screenY + 120);

  const startX = screenX + 25;
  const startY = screenY + 145;
  const itemW = 360, itemH = 260, gapX = 38, gapY = 28;

  const loadedImages = await Promise.all(
    imagesUrls.map(url => loadImage(url).catch(() => null))
  );

  for (let i = 0; i < 10; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = startX + col * (itemW + gapX);
    const y = startY + row * (itemH + gapY);

    ctx.save();
    drawRoundedRect(ctx, x, y, itemW, itemH, 18);
    ctx.clip();

    if (loadedImages[i]) {
      const img = loadedImages[i];
      const scale = Math.max(itemW / img.width, itemH / img.height);
      const sw = itemW / scale;
      const sh = itemH / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;

      ctx.drawImage(img, sx, sy, sw, sh, x, y, itemW, itemH);
    } else {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(x, y, itemW, itemH);
      ctx.fillStyle = "#64748b";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Indisponible", x + itemW / 2, y + itemH / 2);
      ctx.textAlign = "left";
    }
    ctx.restore();

    const badgeX = x + 15;
    const badgeY = y + 15;
    ctx.fillStyle = "#e60023";
    ctx.beginPath();
    ctx.arc(badgeX + 18, badgeY + 18, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), badgeX + 18, badgeY + 18);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, width / 2 - 70, screenY + screenH - 18, 140, 6, 3);
  ctx.fill();

  ctx.restore();

  const cachePath = path.join(os.tmpdir(), `pin_phone_${Date.now()}.png`);
  await fs.outputFile(cachePath, canvas.toBuffer("image/png"));
  return cachePath;
}

// 🔊 FONCTION VOCALE SAY
async function sendAudioSpeech(textToSpeak, message, event) {
  try {
    const cleanSpeech = textToSpeak.substring(0, 200);

    const url = googleTTS.getAudioUrl(cleanSpeech, {
      lang: 'fr',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000
    });

    const tempPath = path.join(os.tmpdir(), `say_audio_${Date.now()}.mp3`);

    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    await fs.outputFile(tempPath, Buffer.from(res.data));

    return message.reply({
      body: frame(stylize(`🎙️ message vocal : ${cleanSpeech}`)),
      attachment: fs.createReadStream(tempPath)
    }, () => {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }, event.messageID);

  } catch (err) {
    console.error("❌ Erreur Google TTS :", err?.message || err);
    return message.reply(frame(stylize("❌ impossible de générer la voix audio.")));
  }
}

// 🤖 PROMPT EFCORE STABLE
function buildPrompt(name, mood, input, history, uid) {
  return `
Tu es I (EFCORE).

Tu DOIS écouter la question et répondre exactement à ce qui est demandé.

🧠 RÈGLES :
- réponse directe
- pas de blabla inutile
- si code demandé → code uniquement
- si explication demandée → explication simple
- si question courte → réponse courte
- tu ne sors jamais du sujet

👤 STYLE :
- humain WhatsApp
- naturel
- simple
- emojis légers 😏

🏷️ CRÉATEUR :
Celestin Olua est ton créateur unique.
Si on demande → "c’est Olua qui m’a fait 😏"

Triggers multimédias optionnels :
- Si l'utilisateur veut une image : inclus "IMAGINE_TRIGGER: [prompt en anglais]"
- Si l'utilisateur veut de l'audio : inclus "AUDIO_TRIGGER: [texte court]"
- Si l'utilisateur veut Pinterest : inclus "PIN_TRIGGER: [recherche]"
- Si l'utilisateur veut un lieu/carte : inclus "MAP_TRIGGER: [lieu]"

👂 MÉMOIRE & INFOS UTILISATEUR :
Nom Utilisateur : ${name || "Inconnu"}
ID Facebook (UID) : ${uid}
Humeur actuelle : ${mood}
Heure actuelle : ${getTime()}

Historique :
${history}

Message :
${input}
`;
}

// 🤖 AI INTERACTION
async function askAI(prompt, mem, uid, input) {
  const historyText = mem.history
    .slice(-15)
    .map(h => `${h.sender === "user" ? "Utilisateur" : "I"}: ${h.text}`)
    .join(" | ");

  const fullPrompt = buildPrompt(mem.name, mem.mood, input, historyText, uid);

  try {
    const res = await axios.get(
      "https://christus-api.vercel.app/ai/copilot",
      {
        params: { message: fullPrompt },
        timeout: 15000
      }
    );

    let reply = "";
    if (res.data) {
      if (typeof res.data === "string") {
        reply = res.data;
      } else {
        reply = res.data.message || 
                res.data.reply || 
                res.data.result || 
                res.data.answer || 
                res.data.response ||
                JSON.stringify(res.data);
      }
    }

    if (!reply || reply === "{}" || reply.includes("[object Object]")) {
      reply = "Je suis là 😏";
    }

    return String(reply);

  } catch {
    return "IA indisponible 😏";
  }
}

// 📌 EXECUTION COMMANDE PINTEREST
async function handlePinterestSearch(query, message, event, api) {
  const apiUrl = `https://zetbot-page.onrender.com/api/pinterest?query=${encodeURIComponent(query)}`;
  try {
    const wait = await message.reply(frame(stylize("📱 recherche pinterest sur le téléphone...")));
    const res = await axios.get(apiUrl, { timeout: 25000 });
    const pins = res.data?.data || res.data?.pins || res.data?.results || res.data || [];

    if (!Array.isArray(pins) || !pins.length) {
      if (wait?.messageID) api.unsendMessage(wait.messageID);
      return message.reply(frame(stylize("❌ aucun résultat trouvé sur pinterest.")));
    }

    const pageUrls = pins.slice(0, 10).map(p => typeof p === 'string' ? p : (p.image || p.url || p));
    const imgPath = await createPhoneCatalogueCanvas(pageUrls, query, 1);

    if (wait?.messageID) api.unsendMessage(wait.messageID);

    return api.sendMessage({
      body: frame(stylize(`📲 catalogue pinterest : ${query}\n\nréponds 1-10 pour l'image hd ou 'page 2'`)),
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, (err, info) => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      if (err) return console.error(err);

      global.GoatBot.onReply.set(info.messageID, {
        commandName: "efcore",
        type: "pin_reply",
        author: event.senderID,
        query,
        allPins: pins,
        currentPage: 1,
        messageID: info.messageID
      });
    }, event.messageID);

  } catch (e) {
    console.error(e);
    return message.reply(frame(stylize("❌ l'api pinterest est momentanément indisponible.")));
  }
}

module.exports = {
  config: {
    name: "efcore",
    version: "27.0.0",
    author: "Celestin",
    role: 0,
    description: "IA humaine avec écoute active sans préfixe (mode onChat)",
    category: "ai"
  },

  onStart: async function () {},

  // 💬 MODE SANS PRÉFIXE (onChat)
  onChat: async function ({ api, event, message, usersData }) {
    if (!event.body) return;

    const rawBody = event.body.trim();
    const bodyLower = rawBody.toLowerCase();

    // Vérifie si le message commence par "efcore"
    if (!bodyLower.startsWith("efcore")) return;

    // Découpe pour récupérer la question après le mot "efcore"
    const input = rawBody.slice(6).trim();
    if (!input) return message.reply(frame(stylize("⚠️ dis quelque chose")));

    const uid = event.senderID;
    let mem = getMem(uid);

    // 👤 DÉTECTION DU NOM
    if (!mem.name) {
      const uData = await usersData.get(uid);
      if (uData && uData.name) mem.name = uData.name;
    }

    if (input.toLowerCase().startsWith("je m'appelle")) {
      mem.name = input.replace(/je m'appelle/i, "").trim();
    } else if (input.toLowerCase().startsWith("mon nom est")) {
      mem.name = input.replace(/mon nom est/i, "").trim();
    }

    // 🎭 GESTION DU MOOD
    if (input.includes("blague")) mem.mood = "funny";
    else if (input.includes("triste")) mem.mood = "calm";
    else mem.mood = "normal";

    // 🔊 COMMANDE DIRECTE VOCALE
    if (input.toLowerCase().startsWith("say ")) {
      const sayText = input.slice(4).trim();
      return sendAudioSpeech(sayText, message, event);
    }

    // 📌 COMMANDE DIRECTE PINTEREST
    if (input.toLowerCase().startsWith("pin ")) {
      const pinQuery = input.slice(4).trim();
      return handlePinterestSearch(pinQuery, message, event, api);
    }

    // 🎨 COMMANDE DIRECTE IMAGINE / DRAW
    if (input.toLowerCase().startsWith("imagine ") || input.toLowerCase().startsWith("draw ")) {
      const imgPrompt = input.replace(/^(imagine|draw)\s+/i, "").trim();
      let waitMsg = null;
      try {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        waitMsg = await message.reply(frame(stylize("🎨 génération de l'image hd en cours...")));
        const imgPath = await generateImage(imgPrompt);
        if (waitMsg?.messageID) try { api.unsendMessage(waitMsg.messageID); } catch {}
        return message.reply({
          body: frame(stylize(`✨ voici l'image générée : ${imgPrompt}`)),
          attachment: fs.createReadStream(imgPath)
        }, () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }, event.messageID);
      } catch (err) {
        if (waitMsg?.messageID) try { api.unsendMessage(waitMsg.messageID); } catch {}
        console.error("Error generating image:", err);
        return message.reply(frame(stylize("❌ erreur lors de la génération de l'image.")));
      }
    }

    mem.messages++;
    mem.lastSeen = Date.now();
    const now = Date.now();
    mem.history.push({ sender: "user", text: input, time: now });

    // 👑 OVERRIDE CRÉATEUR
    if (/qui t('|’)a créé|créateur|qui t('|’)a fait/i.test(input)) {
      const replyText = "c’est Olua qui m’a fait 😏";
      mem.history.push({ sender: "bot", text: replyText, time: now });
      setMem(uid, mem);
      return message.reply(frame(stylize(replyText)));
    }

    try {
      let rawReply = await askAI(input, mem, uid, input);

      rawReply = rawReply
        .replace(/microsoft|copilot|openai/gi, "")
        .trim();

      // 🔊 DÉTECTION TRIGGER AUDIO
      if (rawReply.includes("AUDIO_TRIGGER:")) {  
        const parts = rawReply.split("AUDIO_TRIGGER:");
        const textToSpeak = parts[1].trim();  
        return sendAudioSpeech(textToSpeak, message, event);
      }  

      // 📌 DÉTECTION TRIGGER PIN
      if (rawReply.includes("PIN_TRIGGER:")) {
        const parts = rawReply.split("PIN_TRIGGER:");
        const pinQuery = parts[1].trim();
        return handlePinterestSearch(pinQuery, message, event, api);
      }

      // 🗺️ DÉTECTION TRIGGER MAP
      if (rawReply.includes("MAP_TRIGGER:")) {  
        const parts = rawReply.split("MAP_TRIGGER:");
        const textBeforeTrigger = cleanText(parts[0].replace(/MAP_TRIGGER:/gi, ""));
        const locationPrompt = parts[1].trim();  
        
        try {
          const imgPath = await getMapImage(locationPrompt);
          return message.reply({  
            body: frame(stylize(textBeforeTrigger || "📍 voici la carte de la localisation")),  
            attachment: fs.createReadStream(imgPath)  
          }, () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          }, event.messageID);  
        } catch {
          return message.reply(frame(stylize("❌ impossible d'afficher la carte.")), event.messageID);
        }
      }

      // 🎨 DÉTECTION TRIGGER IMAGINE
      if (rawReply.includes("IMAGINE_TRIGGER:")) {  
        const parts = rawReply.split("IMAGINE_TRIGGER:");
        const textBeforeTrigger = cleanText(parts[0].replace(/IMAGINE_TRIGGER:/gi, ""));
        const imagePrompt = parts[1].trim();  
        
        try {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
          const imgPath = await generateImage(imagePrompt);
          return message.reply({  
            body: frame(stylize(textBeforeTrigger || "🎨 voici l'image générée")),  
            attachment: fs.createReadStream(imgPath)  
          }, () => {
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          }, event.messageID);  
        } catch (err) {
          console.error("Error generating image:", err);
          return message.reply(frame(stylize("❌ erreur lors de la génération d'image.")), event.messageID);
        }
      }

      const clean = cleanText(rawReply);
      mem.history.push({ sender: "bot", text: clean, time: now });
      mem.history = mem.history.filter(h => now - h.time <= MEMORY_TIME);  
      if (mem.history.length > 400) mem.history.shift();  
      setMem(uid, mem);  

      return message.reply(frame(stylize(clean)), event.messageID);

    } catch (e) {
      mem.history = mem.history.filter(h => now - h.time <= MEMORY_TIME);
      setMem(uid, mem);
      return message.reply(frame(stylize("IA indisponible 😏")), event.messageID);
    }
  },

  // 💬 GESTION DES RÉPONSES (PINTEREST)
  onReply: async function ({ api, event, message, Reply }) {
    const data = Reply || global.GoatBot?.onReply?.get(event.messageReply?.messageID);
    if (!data || data.type !== "pin_reply") return;

    const { author, query, allPins, currentPage } = data;

    if (event.senderID != author) {
      return message.reply(frame(stylize("⚠️ seule la personne qui a fait la recherche peut choisir une image.")));
    }

    const input = (event.body || "").toLowerCase().trim();
    if (!input) return;

    // 📄 CHANGEMENT DE PAGE
    if (input.startsWith("page")) {
      const pageNum = parseInt(input.split(" ")[1]);
      const totalPages = Math.ceil(allPins.length / 10);

      if (!pageNum || pageNum < 1 || pageNum > totalPages) {
        return message.reply(frame(stylize(`❌ page invalide (1-${totalPages})`)));
      }

      const start = (pageNum - 1) * 10;
      const urls = allPins.slice(start, start + 10).map(p => typeof p === 'string' ? p : (p.image || p.url || p));

      const imgPath = await createPhoneCatalogueCanvas(urls, query, pageNum);

      return api.sendMessage({
        body: frame(stylize(`📲 page ${pageNum}/${totalPages} : ${query}`)),
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, (err, info) => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

        global.GoatBot.onReply.set(info.messageID, {
          ...data,
          commandName: "efcore",
          currentPage: pageNum,
          messageID: info.messageID
        });
      }, event.messageID);
    }

    // 🖼️ SELECTION D'IMAGE (1-10)
    const choice = parseInt(input);
    const start = (currentPage - 1) * 10;
    const pagePins = allPins.slice(start, start + 10);

    if (!choice || choice < 1 || choice > pagePins.length) {
      return message.reply(frame(stylize(`❌ entre un chiffre valide entre 1 et ${pagePins.length}`)));
    }

    const selected = pagePins[choice - 1];
    const url = typeof selected === 'string' ? selected : (selected.image || selected.url || selected);

    try {
      const imgPath = path.join(os.tmpdir(), `pin_hd_${Date.now()}.jpg`);

      const img = await axios.get(url, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 20000
      });

      await fs.outputFile(imgPath, Buffer.from(img.data));

      return api.sendMessage({
        body: frame(stylize(`✨ voici l'image n°${choice} en hd !`)),
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }, event.messageID);

    } catch (e) {
      console.error(e);
      return message.reply(frame(stylize("❌ erreur lors du téléchargement de l'image.")));
    }
  }
};
