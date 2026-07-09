const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const GIFEncoder = require('gifencoder');
const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

// =========================================================
// 🚀 ENGINE WHITELIST 50-FRAMES ULTRA-ANIMÉ CYBER (950x520)
// =========================================================
async function generateWhitelistGIF(userId, title, subtitle, detail1, detail2, themeColor, badgeText = "SECURITY") {
	const width = 950;
	const height = 520;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	const totalFrames = 50;
	let glitchTrigger = [];

	for (let f = 0; f < totalFrames; f++) {
		glitchTrigger.push(f >= 12 && f <= 32 && f % 4 === 0);
	}

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const gifPath = path.join(tmpDir, `whitelist_${Date.now()}_${userId}.gif`);

	const encoder = new GIFEncoder(width, height);
	const writeStream = fs.createWriteStream(gifPath);
	encoder.createReadStream().pipe(writeStream);

	encoder.start();
	encoder.setRepeat(0);   
	encoder.setDelay(60); 
	encoder.setQuality(15);

	let userAvatar = null;
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		userAvatar = await loadImage(avatarUrl);
	} catch (e) {
		try {
			userAvatar = await loadImage(`https://api.mestaria.com/fb/avatar?id=${userId}`);
		} catch (err) {}
	}

	const avatarX = 770;
	const avatarY = 260;
	const radius = 95;

	for (let f = 0; f < totalFrames; f++) {
		ctx.clearRect(0, 0, width, height);

		let gradient = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width);
		gradient.addColorStop(0, '#0f0926');
		gradient.addColorStop(0.6, '#04040a');
		gradient.addColorStop(1, '#000000');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		ctx.strokeStyle = themeColor;
		ctx.lineWidth = glitchTrigger[f] ? 6 : 4;
		ctx.shadowColor = themeColor;
		ctx.shadowBlur = glitchTrigger[f] ? 25 : 15;
		ctx.beginPath();
		ctx.roundRect(25, 25, width - 50, height - 50, 18);
		ctx.stroke();
		ctx.shadowBlur = 0;

		ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius + 14, 0, Math.PI * 2);
		ctx.stroke();

		ctx.strokeStyle = themeColor;
		ctx.lineWidth = 4;
		ctx.beginPath();
		let rotationAngle = f * 0.13;
		ctx.arc(avatarX, avatarY, radius + 14, rotationAngle, rotationAngle + Math.PI * 0.85);
		ctx.stroke();

		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		let particleAngle = -(f * 0.1);
		ctx.arc(avatarX + (radius + 22) * Math.cos(particleAngle), avatarY + (radius + 22) * Math.sin(particleAngle), 3, 0, Math.PI * 2);
		ctx.fill();

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

		ctx.fillStyle = themeColor;
		ctx.beginPath();
		ctx.roundRect(50, 45, 110, 24, 4);
		ctx.fill();
		ctx.fillStyle = '#000000';
		ctx.font = 'bold 11px "Sans-Serif"';
		ctx.textAlign = 'center';
		ctx.fillText(badgeText.toUpperCase(), 105, 61);

		let textOffset = glitchTrigger[f] ? Math.floor(Math.random() * 6) - 3 : 0;
		ctx.textAlign = 'left';

		ctx.fillStyle = glitchTrigger[f] ? themeColor : '#ffffff';
		ctx.font = 'bold 36px "Sans-Serif"';
		ctx.fillText(title.toUpperCase(), 50 + textOffset, 120 + textOffset);

		ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
		ctx.font = '16px "Sans-Serif"';
		ctx.fillText(subtitle, 50, 155);

		ctx.fillStyle = themeColor;
		ctx.fillRect(50, 185, width - 360, 2);

		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 21px "Sans-Serif"';
		const d1 = detail1.length > 55 ? detail1.substring(0, 52) + "..." : detail1;
		ctx.fillText(d1, 60, 260);
		
		ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
		ctx.font = '16px "Sans-Serif"';
		const d2 = detail2.length > 60 ? detail2.substring(0, 57) + "..." : detail2;
		ctx.fillText(d2, 60, 310);

		ctx.fillStyle = (f % 5 === 0) ? '#ffffff' : themeColor;
		ctx.font = 'bold 12px "Sans-Serif"';
		ctx.fillText(`⚡ CONTROL PROTOCOL SECURE // FRAME_${f.toString().padStart(2, '0')} ⚡`, 60, 420);

		ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.font = '11px "Sans-Serif"';
		ctx.textAlign = 'right';
		ctx.fillText("WHITELIST MONITOR V4.5 «", width - 50, height - 45);

		encoder.addFrame(ctx);
	}

	encoder.finish();
	await new Promise((resolve) => writeStream.on('finish', resolve));
	return gifPath;
}

module.exports = {
	config: {
		name: "whitelist",
		aliases: ["wl"],
		version: "4.5 Full-Anim-Errors",
		author: "NeoKEX x Célestin 😎",
		countDown: 3,
		role: 2, // Restreint nativement aux Admins du bot
		description: {
			fr: "Gérer l'accès restreint au bot via des cartes GIF animées avec gestion d'erreurs en Canvas"
		},
		category: "owner",
		guide: {
			fr: `⚡ ── WHITELIST CONTROL PANEL ── ⚡\n\n👤 MODE UTILISATEUR:\n  {pn} user add <uid | @tag>\n  {pn} user remove <uid | @tag>\n  {pn} user list\n  {pn} user on/off\n\n💬 MODE GROUPE:\n  {pn} thread add [id]\n  {pn} thread remove [id]\n  {pn} thread list\n  {pn} thread on/off\n\n📊 MONITOR:\n  {pn} status`
		}
	},

	onStart: async function ({ message, args, usersData, threadsData, event, role }) {
		if (!config.whiteListMode) config.whiteListMode = { enable: false, whiteListIds: [] };
		if (!config.whiteListMode.whiteListIds) config.whiteListMode.whiteListIds = [];
		if (!config.whiteListModeThread) config.whiteListModeThread = { enable: false, whiteListThreadIds: [] };
		if (!config.whiteListModeThread.whiteListThreadIds) config.whiteListModeThread.whiteListThreadIds = [];

		const saveConfig = () => writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
		
		const sendAnimated = async (gifPath, txtBody) => {
			return message.reply({ body: txtBody, attachment: fs.createReadStream(gifPath) }, () => {
				setTimeout(() => { if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath); }, 2500);
			});
		};

		const subCommand = args[0]?.toLowerCase();
		const action = args[1]?.toLowerCase();
		const senderID = event.senderID;
		const chatDeco = "⚡ ════════════════════ ⚡";

		// Erreur 1 : Permission insuffisante (Si rôle inférieur à l'admin du bot)
		if (role < 2) {
			const gif = await generateWhitelistGIF(senderID, "Permission Refusée", "Accès administrateur requis", "Erreur : Niveau de sécurité insuffisant", "Vos identifiants n'ont pas les droits ROOT", "#ff3366", "DENIED");
			return sendAnimated(gif, `❌ **ERREUR SYSTÈME : ACCÈS REFUSÉ**`);
		}

		// Erreur 2 : Absence de sous-commande
		if (!subCommand) {
			const gif = await generateWhitelistGIF(senderID, "Structure Invalide", "Veuillez entrer des paramètres valides", "Syntaxe attendue : user, thread ou status", "Consultez le guide d'aide pour plus d'infos", "#ffcc00", "WARNING");
			return sendAnimated(gif, `💡 **AIDE SYSTÈME : Paramètres manquants.**`);
		}

		switch (subCommand) {
			case "user":
			case "u": {
				switch (action) {
					case "add":
					case "-a": {
						let uids = Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions) : (event.messageReply ? [event.messageReply.senderID] : args.slice(2).filter(arg => !isNaN(arg)));
						if (uids.length === 0) {
							const gif = await generateWhitelistGIF(senderID, "Paramètre Manquant", "Cible utilisateur introuvable", "Veuillez mentionner ou inscrire un UID", "Format : user add <uid/@tag>", "#ff3366", "ERROR");
							return sendAnimated(gif, `⚠️ **Erreur : Aucun utilisateur ciblé.**`);
						}

						let logAdded = [];
						for (const uid of uids) {
							if (!config.whiteListMode.whiteListIds.map(String).includes(String(uid))) {
								config.whiteListMode.whiteListIds.push(String(uid));
								logAdded.push(await usersData.getName(uid));
							}
						}
						saveConfig();
						
						const targetID = uids[0] || senderID;
						const gif = await generateWhitelistGIF(targetID, "Accès User Accordé", "Base de données mise à jour", `Ajouté : ${logAdded.join(', ') || 'Aucun (déjà présent)'}`, `Total Whitelistés : ${config.whiteListMode.whiteListIds.length}`, "#00ffcc", "GRANTED");
						return sendAnimated(gif, `${chatDeco}\n🔐 **ACCÈS AJOUTÉ :** ${logAdded.join(', ') || 'Déjà enregistré'}\n${chatDeco}`);
					}

					case "remove":
					case "-r": {
						let uids = Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions) : (event.messageReply ? [event.messageReply.senderID] : args.slice(2).filter(arg => !isNaN(arg)));
						if (uids.length === 0) {
							const gif = await generateWhitelistGIF(senderID, "Paramètre Manquant", "Cible utilisateur introuvable", "Veuillez spécifier l'identifiant à révoquer", "Format : user remove <uid>", "#ff3366", "ERROR");
							return sendAnimated(gif, `⚠️ **Erreur : UID requis.**`);
						}

						let logRemoved = [];
						for (const uid of uids) {
							const index = config.whiteListMode.whiteListIds.map(String).indexOf(String(uid));
							if (index !== -1) {
								config.whiteListMode.whiteListIds.splice(index, 1);
								logRemoved.push(await usersData.getName(uid));
							}
						}
						saveConfig();

						const targetID = uids[0] || senderID;
						const gif = await generateWhitelistGIF(targetID, "Accès User Révoqué", "Suppression des privilèges", `Retiré : ${logRemoved.join(', ') || 'Aucun changement'}`, `Membres restants : ${config.whiteListMode.whiteListIds.length}`, "#ff3366", "REVOKED");
						return sendAnimated(gif, `${chatDeco}\n❌ **ACCÈS SUPPRIMÉ :** ${logRemoved.join(', ') || 'Introuvable'}\n${chatDeco}`);
					}

					case "list":
					case "-l": {
						const listIds = config.whiteListMode.whiteListIds;
						if (listIds.length === 0) {
							const gif = await generateWhitelistGIF(senderID, "Registre Vierge", "Aucune donnée enregistrée", "La base de données whitelist est vide", "Utilisez 'user add' pour inscrire des membres", "#ffcc00", "EMPTY");
							return sendAnimated(gif, `📋 **Information : Whitelist utilisateur vide.**`);
						}
						
						let summary = "";
						for (let i = 0; i < Math.min(listIds.length, 3); i++) {
							summary += `• ${await usersData.getName(listIds[i])}\n`;
						}
						if (listIds.length > 3) summary += `... et ${listIds.length - 3} autres.`;

						const gif = await generateWhitelistGIF(senderID, "Utilisateurs Whitelists", "Registre d'authentification", `Total : ${listIds.length} utilisateurs`, "Droits d'administration root activés", "#9d4edd", "SECURITY");
						return sendAnimated(gif, `${chatDeco}\n📋 **LISTE UTILISATEURS APPROUVÉS :**\n${summary}\n${chatDeco}`);
					}

					case "on": {
						config.whiteListMode.enable = true; saveConfig();
						const gif = await generateWhitelistGIF(senderID, "Mode Restreint ON", "Vérification d'identité active", "Statut : PARE-FEU BLOQUANT", "Seuls les membres de la liste ont l'accès", "#ffcc00", "SHIELD ON");
						return sendAnimated(gif, `🛡️ **PARE-FEU UTILISATEUR EN PLACE**`);
					}
					case "off": {
						config.whiteListMode.enable = false; saveConfig();
						const gif = await generateWhitelistGIF(senderID, "Mode Restreint OFF", "Vérification désactivée", "Statut : ACCÈS LIBRE", "Le bot répond à tous les utilisateurs", "#00ffcc", "SHIELD OFF");
						return sendAnimated(gif, `🔓 **PARE-FEU UTILISATEUR RETIRÉ**`);
					}
					default: {
						const gif = await generateWhitelistGIF(senderID, "Action Inconnue", "Sous-commande utilisateur invalide", "Options valides : add, remove, list, on, off", "Vérifiez vos paramètres", "#ff3366", "ERROR");
						return sendAnimated(gif, `❌ **Erreur : Commande incorrecte.**`);
					}
				}
			}

			case "thread":
			case "t": {
				let threadID = args[2] || event.threadID;

				switch (action) {
					case "add":
					case "-a": {
						if (config.whiteListModeThread.whiteListThreadIds.map(String).includes(String(threadID))) {
							const gif = await generateWhitelistGIF(senderID, "Conflit Réseau", "Processus d'ajout annulé", "Ce canal est déjà enregistré", `ID : ${threadID}`, "#ffcc00", "EXISTS");
							return sendAnimated(gif, `⚠️ **Le groupe possède déjà les autorisations.**`);
						}
						config.whiteListModeThread.whiteListThreadIds.push(String(threadID));
						saveConfig();

						let tName = (await threadsData.get(String(threadID)))?.threadName || "Groupe de discussion";
						const gif = await generateWhitelistGIF(senderID, "Groupe Autorisé", "Passerelle réseau locale configurée", `Canal : ${tName}`, `ID : ${threadID}`, "#00ffcc", "NET ADD");
						return sendAnimated(gif, `${chatDeco}\n✅ **GROUPE WHITELISTÉ AVEC SUCCÈS**\n${chatDeco}`);
					}

					case "remove":
					case "-r": {
						const index = config.whiteListModeThread.whiteListThreadIds.map(String).indexOf(String(threadID));
						if (index === -1) {
							const gif = await generateWhitelistGIF(senderID, "Canal Introuvable", "Processus de retrait annulé", "Ce groupe n'existe pas dans la base", `ID : ${threadID}`, "#ff3366", "ERROR");
							return sendAnimated(gif, `⚠️ **Erreur : Ce groupe ne figure pas sur l'infrastructure.**`);
						}
						config.whiteListModeThread.whiteListThreadIds.splice(index, 1);
						saveConfig();

						const gif = await generateWhitelistGIF(senderID, "Groupe Révoqué", "Interruption de liaison locale", `Canal ID : ${threadID}`, "Accès révoqué", "#ff3366", "NET RM");
						return sendAnimated(gif, `${chatDeco}\n❌ **LIAISON DU GROUPE RÉVOQUÉE**\n${chatDeco}`);
					}

					case "on": {
						config.whiteListModeThread.enable = true; saveConfig();
						const gif = await generateWhitelistGIF(senderID, "Whitelist Groupes ON", "Le bot ignore les serveurs non-listés", "Statut : LOCK RESEAU", "Isolement local opérationnel", "#ffcc00", "NET LOCK");
						return sendAnimated(gif, `🛡️ **ISOLATION DES GROUPES APPLIQUÉE**`);
					}
					case "off": {
						config.whiteListModeThread.enable = false; saveConfig();
						const gif = await generateWhitelistGIF(senderID, "Whitelist Groupes OFF", "Accès inter-groupes restauré", "Statut : OUVERTURE GENERALE", "Le bot répond sur tous les serveurs", "#00ffcc", "NET OPEN");
						return sendAnimated(gif, `🔓 **PASSAGE INTER-GROUPES LIBÉRÉ**`);
					}
					default: {
						const gif = await generateWhitelistGIF(senderID, "Action Inconnue", "Sous-commande thread invalide", "Options valides : add, remove, on, off", "Vérifiez vos paramètres", "#ff3366", "ERROR");
						return sendAnimated(gif, `❌ **Erreur : Commande incorrecte.**`);
					}
				}
			}

			case "status": {
				const uState = config.whiteListMode.enable ? "ACTIF (STRICT)" : "COUPÉ (PUBLIC)";
				const tState = config.whiteListModeThread.enable ? "ACTIF (STRICT)" : "COUPÉ (PUBLIC)";
				const uCount = config.whiteListMode.whiteListIds.length;
				const tCount = config.whiteListModeThread.whiteListThreadIds.length;

				const gif = await generateWhitelistGIF(
					senderID,
					"Monitor Whitelists", 
					"Vue d'ensemble des protocoles système", 
					`👤 Mode Users : ${uState} | Total : ${uCount}`, 
					`💬 Mode Threads : ${tState} | Total : ${tCount}`, 
					"#3a86ff", 
					"MONITOR"
				);

				return sendAnimated(gif, `${chatDeco}\n📊 **RAPPORT SÉCURITÉ GENERÉ**\n${chatDeco}`);
			}

			default: {
				const gif = await generateWhitelistGIF(senderID, "Option Invalide", "Paramètre introuvable", "Essaye : user, thread ou status", "Vérifiez la saisie", "#ff3366", "ERROR");
				return sendAnimated(gif, `⚠️ **Option invalide.**`);
			}
		}
	}
};
