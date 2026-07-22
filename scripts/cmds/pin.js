/**
 * @author Zetsu & Shade
 * @title Pinterest Catalogue HD Premium
 * @name pin
 * @class pinterest
 * @version 4.0.0
 * @description Recherche des images Pinterest HD sous forme de catalogue Canvas fluide et interactif.
 * @usage pin [mot-clé]
 * @alt pinterest
 */
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

async function createCatalogueCanvas(imagesUrls, query, page) {
    const canvas = createCanvas(1200, 2400);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0b0e14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px sans-serif";
    ctx.fillText(`📌 CATALOGUE PINTEREST : ${query.toUpperCase()}`, 60, 90);
        
    ctx.fillStyle = "#9ca3af";
    ctx.font = "30px sans-serif";
    ctx.fillText(`Page ${page} • Repondez [1-10] ou "page [N°]"`, 60, 140);

    const startX = 60, startY = 200;
    const itemWidth = 510, itemHeight = 380;
    const gapX = 60, gapY = 40;

    const loadedImages = await Promise.all(
        imagesUrls.map(url => loadImage(url).catch(() => null))
    );

    for (let i = 0; i < 10; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = startX + col * (itemWidth + gapX);
        const y = startY + row * (itemHeight + gapY);

        ctx.fillStyle = "#1f2937";
        ctx.fillRect(x, y, itemWidth, itemHeight);

        if (loadedImages[i]) {
            const img = loadedImages[i];
            const scale = Math.max(itemWidth / img.width, itemHeight / img.height);
            const sw = itemWidth / scale;
            const sh = itemHeight / scale;
            const sx = (img.width - sw) / 2;
            const sy = (img.height - sh) / 2;

            ctx.drawImage(img, sx, sy, sw, sh, x, y, itemWidth, itemHeight);
        } else {
            ctx.fillStyle = "#374151";
            ctx.font = "24px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Image indisponible", x + itemWidth / 2, y + itemHeight / 2);
            ctx.textAlign = "left";
        }

        ctx.fillStyle = "#e60023";
        ctx.beginPath();
        ctx.arc(x + 40, y + 40, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), x + 40, y + 40);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }

    const cachePath = path.join(os.tmpdir(), `pin_cat_${Date.now()}.png`);
    await fs.writeFile(cachePath, canvas.toBuffer("image/png"));
    return cachePath;
}

module.exports = {
    config: {
        name: "pin",
        aliases: ["pinterest"],
        version: "4.0.0",
        author: "Zetsu & Shade",
        countDown: 5,
        role: 0,
        category: "image",
        guide: {
            fr: "{p}{n} <recherche>\nExemple: {p}{n} naruto"
        }
    },

    onStart: async function ({ api, event, message, args, commandName }) {
        const { threadID, messageID, senderID } = event;
        const query = args.join(" ");

        if (!query) {
            return message.reply("❌ Veuillez entrer un mot-cle.");
        }

        const apiUrl = `https://zetbot-page.onrender.com/api/pinterest?query=${encodeURIComponent(query)}&limit=30`;

        try {
            const loadingMsg = await message.reply("🔍 Generation du catalogue...");
            const response = await axios.get(apiUrl, { timeout: 15000 });

            if (!response.data.status || !response.data.pins || response.data.pins.length === 0) {
                try { api.unsendMessage(loadingMsg.messageID); } catch(e){}
                return message.reply("❌ Aucun resultat trouve.");
            }

            const allPins = response.data.pins;
            const pageUrls = allPins.slice(0, 10).map(p => typeof p === 'string' ? p : p.image);
            const imgPath = await createCatalogueCanvas(pageUrls, query, 1);

            try { api.unsendMessage(loadingMsg.messageID); } catch(e){}

            const textBody = "📸 CATALOGUE PINTEREST HD\n\nInstructions :\n• Repondez avec un chiffre (1 a 10) pour la photo HD.\n• Repondez page 2 ou page 3 pour faire defiler.";

            api.sendMessage({
                body: textBody,
                attachment: fs.createReadStream(imgPath)
            }, threadID, (err, info) => {
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                if (err) return console.error(err);

                const replyData = {
                    commandName: "pin",
                    name: "pin",
                    author: senderID,
                    query: query,
                    allPins: allPins,
                    currentPage: 1,
                    messageID: info.messageID
                };

                if (global.GoatBot && global.GoatBot.onReply) {
                    if (typeof global.GoatBot.onReply.set === "function") {
                        global.GoatBot.onReply.set(info.messageID, replyData);
                    } else if (Array.isArray(global.GoatBot.onReply)) {
                        global.GoatBot.onReply.push(replyData);
                    }
                }
            }, messageID);

        } catch (error) {
            console.error("Erreur Pinterest :", error);
            return message.reply("❌ L'API de recherche met trop de temps a repondre. Reessayez dans un instant.");
        }
    },

    onReply: async function ({ api, event, Reply, message }) {
        const replyData = Reply || (message && message.Reply) || (global.GoatBot && global.GoatBot.onReply && typeof global.GoatBot.onReply.get === "function" ? global.GoatBot.onReply.get(event.messageReply?.messageID) : null);
        if (!replyData) return;

        const { author, query, allPins, currentPage } = replyData;

        if (event.senderID !== author) return;

        const input = event.body.trim().toLowerCase();

        // 1. CHANGEMENT DE PAGE
        if (input.startsWith("page")) {
            const pageNum = parseInt(input.replace("page", "").trim());
            const totalPages = Math.ceil(allPins.length / 10);

            if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
                return message.reply(`❌ Page invalide (1 a ${totalPages}).`);
            }

            try {
                await api.setMessageReaction("⏳", event.messageID, () => {}, true);
                
                const startIndex = (pageNum - 1) * 10;
                const pagePins = allPins.slice(startIndex, startIndex + 10);
                const pageUrls = pagePins.map(p => typeof p === 'string' ? p : p.image);

                const imgPath = await createCatalogueCanvas(pageUrls, query, pageNum);

                try { await api.unsendMessage(replyData.messageID); } catch(e){}

                api.sendMessage({
                    body: `📸 CATALOGUE PINTEREST HD (Page ${pageNum}/${totalPages})\n\nRepondez [1-10] ou page [N°].`,
                    attachment: fs.createReadStream(imgPath)
                }, event.threadID, (err, info) => {
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                    try { api.setMessageReaction("✅", event.messageID, () => {}, true); } catch(e){}
                    if (err) return console.error(err);

                    const newReplyData = {
                        ...replyData,
                        currentPage: pageNum,
                        messageID: info.messageID
                    };

                    if (global.GoatBot && global.GoatBot.onReply && typeof global.GoatBot.onReply.set === "function") {
                        global.GoatBot.onReply.set(info.messageID, newReplyData);
                    }
                }, event.messageID);

            } catch (err) {
                console.error("Erreur page :", err);
                try { api.setMessageReaction("❌", event.messageID, () => {}, true); } catch(e){}
                return message.reply(`❌ Erreur : ${err.message}`);
            }
            return;
        }

        // 2. ENVOI DE LA PHOTO HD
        const choice = parseInt(input);
        const startIndex = (currentPage - 1) * 10;
        const pagePins = allPins.slice(startIndex, startIndex + 10);

        if (isNaN(choice) || choice < 1 || choice > pagePins.length) {
            return message.reply(`❌ Choisissez un chiffre valide entre 1 et ${pagePins.length}.`);
        }

        const selectedPin = pagePins[choice - 1];
        const imageUrl = typeof selectedPin === 'string' ? selectedPin : (selectedPin.image || selectedPin.url);

        try {
            await api.setMessageReaction("⏳", event.messageID, () => {}, true);

            const imgPath = path.join(os.tmpdir(), `pin_hd_${Date.now()}.jpg`);

            const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 15000 });
            await fs.writeFile(imgPath, imgRes.data);

            api.sendMessage({
                body: `📌 Photo HD selectionnee (${choice})`,
                attachment: fs.createReadStream(imgPath)
            }, event.threadID, (err) => {
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                if (err) {
                    console.error("Erreur d'envoi HD :", err);
                    try { api.setMessageReaction("❌", event.messageID, () => {}, true); } catch(e){}
                    message.reply("❌ Impossible d'envoyer l'image.");
                } else {
                    try { api.setMessageReaction("✅", event.messageID, () => {}, true); } catch(e){}
                }
            }, event.messageID);

        } catch (err) {
            console.error("Erreur de telechargement :", err);
            try { api.setMessageReaction("❌", event.messageID, () => {}, true); } catch(e){}
            return message.reply(`❌ Échec du téléchargement : ${err.message}`);
        }
    }
};
