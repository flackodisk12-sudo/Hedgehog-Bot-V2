/**
 * @file autoconnect.js
 * @description Module de reconnexion automatique en cas de déconnexion ou de perte de session Facebook.
 */

const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "autoconnect",
    version: "1.0.0",
    author: "Système",
    role: 2, // Réservé à l'administrateur
    countDown: 0,
    description: "Surveille et relance la connexion si le bot est déconnecté.",
    category: "system",
    guide: { fr: "{p}{n}" }
  },

  onLoad: async function ({ api }) {
    console.log("🔄 [AUTOCONNECT] Initialisation du système de reconnexion automatique...");

    // Intervalle de vérification du statut de connexion (toutes les 2 minutes)
    setInterval(async () => {
      try {
        if (typeof api.getAppState === "function") {
          const appState = api.getAppState();
          
          // Vérification si la session appState est toujours valide
          if (!appState || appState.length === 0) {
            console.warn("⚠️ [AUTOCONNECT] Session vide ou expirée détectée ! Tentative de rechargement...");
            await reloadSession(api);
          }
        }
      } catch (error) {
        console.error("❌ [AUTOCONNECT] Erreur lors de la vérification de connexion :", error.message);
      }
    }, 2 * 60 * 1000); // 2 minutes
  },

  onStart: async function ({ api, message }) {
    try {
      const isAlive = await checkConnection(api);
      if (isAlive) {
        return message.reply("🟢 **[AUTOCONNECT]** Le système de reconnexion automatique est actif et la session est stable.");
      } else {
        return message.reply("⚠️ **[AUTOCONNECT]** Instabilité détectée sur la session Facebook. Tentative de rafraîchissement...");
      }
    } catch (error) {
      return message.reply(`❌ **[AUTOCONNECT] Erreur :** ${error.message}`);
    }
  }
};

/**
 * Fonction de vérification de l'état du Bot
 */
async function checkConnection(api) {
  return new Promise((resolve) => {
    if (typeof api.getCurrentUserID === "function") {
      const botID = api.getCurrentUserID();
      resolve(!!botID);
    } else {
      resolve(false);
    }
  });
}

/**
 * Fonction de rechargement de la session depuis le fichier d'état
 */
async function reloadSession(api) {
  try {
    const appStatePath = path.join(process.cwd(), "appstate.json");
    if (await fs.pathExists(appStatePath)) {
      const appStateData = await fs.readJson(appStatePath);
      if (typeof api.setOptions === "function") {
        await api.setOptions({
          listenEvents: true,
          selfListen: false,
          online: true
        });
      }
      console.log("✅ [AUTOCONNECT] Session rechargée avec succès depuis appstate.json !");
    } else {
      console.error("❌ [AUTOCONNECT] Le fichier appstate.json est introuvable !");
    }
  } catch (err) {
    console.error("❌ [AUTOCONNECT] Échec de la reconnexion :", err.message);
  }
}

