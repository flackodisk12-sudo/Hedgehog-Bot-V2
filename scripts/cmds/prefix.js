const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const GIFEncoder = require('gifencoder');
const { utils } = global;

// ==========================================
// 🎨 ENGINE CANVAS ANIMÉ PREFIX STYLE (1000x580)
// ==========================================
async function generatePrefixCanvas(userId, title, prefixText, detailsText, themeColor, badgeText = "STATUS") {
	const width = 1000;
	const height = 580;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Décomposition sécurisée pour gérer les emojis sans les briser
	const charsArray = Array.from(prefixText);
	let framesText = [];

	// Étape A : Écriture progressive
	for (let i = 1; i <= charsArray.length; i++) {
		framesText.push(charsArray.slice(0, i).join("") + "┃");
	}
	// Étape B : Pause statique sur l'affichage complet
	const fullText = charsArray.join("");
	for (let i = 0; i < 8; i++) {
		framesText.push(fullText + " ");
	}
	// Étape C : Effacement très lent (caractère par caractère)
	for (let i = charsArray.length; i >= 0; i--) {
		framesText.push(charsArray.slice(0, i).join("") + "┃");
	}

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const gifPath = path.join(tmpDir, `prefix_${Date.now()}_${userId}.gif`);

	const encoder = new GIFEncoder(width, height);
	const writeStream = fs.createWriteStream(gifPath);
	encoder.createReadStream().pipe(writeStream);

	encoder.start();
	encoder.setRepeat(0);   
	encoder.setDelay(140); // Vitesse idéale demandée pour l'effet d'effacement progressif
	encoder.setQuality(10);

	// Chargement des Avatars (Même logique exacte que ton script de base)
	let userAvatar = null;
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		userAvatar = await loadImage(avatarUrl);
	} catch (e) {
		try {
			userAvatar = await loadImage(`https://api.mestaria.com/fb/avatar?id=${userId}`);
		} catch (err) {}
	}

	const avatarX = 200;
	const avatarY = 290;
	const radius = 110;

	// Génération des frames de l'animation
	for (let f = 0; f < framesText.length; f++) {
		ctx.clearRect(0, 0, width, height);

		// Fond sombre profond avec dégradé
		let gradient = ctx.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, '#0f0c20');
		gradient.addColorStop(0.5, '#0a0d16');
		gradient.addColorStop(1, '#04050a');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		// Cadre Lumineux Néon Cyber avec coins arrondis
		ctx.strokeStyle = themeColor;
		ctx.lineWidth = 5;
		ctx.shadowColor = themeColor;
		ctx.shadowBlur = 15;
		ctx.beginPath();
		ctx.roundRect(30, 30, width - 60, height - 60, 25);
		ctx.stroke();
		ctx.shadowBlur = 0; 

		// Anneau externe style chargement autour de l'avatar
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius + 12, 0, Math.PI * 2);
		ctx.stroke();

		ctx.strokeStyle = themeColor;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius + 12, 0.3, Math.PI * 1.5);
		ctx.stroke();

		if (userAvatar) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(userAvatar, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
			ctx.restore();
		} else {
			ctx.fillStyle = themeColor;
			ctx.beginPath(); 
			ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2); 
			ctx.fill();
		}

		// Badge Statut (Haut Droite)
		ctx.fillStyle = themeColor;
		ctx.fillRect(width - 160, 65, 95, 24);
		ctx.fillStyle = '#000000';
		ctx.font = 'bold 12px "Sans-Serif"';
		ctx.textAlign = 'center';
		ctx.fillText(badgeText.toUpperCase(), width - 112, 81);

		// Titre principal
		ctx.textAlign = 'left';
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 36px "Sans-Serif"';
		ctx.fillText(title.toUpperCase(), 420, 115);

		// Détails mineurs / Configuration globale
		ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
		ctx.font = '18px "Sans-Serif"';
		const cleanDetails = detailsText.length > 45 ? detailsText.substring(0, 42) + "..." : detailsText;
		ctx.fillText(cleanDetails, 420, 155);

		const decoration = "✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧";

		// ─── CADRE DÉCORATIF TEXTUEL (HAUT) ───
		ctx.textAlign = 'left';
		ctx.fillStyle = themeColor;
		ctx.font = 'bold 22px Arial';
		ctx.fillText(decoration, 420, 215);

		// ─── LOGIQUE D'AFFICHAGE DU PRÉFIXE ANIMÉ (AVEC POLICE EMOJI) ───
		ctx.textAlign = 'center';
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 110px "Sans-Serif", "Segoe UI Emoji", "Apple Color Emoji"';
		ctx.fillText(framesText[f], 660, 335);

		// Sous-texte "SYSTEM PREFIX"
		ctx.fillStyle = themeColor;
		ctx.font = 'bold 16px "Sans-Serif"';
		ctx.fillText("SYSTEM PREFIX", 660, 375);

		// ─── CADRE DÉCORATIF TEXTUEL (BAS) ───
		ctx.textAlign = 'left';
		ctx.fillStyle = themeColor;
		ctx.font = 'bold 22px Arial';
		ctx.fillText(decoration, 420, 455);

		// Signature footer
		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.font = '12px "Sans-Serif"';
		ctx.fillText("» CORE MATRIX MINI «", 420, 510);

		encoder.addFrame(ctx);
	}

	encoder.finish();
	await new Promise((resolve) => writeStream.on('finish', resolve));
	return gifPath;
}

module.exports = {
	config: {
		name: "prefix",
		version: "3.0 Animé",
		author: "NTKhang x Célestin 🔥",
		countDown: 5,
		role: 0,
		description: "Changer ou afficher le préfixe de commande du bot avec une interface GIF animée",
		category: "config",
		guide: {
			en: "   {pn} <nouveau préfixe>\n   Exemple: {pn} #\n\n   {pn} reset"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData }) {
		const senderID = event.senderID;
		const chatDeco = "❖ ── ✦ ──『✙』── ✦ ── ❖";

		if (!args[0]) {
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);
			const imagePath = await generatePrefixCanvas(senderID, "Core System", groupPrefix, `Global : [ ${sysPrefix} ]`, "#00f2fe", "ACTIVE");
			
			return message.reply({
				body: `${chatDeco}\n⚙️ **PRÉFIXE ACTUEL DU GROUPE :** [ ${groupPrefix} ]\n🌍 **PRÉFIXE GLOBAL :** [ ${sysPrefix} ]\n${chatDeco}`,
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
				body: `${chatDeco}\n🔄 **SYSTÈME RÉINITIALISÉ**\nLe préfixe est revenu par défaut : [ ${defaultPrefix} ]\n${chatDeco}`,
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
			`${chatDeco}\n⚠️ **ACTION REQUISE**\nRéagissez à ce message pour valider le changement vers : [ ${newPrefix} ]\n${chatDeco}`,
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;
		const chatDeco = "❖ ── ✦ ──『✙』── ✦ ── ❖";

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			const imagePath = await generatePrefixCanvas(author, "Global Config", newPrefix, "Réseau global mis à jour", "#7000ff", "GLOBAL");
			return message.reply({
				body: `${chatDeco}\n🌐 **CONFIGURATION GLOBALE MISE À JOUR**\nNouveau préfixe réseau : [ ${newPrefix} ]\n${chatDeco}`,
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			const imagePath = await generatePrefixCanvas(author, "Local Config", newPrefix, "Ce groupe uniquement", "#00f2fe", "LOCAL");
			return message.reply({
				body: `${chatDeco}\n📌 **CONFIGURATION LOCALE MISE À JOUR**\nNouveau préfixe pour ce groupe : [ ${newPrefix} ]\n${chatDeco}`,
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const uid = event.senderID;
			const chatDeco = "❖ ── ✦ ──『✙』── ✦ ── ❖";
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);

			const imagePath = await generatePrefixCanvas(uid, "Core System", groupPrefix, `Global : [ ${sysPrefix} ]`, "#00f2fe", "ACTIVE");

			return message.reply({
				body: `${chatDeco}\n⚙️ **PRÉFIXE ACTUEL DU GROUPE :** [ ${groupPrefix} ]\n🌍 **PRÉFIXE GLOBAL :** [ ${sysPrefix} ]\n${chatDeco}`,
				attachment: fs.createReadStream(imagePath)
			}, () => {
				setTimeout(() => { if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }, 2000);
			});
		}
	}
};
