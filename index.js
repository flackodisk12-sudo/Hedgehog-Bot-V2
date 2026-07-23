const { spawn } = require("child_process");
const express = require("express");

const app = express();

// 🌍 Serveur HTTP requis pour maintenir le service actif sur Render
app.get("/", (req, res) => {
  res.send("🟢 Célestin - Goat Bot V2 est en ligne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 [CÉLESTIN] Serveur démarré sur le port ${PORT}`);
});

// 🛡️ Protection anti-crash globale du processus parent
process.on("uncaughtException", (err) => {
  console.error("💥 [CÉLESTIN - UNCAUGHT EXCEPTION]", err.message || err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 [CÉLESTIN - UNHANDLED REJECTION]", err.message || err);
});

// 🚀 Lancement et surveillance du processus Goat.js
function startBot() {
  console.log("🚀 [CÉLESTIN] Lancement du bot...");

  const child = spawn("node", ["Goat.js"], {
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    console.log(`🔁 [CÉLESTIN] Bot arrêté (Code de sortie: ${code})`);

    // Redémarrage automatique si le bot plante (code différent de 0)
    if (code !== 0) {
      console.log("♻️ [CÉLESTIN] Redémarrage automatique dans 5 secondes...");
      setTimeout(() => {
        startBot();
      }, 5000);
    }
  });

  child.on("error", (err) => {
    console.error("❌ [CÉLESTIN] Erreur lors du lancement de Goat.js :", err);
  });
}

// 🏁 Démarrage initial
startBot();
