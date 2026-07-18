const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

// Base de données locale pour associer les pays à leur fuseau horaire et à leur drapeau stable
const countryDataMap = {
    "france": { zone: "Europe/Paris", name: "FRANCE", flag: "https://flagcdn.com/w160/fr.png" },
    "belgique": { zone: "Europe/Brussels", name: "BELGIQUE", flag: "https://flagcdn.com/w160/be.png" },
    "suisse": { zone: "Europe/Zurich", name: "SUISSE", flag: "https://flagcdn.com/w160/ch.png" },
    "maroc": { zone: "Africa/Casablanca", name: "MAROC", flag: "https://flagcdn.com/w160/ma.png" },
    "algérie": { zone: "Africa/Algiers", name: "ALGÉRIE", flag: "https://flagcdn.com/w160/dz.png" },
    "algerie": { zone: "Africa/Algiers", name: "ALGÉRIE", flag: "https://flagcdn.com/w160/dz.png" },
    "tunisie": { zone: "Africa/Tunis", name: "TUNISIE", flag: "https://flagcdn.com/w160/tn.png" },
    "canada": { zone: "America/Toronto", name: "CANADA (EST)", flag: "https://flagcdn.com/w160/ca.png" },
    "japon": { zone: "Asia/Tokyo", name: "JAPON", flag: "https://flagcdn.com/w160/jp.png" },
    "espagne": { zone: "Europe/Madrid", name: "ESPAGNE", flag: "https://flagcdn.com/w160/es.png" },
    "italie": { zone: "Europe/Rome", name: "ITALIE", flag: "https://flagcdn.com/w160/it.png" },
    "allemagne": { zone: "Europe/Berlin", name: "ALLEMAGNE", flag: "https://flagcdn.com/w160/de.png" },
    "royaume-uni": { zone: "Europe/London", name: "ROYAUME-UNI", flag: "https://flagcdn.com/w160/gb.png" },
    "royaume uni": { zone: "Europe/London", name: "ROYAUME-UNI", flag: "https://flagcdn.com/w160/gb.png" },
    "angleterre": { zone: "Europe/London", name: "ANGLETERRE", flag: "https://flagcdn.com/w160/gb.png" },
    "états-unis": { zone: "America/New_York", name: "USA (EST)", flag: "https://flagcdn.com/w160/us.png" },
    "etats unis": { zone: "America/New_York", name: "USA (EST)", flag: "https://flagcdn.com/w160/us.png" },
    "usa": { zone: "America/New_York", name: "USA", flag: "https://flagcdn.com/w160/us.png" },
    "sénégal": { zone: "Africa/Dakar", name: "SÉNÉGAL", flag: "https://flagcdn.com/w160/sn.png" },
    "senegal": { zone: "Africa/Dakar", name: "SÉNÉGAL", flag: "https://flagcdn.com/w160/sn.png" },
    "côte d'ivoire": { zone: "Africa/Abidjan", name: "CÔTE D'IVOIRE", flag: "https://flagcdn.com/w160/ci.png" },
    "cote d'ivoire": { zone: "Africa/Abidjan", name: "CÔTE D'IVOIRE", flag: "https://flagcdn.com/w160/ci.png" },
    "cameroun": { zone: "Africa/Douala", name: "CAMEROUN", flag: "https://flagcdn.com/w160/cm.png" },
    "madagascar": { zone: "Indian/Antananarivo", name: "MADAGASCAR", flag: "https://flagcdn.com/w160/mg.png" },
    "haïti": { zone: "America/Port-au-Prince", name: "HAÏTI", flag: "https://flagcdn.com/w160/ht.png" },
    "haiti": { zone: "America/Port-au-Prince", name: "HAÏTI", flag: "https://flagcdn.com/w160/ht.png" }
};

module.exports = {
    config: {
        name: "heures",
        aliases: ["horloge", "timezone"],
        version: "2.0",
        author: "Célestin",
        countDown: 0,
        role: 0,
        shortDescription: {
            fr: "🕒 Affiche l'heure locale d'un pays sans préfixe."
        },
        longDescription: {
            fr: "Génère une horloge visuelle avec Canvas et intègre le drapeau du pays demandé."
        },
        category: "outils",
        guide: {
            fr: "Écrivez simplement : 'heures france', 'heures maroc', etc."
        }
    },

    onChat: async function({ api, event, message }) {
        if (!event.body) return;

        const msg = event.body.trim().toLowerCase();
        
        if (msg.startsWith("heures")) {
            const words = msg.split(" ");
            if (words.length < 2) {
                return message.reply("🕒 Précisez un pays valide ! Exemple : `heures france`.");
            }

            const countryInput = words.slice(1).join(" ").trim();
            const targetCountry = countryDataMap[countryInput];

            if (!targetCountry) {
                return message.reply("❌ Pays non pris en charge ou mal orthographié. Essayez : france, maroc, canada, japon, etc.");
            }

            try {
                // Récupération du temps via moment-timezone
                const localMoment = moment().tz(targetCountry.zone);
                const formattedTime = localMoment.format("HH:mm:ss");
                
                // Traduction française basique de la date
                moment.locale('fr');
                const formattedDate = localMoment.format("dddd D MMMM YYYY");

                // Construction avec Canvas
                const canvas = createCanvas(600, 250);
                const ctx = canvas.getContext('2d');

                // Fond
                ctx.fillStyle = "#141419";
                ctx.fillRect(0, 0, 600, 250);

                // Bordure dégradée
                const borderGrad = ctx.createLinearGradient(0, 0, 600, 0);
                borderGrad.addColorStop(0, "#3a7bd5");
                borderGrad.addColorStop(1, "#3a6073");
                ctx.strokeStyle = borderGrad;
                ctx.lineWidth = 10;
                ctx.strokeRect(5, 5, 590, 240);

                // Dessin du drapeau
                try {
                    const flagImg = await loadImage(targetCountry.flag);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(100, 125, 60, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(flagImg, 40, 65, 120, 120);
                    ctx.restore();
                } catch (e) {
                    ctx.fillStyle = "#3a7bd5";
                    ctx.beginPath();
                    ctx.arc(100, 125, 60, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Textes
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "left";
                ctx.font = "bold 32px sans-serif";
                ctx.fillText(targetCountry.name, 190, 85);

                ctx.fillStyle = "#54a0ff";
                ctx.font = "bold 55px monospace";
                ctx.fillText(formattedTime, 190, 155);

                ctx.fillStyle = "#a4b0be";
                ctx.font = "italic 20px sans-serif";
                ctx.fillText(formattedDate, 190, 195);

                const cacheDir = path.join(__dirname, "cache");
                await fs.ensureDir(cacheDir);
                const imagePath = path.join(cacheDir, `heures_${event.threadID}.png`);

                await fs.writeFile(imagePath, canvas.toBuffer('image/png'));

                await message.reply({
                    body: `🕒 Horloge locale : **${targetCountry.name}**`,
                    attachment: fs.createReadStream(imagePath)
                });

                fs.unlinkSync(imagePath);

            } catch (error) {
                console.error(error);
                return message.reply("❌ Une erreur graphique est survenue lors de la création de l'horloge.");
            }
        }
    },

    onStart: async function({ api, event, message }) {
        return this.onChat({ api, event, message });
    }
};
