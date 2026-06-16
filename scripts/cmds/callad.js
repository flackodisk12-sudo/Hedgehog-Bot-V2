const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const { getStreamsFromAttachment } = global.utils;

// Chemin sécurisé pour le cache
const cacheDir = path.join(__dirname, "cache");

async function generateCallAdminCanvas(userId, userName, title, subTitle, messageContent, themeColor) {
    await fs.ensureDir(cacheDir);
    const canvas = createCanvas(900, 450);
    const ctx = canvas.getContext('2d');

    // Fond
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, 900, 450);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, 850, 400);

    // Avatar
    try {
        const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=300&height=300`;
        const userAvatar = await loadImage(avatarUrl);
        ctx.save();
        ctx.beginPath();
        ctx.arc(190, 225, 110, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userAvatar, 80, 115, 220, 220);
        ctx.restore();
    } catch (e) {
        ctx.fillStyle = themeColor;
        ctx.beginPath(); ctx.arc(190, 225, 110, 0, Math.PI * 2); ctx.fill();
    }

    // Textes
    ctx.fillStyle = themeColor;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(title, 400, 120);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`👤 Nom : ${userName.substring(0, 20)}`, 400, 175);
    ctx.fillText(subTitle, 400, 220);
    ctx.fillText(`💬 ${messageContent.substring(0, 50)}...`, 400, 270);

    const imagePath = path.join(cacheDir, `callad_${Date.now()}.png`);
    await fs.writeFile(imagePath, canvas.toBuffer('image/png'));
    return imagePath;
}

module.exports = {
    config: {
        name: "callad",
        version: "3.0",
        role: 0,
        category: "contacts admin"
    },

    onStart: async function ({ args, message, event, usersData, api, threadsData }) {
        // Lecture directe de la config globale
        const adminList = global.GoatBot.config.adminBot || [];
        if (adminList.length === 0) return message.reply("⚠️ Aucun administrateur trouvé dans le config.json");
        
        if (!args[0]) return message.reply("⚠️ Écrivez votre message pour l'admin.");

        const senderName = await usersData.getName(event.senderID);
        const textContent = args.join(" ");
        const imagePath = await generateCallAdminCanvas(event.senderID, senderName, "APPEL ADMIN", "Message urgent", textContent, "#ffb703");

        const formMessage = {
            body: `📩 Appel de : ${senderName}\n\n📜 Message : ${textContent}`,
            attachment: fs.createReadStream(imagePath)
        };

        let successCount = 0;
        for (const uid of adminList) {
            try {
                await api.sendMessage(formMessage, uid);
                successCount++;
            } catch (err) {
                console.error(`Erreur envoi admin ${uid}:`, err);
            }
        }

        await fs.unlink(imagePath);
        message.reply(`✅ Message transmis à ${successCount} administrateur(s).`);
    }
};
