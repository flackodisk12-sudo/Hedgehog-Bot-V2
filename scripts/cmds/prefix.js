const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const { utils } = global;

// ==========================================
// 🎨 ENGINE CANVAS MINIMALISTE BLEU & NOIR (280x280)
// ==========================================
async function generatePrefixCanvas(userId, title, prefixText, detailsText, themeColor, badgeText = "STATUS") {
	const size = 280; // Format ultra compact et stylé
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');

	// Fond sombre profond (Bleu nuit très foncé / Noir)
	let gradient = ctx.createRadialGradient(size/2, size/2, 20, size/2, size/2, size);
	gradient.addColorStop(0, '#0a0d16');
	gradient.addColorStop(1, '#04050a');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	// Bordures fines Néon Cyber
	ctx.strokeStyle = themeColor;
	ctx.lineWidth = 2;
	ctx.strokeRect(10, 10, size - 20, size - 20);

	const avatarX = 55;
	const avatarY = 55;
	const radius = 28;

	// Récupération et affichage de l'avatar de l'utilisateur
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=100&height=100&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		const userAvatar = await loadImage(avatarUrl);
		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(userAvatar, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
		ctx.restore();

		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius + 1, 0, Math.PI * 2);
		ctx.stroke();
	} catch (e) {
		ctx.fillStyle = themeColor;
		ctx.beginPath(); 
		ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2); 
		ctx.fill();
	}

	// Badge Statut (Haut Droite)
	ctx.fillStyle = themeColor;
	ctx.fillRect(size - 110, 35, 75, 14);
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 8px "Sans-Serif"';
	ctx.textAlign = 'center';
	ctx.fillText(badgeText.toUpperCase(), size - 72, 45);

	// Titre (En dessous de l'avatar)
	ctx.textAlign = 'left';
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 12px "Sans-Serif"';
	ctx.fillText(title.toUpperCase(), 25, 110);

	// Ligne de séparation technique
	ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
	ctx.lineWidth = 1;
	ctx.beginPath(); ctx.moveTo(25, 122); ctx.lineTo(size - 25, 122); ctx.stroke();

	// Gros Préfixe au centre
	ctx.textAlign = 'center';
	ctx.fillStyle = themeColor;
	ctx.font = 'bold 55px "Sans-Serif"';
	ctx.fillText(prefixText, size / 2, 195);

	// Sous-texte "PREFIX"
	ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
	ctx.font = 'bold 9px "Sans-Serif"';
	ctx.fillText("SYSTEM PREFIX", size / 2, 215);

	// Détails mineurs en bas
	ctx.fillStyle = '#8a92a6';
	ctx.font = '10px "Sans-Serif"';
	const cleanDetails = detailsText.length > 35 ? detailsText.substring(0, 32) + "..." : detailsText;
	ctx.fillText(cleanDetails, size / 2, 245);

	// Signature footer
	ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
	ctx.font = '8px "Sans-Serif"';
	ctx.fillText("» CORE MATRIX MINI «", size / 2, 265);

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const imagePath = path.join(tmpDir, `prefix_${Date.now()}_${userId}.png`);
	fs.writeFileSync(imagePath, canvas.toBuffer('image/png'));
	return imagePath;
}

module.exports = {
	config: {
		name: "prefix",
		version: "2.5",
		author: "NTKhang x Célestin 🔥",
		countDown: 5,
		role: 0,
		description: "Changer ou afficher le préfixe de commande du bot",
		category: "config",
		guide: {
			en: "   {pn} <nouveau préfixe>\n   Exemple: {pn} #\n\n   {pn} reset"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData }) {
		const senderID = event.senderID;

		if (!args[0]) {
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);
			const imagePath = await generatePrefixCanvas(senderID, "Core System", groupPrefix, `Global : [ ${sysPrefix} ]`, "#00f2fe", "ACTIVE");
			
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		}

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			const defaultPrefix = global.GoatBot.config.prefix;
			const imagePath = await generatePrefixCanvas(senderID, "Reset System", defaultPrefix, "Retour usine", "#ff4d6d", "RESET");
			
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2) return;
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		return message.reply(
			"⚠️ Réagissez à ce message pour valider le changement.",
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			const imagePath = await generatePrefixCanvas(author, "Global Config", newPrefix, "Réseau global mis à jour", "#7000ff", "GLOBAL");
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			const imagePath = await generatePrefixCanvas(author, "Local Config", newPrefix, "Ce groupe uniquement", "#00f2fe", "LOCAL");
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const uid = event.senderID;
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);

			const imagePath = await generatePrefixCanvas(uid, "Core System", groupPrefix, `Global : [ ${sysPrefix} ]`, "#00f2fe", "ACTIVE");

			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		}
	}
};
