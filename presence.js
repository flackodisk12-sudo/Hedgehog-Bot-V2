/**
 * @file presence.js
 * @description Module pour forcer le statut en ligne (point vert) et activer l'écoute active sur GoatBot.
 */

module.exports = {
  config: {
    name: "presence",
    version: "1.1.0",
    author: "Système",
    role: 2, // Réservé à l'administrateur
    countDown: 0,
    description: "Active la présence en ligne permanente du bot (point vert).",
    category: "system",
    guide: { fr: "presence" }
  },

  onLoad: async function ({ api }) {
    console.log("🟢 [PRÉSENCE] Initialisation et activation du mode en ligne...");
    try {
      if (typeof api.setOptions === "function") {
        await api.setOptions({ 
          listenEvents: true, 
          selfListen: false, 
          online: true 
        });
        console.log("✅ [PRÉSENCE] Statut en ligne injecté avec succès.");
      }
    } catch (error) {
      console.error("❌ [PRÉSENCE] Erreur de configuration initiale :", error.message);
    }
  },

  onStart: async function ({ api, message }) {
    try {
      if (typeof api.setOptions === "function") {
        await api.setOptions({ online: true });
        return message.reply("🟢 Le point vert est désormais forcé et actif en permanence sur ce compte !");
      } else {
        return message.reply("❌ Fonction d'état non supportée par votre instance FCA.");
      }
    } catch (error) {
      return message.reply(`❌ Erreur lors de l'activation : ${error.message}`);
    }
  }
};
