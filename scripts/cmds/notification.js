const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

// ==========================================
// 🎨 ENGIN CANVAS POUR LA NOTIFICATION INTER-GROUPES
// ==========================================
async function generateNotifyCanvas(adminId, adminName, groupName, memberCount, messageContent, timeStr, dateStr) {
	const canvas = createCanvas(950, 520);
	const ctx = canvas.getContext('2d');

	// Fond dégradé style République / Impérial Sombre
	let gradient = ctx.createLinearGradient(0, 0, 950, 520);
	gradient.addColorStop(0, '#060a14');
	gradient.addColorStop(0.5, '#101626');
	gradient.addColorStop(1, '#060a14');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Cadres doubles gravés Or Royal
	ctx.strokeStyle = '#ffb703';
	ctx.lineWidth = 4;
	ctx.strokeRect(25, 25, 900, 470);
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 1;
	ctx.strokeRect(32, 32, 886, 456);

	// Séparateurs de style
	ctx.fillStyle = '#ffb703';
	ctx.font = 'bold 16px "Sans-Serif"';
	ctx.fillText("✧ ▬▭▬ ▬▬ ✦ ▬▬ ▬▭▬ ✧", 440, 65);
	ctx.fillText("✧ ▬▭▬ ▬▬ ✦ ▬▬ ▬▭▬ ✧", 440, 465);

	// Récupération de l'avatar de l'administrateur (Le Responsable)
	const avatarUrl = `https://graph.facebook.com/${adminId}/picture?width=300&height=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		const adminAvatar = await loadImage(avatarUrl);
		ctx.save();
		ctx.beginPath();
		ctx.arc(190, 260, 110, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(adminAvatar, 80, 150, 220, 220);
		ctx.restore();

		// Anneau de sécurité néon Or
		ctx.strokeStyle = '#ffb703';
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.arc(190, 260, 112, 0, Math.PI * 2);
		ctx.stroke();
	} catch (e) {
		ctx.fillStyle = '#ffb703';
		ctx.beginPath(); ctx.arc(190, 260, 110, 0, Math.PI * 2); ctx.fill();
	}

	// Écriture des Titres et Métadonnées du Groupe
	ctx.fillStyle = '#ffb703';
	ctx.font = 'bold 34px "Sans-Serif"';
	ctx.fillText("👑 COMMUNIQUÉ OFFICIEL", 440, 120);

	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 22px "Sans-Serif"';
	let cleanGroup = groupName.length > 25 ? groupName.substring(0, 25) + "..." : groupName;
	ctx.fillText(`🏰 Groupe : ${cleanGroup}`, 440, 175);

	ctx.fillStyle = '#aaaaaa';
	ctx.font = '18px "Sans-Serif"';
	ctx.fillText(`👥 Membres : ${memberCount} actifs | 🕒 ${timeStr} - ${dateStr}`, 440, 215);

	// Zone d'affichage du Message avec retour à la ligne automatique
	ctx.fillStyle = '#ffffff';
	ctx.font = 'italic 20px "Sans-Serif"';
	
	const words = messageContent.split(' ');
	let line = '📝 ';
	let y = 265;
	const maxWidth = 450;
	const lineHeight = 28;

	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + ' ';
		let metrics = ctx.measureText(testLine);
		if (metrics.width > maxWidth && n > 0) {
			if (y > 380) {
				ctx.fillText(line.trim() + "...", 440, y);
				line = '';
				break;
			}
			ctx.fillText(line, 440, y);
			line = words[n] + ' ';
			y += lineHeight;
		} else {
			line = testLine;
		}
	}
	if (line) ctx.fillText(line, 440, y);

	// Signature de bas de page
	ctx.fillStyle = '#ffb703';
	ctx.font = 'bold 15px "Sans-Serif"';
	ctx.fillText(`👤 Responsable : ${adminName}`, 440, 420);

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const imagePath = path.join(tmpDir, `notify_${Date.now()}_${adminId}.png`);
	fs.writeFileSync(imagePath, canvas.toBuffer('image/png'));
	return imagePath;
}

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "3.0",
		author: "Royal System x Célestin 🔥 (Canvas Edition)",
		countDown: 5,
		role: 2,
		description: "Envoie un communiqué officiel illustré à tous les groupes",
		category: "owner",
		guide: {
			en: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 300 // Légèrement augmenté pour laisser le temps de générer l'image
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, usersData }) {
		const { delayPerGroup } = envCommands[commandName];

		if (!args[0])
			return message.reply("⚠️ Veuillez écrire un message pour lancer l'annonce globale.");

		const now = new Date();
		const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
		const dateStr = now.toLocaleDateString("fr-FR");

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup);
		const adminId = api.getCurrentUserID();
		const adminName = await usersData.getName(adminId);
		const messageContent = args.join(" ");

		message.reply(`📡 Initialisation de la matrice... Envoi du communiqué visuel à ${allThreadID.length} groupes.`);

		let success = 0;

		for (const thread of allThreadID) {
			try {
				const info = await api.getThreadInfo(thread.threadID);
				const groupName = info.threadName || "Groupe sans nom";
				const memberCount = info.participantIDs.length;

				// Génération de l'image unique personnalisée pour le groupe courant
				const imagePath = await generateNotifyCanvas(
					adminId,
					adminName,
					groupName,
					memberCount,
					messageContent,
					timeStr,
					dateStr
				);

				const formSend = {
					body: `‎🇫🇷━━━━━━━━━━━━━━━━━━━━\n👑 𝘾𝙊𝙈𝙈𝙐𝙉𝙄𝙌𝙐𝙀́ 𝙊𝙁𝙁𝙄𝘾𝙄𝙀𝙇\n━━━━━━━━━━━━━━━━━━━━\n\n🏰 𝙂𝙧𝙤𝙪𝙥𝙚 : ${groupName}\n📢 Un message important vient d'être gravé dans vos archives.\n\n👤 Responsable : @${adminName}`,
					mentions: [{ tag: adminName, id: adminId }],
					attachment: fs.createReadStream(imagePath)
				};

				await api.sendMessage(formSend, thread.threadID, () => {
					if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
				});

				success++;
				await new Promise(r => setTimeout(r, delayPerGroup));
			} catch (e) {
				console.log("Erreur envoi groupe:", thread.threadID, e.message);
			}
		}

		return message.reply(
			`👑 COMMUNIQUÉ TERMINÉ\n\n✅ Transmis avec succès à ${success}/${allThreadID.length} salons.\n⚡ Système d'affichage visuel stable.`
		);
	}
};
