const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const { utils } = global;

// ==========================================
// 🎨 ENGIN CANVAS POUR BADGES CONFIG SYSTEM
// ==========================================
async function generatePrefixCanvas(userId, title, prefixText, detailsText, themeColor) {
	const canvas = createCanvas(900, 450);
	const ctx = canvas.getContext('2d');

	// Fond dégradé sombre et technologique
	let gradient = ctx.createLinearGradient(0, 0, 900, 450);
	gradient.addColorStop(0, '#0a0f1d');
	gradient.addColorStop(0.5, '#121829');
	gradient.addColorStop(1, '#0a0f1d');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Cadres doubles gravés de style
	ctx.strokeStyle = themeColor;
	ctx.lineWidth = 4;
	ctx.strokeRect(25, 25, 850, 400);
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 1;
	ctx.strokeRect(32, 32, 836, 386);

	// Séparateurs graphiques (✧ ▬▭▬)
	ctx.fillStyle = themeColor;
	ctx.font = 'bold 16px "Sans-Serif"';
	ctx.fillText("✧ ▬▭▬ ▬▬ ✦ ▬▬ ▬▭▬ ✧", 400, 65);
	ctx.fillText("✧ ▬▭▬ ▬▬ ✦ ▬▬ ▬▭▬ ✧", 400, 395);

	// Récupération de la photo de profil (Avatar utilisateur ou backup)
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=300&height=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		const userAvatar = await loadImage(avatarUrl);
		ctx.save();
		ctx.beginPath();
		ctx.arc(190, 225, 110, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(userAvatar, 80, 115, 220, 220);
		ctx.restore();

		// Anneau lumineux néon
		ctx.strokeStyle = themeColor;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.arc(190, 225, 112, 0, Math.PI * 2);
		ctx.stroke();
	} catch (e) {
		ctx.fillStyle = themeColor;
		ctx.beginPath(); ctx.arc(190, 225, 110, 0, Math.PI * 2); ctx.fill();
	}

	// Écriture des données systèmes
	ctx.fillStyle = themeColor;
	ctx.font = 'bold 36px "Sans-Serif"';
	ctx.fillText(title, 400, 130);

	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 48px "Sans-Serif"';
	ctx.fillText(`⚡ 𝑷𝒓𝒆́𝒇𝒊𝒙𝒆 :  ${prefixText}`, 400, 210);

	ctx.fillStyle = '#aaaaaa';
	ctx.font = '20px "Sans-Serif"';
	ctx.fillText(detailsText, 400, 280);

	ctx.fillStyle = '#ffffff';
	ctx.font = 'italic 16px "Sans-Serif"';
	ctx.fillText("» CONFIGURATION MATRIX «", 400, 345);

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const imagePath = path.join(tmpDir, `prefix_${Date.now()}_${userId}.png`);
	fs.writeFileSync(imagePath, canvas.toBuffer('image/png'));
	return imagePath;
}

module.exports = {
	config: {
		name: "prefix",
		version: "2.0",
		author: "NTKhang x Célestin 🔥 (Canvas Edition)",
		countDown: 5,
		role: 0,
		description: "Changer le préfixe du bot",
		category: "config",
		guide: {
			en: "   {pn} <nouveau préfixe>\n   Exemple: {pn} #\n\n   {pn} <nouveau préfixe> -g (admin bot)\n   Exemple: {pn} # -g\n\n   {pn} reset"
		}
	},

	langs: {
		en: {
			reset: "┏━━━━━━━━━━━━━━━┓\n🔄 Préfixe réinitialisé : %1\n┗━━━━━━━━━━━━━━━┛",
			onlyAdmin: "⛔ Seul un admin bot peut faire ça",
			confirmGlobal: "━━━━━━━━━━━━━━━\n⚠️ Confirmation requise\n🌐 Changement GLOBAL\nRéagis pour confirmer\n━━━━━━━━━━━━━━━",
			confirmThisThread: "━━━━━━━━━━━━━━━\n⚠️ Confirmation requise\n💬 Changement dans ce groupe\nRéagis pour confirmer\n━━━━━━━━━━━━━━━",
			successGlobal: "━━━━━━━━━━━━━━━\n✅ Préfixe global changé : %1\n━━━━━━━━━━━━━━━",
			successThisThread: "━━━━━━━━━━━━━━━\n✅ Préfixe du groupe changé : %1\n━━━━━━━━━━━━━━━",
			myPrefix: "\n━━━━━━━━━━━━━━ ◦ ❖ ◦ ━━━━━━\n⚙️  𝑺𝒚𝒔𝒕𝒆̀𝒎𝒆 : %1\n💬  𝑮𝒓𝒐𝒖𝒑𝒆 : %2\n━━━━━━━━━━━━━━ ◦ ❖ ◦ ━━━━━━\n"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		const senderID = event.senderID;

		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			const defaultPrefix = global.GoatBot.config.prefix;
			const imagePath = await generatePrefixCanvas(senderID, "🔄 RESET SYSTEM", defaultPrefix, "Retour aux paramètres par défaut", "#00b4d8");
			
			return message.reply({
				body: getLang("reset", defaultPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		}
		else {
			formSet.setGlobal = false;
		}

		return message.reply(
			args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;

		if (event.userID !== author)
			return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			const imagePath = await generatePrefixCanvas(author, "🌐 GLOBAL CONFIG", newPrefix, "Prise en compte sur l'ensemble du réseau", "#3a0ca3");
			return message.reply({
				body: getLang("successGlobal", newPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			const imagePath = await generatePrefixCanvas(author, "💬 LOCAL CONFIG", newPrefix, "Prise en compte uniquement dans ce salon", "#4cc9f0");
			return message.reply({
				body: getLang("successThisThread", newPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			return async () => {
				const uid = event.senderID;
				const sysPrefix = global.GoatBot.config.prefix;
				const groupPrefix = utils.getPrefix(event.threadID);

				// Génération de l'image Canvas d'affichage des préfixes actuels
				const imagePath = await generatePrefixCanvas(
					uid, 
					"⚙️ SYSTEM PARAMETERS", 
					groupPrefix, 
					`Global Core Engine : [ ${sysPrefix} ]`, 
					"#72efdd"
				);

				return message.reply({
					body: getLang("myPrefix", sysPrefix, groupPrefix),
					attachment: fs.createReadStream(imagePath)
				}, () => fs.unlinkSync(imagePath));
			};
		}
	}
};
