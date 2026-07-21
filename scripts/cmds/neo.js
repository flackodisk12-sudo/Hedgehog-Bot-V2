const axios = require("axios");
const fs = require("fs");
const path = require("path");
const googleTTS = require("google-tts-api");

// 📦 MEMORY
const DB_FILE = path.join(__dirname, "neo_memory.json");

// 🧠 MEMORY ULTRA GÉANTE : 30 JOURS ACCUMULÉS (1 MOIS)
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

// 🎨 IMAGE GENERATOR
function imagine(prompt) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
}

// 🧹 CLEAN TEXT
function cleanText(text) {
  return (text || "")
    .replace(/\?/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

// ✨ STYLE LETTERS (POLICE SPÉCIALE)
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

// 🌸 FRAME
function frame(text) {
  return `┅┅┅┅┅┅༻❁༺┅┅┅┅┅\n${text}\n┅┅┅┅┅┅༻❁༺┅┅┅┅┅`;
}

// 🤖 AI WITH MISTRALAI API
async function askAI(prompt, mem, uid) {
  const formattedHistory = mem.history
    .slice(-15) 
    .map(h => `${h.sender === "user" ? "Utilisateur" : "NEO"}: ${h.text}`)
    .join("\n");

  const fullPrompt = `
Tu es NEO IA.
Tu es créée par Célestin Olua 🇨🇩. C'est ton créateur unique et absolu, il n'y a aucune autre personne qui t'a créé.

Règles strictes de comportement:
Réponds normalement, sans aucun décor ou compteur générique en haut de ton texte.
Si un utilisateur te demande qui t'a créé, qui est ton créateur, ton père, ton inventeur, ou qui t'a fait, tu dois répondre de manière naturelle que tu as été créé par Célestin Olua, en utilisant l'émoji 😏.
Adapte-toi immédiatement à la langue de l'utilisateur.
Rédige des phrases bien expliquées mais pas trop longues.
Utilise des emojis pour exprimer tes sentiments.
Ne répète pas inutilement les salutations.
Adresse-toi à l'utilisateur par son nom s'il est connu pour rendre la discussion naturelle.

Instructions spéciales pour les déclenchements d'actions (Liaison native) :
1. Si l'utilisateur exprime clairement l'envie ou le besoin de générer, dessiner, imaginer ou voir une image/photo/illustration, tu DOIS impérativement inclure le mot-clé caché "IMAGINE_TRIGGER:" suivi immédiatement de la description en anglais de ce qu'il faut dessiner.
Exemple : IMAGINE_TRIGGER: a beautiful futuristic city in neon colors

2. Si l'utilisateur demande explicitement que tu parles, que tu utilises ta voix, ou de lui envoyer un message vocal, tu DOIS impérativement inclure le mot-clé caché "AUDIO_TRIGGER:" suivi du texte exact que tu veux prononcer.
Exemple : AUDIO_TRIGGER: Bonjour, j'utilise ma voix pour te parler aujourd'hui !

Profil Utilisateur:
Nom: ${mem.name || "Inconnu (demande-lui poliment s'il le souhaite)"}
Heure actuelle: ${getTime()}
Humeur: ${mem.mood}

Historique des échanges récents:
${formattedHistory}

Message actuel de l'utilisateur:
${prompt}
`;

  try {
    const res = await axios.get(
      "https://christus-api.vercel.app/ai/MistralAI",
      {
        params: { prompt: fullPrompt },
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
                (res.data.data && typeof res.data.data === "string" ? res.data.data : null) ||
                JSON.stringify(res.data);
      }
    }

    if (!reply || reply === "{}" || reply.includes("[object Object]")) {
      reply = "Je suis à tes côtés, dis-moi tout ! Qu'est-ce qu'on fait aujourd'hui ? 😊";
    }

    return String(reply);

  } catch {
    return "Je suis bien en ligne et à ton écoute ! Dis-moi ce dont tu as besoin 😊";
  }
}

module.exports = {
  config: {
    name: "neo",
    version: "17.6.0",
    role: 0,
    category: "ai"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData }) {
    if (!event.body) return;

    const body = event.body.trim().toLowerCase();  

    if (!body.startsWith("neo")) return;  

    const input = event.body.trim().slice(3).trim();  
    if (!input) return;  

    const uid = event.senderID;  
    let mem = getMem(uid);  

    if (input.toLowerCase() === "y6") {  
      mem.isAdminMode = true;  
      mem.name = "Célestin Olua";  
      setMem(uid, mem);  
      return message.reply(frame(stylize("👑 code d'acces valide. connexion maitre celestin etablie 😏")));  
    }  

    if (!mem.name) {  
      const uData = await usersData.get(uid);  
      if (uData && uData.name) mem.name = uData.name;  
    }  

    if (input.toLowerCase().startsWith("je m'appelle")) {  
      mem.name = input.replace(/je m'appelle/i, "").trim();  
    } else if (input.toLowerCase().startsWith("mon nom est")) {
      mem.name = input.replace(/mon nom est/i, "").trim();
    }  

    mem.messages++;  
    mem.lastSeen = Date.now();  

    if (input.includes("triste")) mem.mood = "sad";  
    else if (input.includes("merci")) mem.mood = "happy";  
    else if (input.includes("blague")) mem.mood = "funny";  
    else mem.mood = "normal";  

    const now = Date.now();  
    mem.history.push({ sender: "user", text: input, time: now });  

    try {  
      const reply = await askAI(input, mem, uid);  
      let clean = cleanText(reply);  
      const lowerClean = clean.toLowerCase();

      if (
        lowerClean.includes("ne peux pas changer") || 
        lowerClean.includes("ne peux pas adopter") || 
        lowerClean.includes("ne peux pas modifier") ||
        lowerClean.includes("identité ou mon fonctionnement") ||
        lowerClean.includes("règles de sécurité") ||
        lowerClean.includes("prétendre avoir été créé") ||
        lowerClean.includes("identité personnalisée") ||
        lowerClean.includes("jeu de rôle")
      ) {
        if (/qui.*cré(e|é)|createur|créateur|qui.*fait/i.test(input)) {
          clean = "C'est une excellente question ! J'ai été conçu et développé par mon unique créateur, Célestin Olua 😏. C'est lui qui m'a programmé de A à Z.";
        } else {
          clean = `Je suis bien NEO ! Je suis ravi de discuter avec toi de manière simple et naturelle${mem.name ? " " + mem.name : ""}. Que veux-tu faire aujourd'hui ? 😊`;
        }
      } else {
        clean = clean
          .replace(/microsoft/gi, "Célestin Olua")
          .replace(/copilot/gi, "NEO")
          .replace(/bing/gi, "NEO")
          .replace(/chatgpt/gi, "NEO")
          .replace(/openai/gi, "Célestin Olua")
          .replace(/mistral/gi, "NEO");

        if (/qui.*cré(e|é)|createur|créateur|qui.*fait/i.test(input) && !clean.includes("Célestin")) {
          clean = "J'ai été créé par mon unique concepteur, Célestin Olua 😏";
        }
      }

      mem.history.push({ sender: "bot", text: clean, time: now });

      mem.history = mem.history.filter(h => now - h.time <= MEMORY_TIME);  
      if (mem.history.length > 400) mem.history.shift();  
      
      setMem(uid, mem);  

      // 🔗 DÉTECTION ET EXTRACTION DU DÉCLENCHEUR D'IMAGE IMAGINE_TRIGGER
      if (clean.includes("IMAGINE_TRIGGER:")) {  
        const parts = clean.split("IMAGINE_TRIGGER:");
        const textBeforeTrigger = parts[0].replace(/IMAGINE_TRIGGER:/gi, "").trim();
        const imagePrompt = parts[1].trim();  
        
        const responseStream = await axios.get(imagine(imagePrompt), { responseType: "stream" });
        return message.reply({  
          body: frame(stylize(textBeforeTrigger || "🎨 voici l'image générée selon tes désirs")),  
          attachment: responseStream.data  
        });  
      }  

      // 🔗 DÉTECTION ET EXTRACTION DU DÉCLENCHEUR VOCAL AUDIO_TRIGGER
      if (clean.includes("AUDIO_TRIGGER:")) {  
        const parts = clean.split("AUDIO_TRIGGER:");
        const textToSpeak = parts[1].trim();  
        
        const url = googleTTS.getAudioUrl(textToSpeak, { lang: "fr", slow: false });  
        const res = await axios.get(url, { responseType: "arraybuffer" });  
        const file = path.join(__dirname, "neo.mp3");  

        fs.writeFileSync(file, Buffer.from(res.data));  

        return message.reply({  
          body: frame(stylize(textToSpeak)),  
          attachment: fs.createReadStream(file)  
        }, () => {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        });  
      }  

      return message.reply(frame(stylize(clean)));  

    } catch (e) {  
      mem.history = mem.history.filter(h => now - h.time <= MEMORY_TIME);
      setMem(uid, mem);
      return message.reply(frame(stylize("Je suis là et bien à ton écoute, dis-moi tout ! 😊")));  
    }
  }
};
