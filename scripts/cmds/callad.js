const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "callad",
		version: "1.8",
		author: "NTKhang x Célestin 🔥",
		countDown: 5,
		role: 0,
		category: "contacts admin"
	},

	langs: {
		en: {
			missingMessage:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
⚜️ 𝑴𝑬𝑺𝑺𝑨𝑮𝑬 𝑴𝑨𝑵𝑸𝑼𝑨𝑵𝑻

💬 𝑬́𝒄𝒓𝒊𝒔 𝒖𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒐𝒖𝒓 𝒍𝒆 𝑹𝑶𝑰 👑
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			sendByGroup:
`\n🏰 𝑮𝒓𝒐𝒖𝒑𝒆 : %1\n🆔 𝑰𝑫 : %2`,

			sendByUser:
`\n👤 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒓𝒊𝒗𝒆́`,

			content:
`\n\n📜 𝑪𝑶𝑵𝑻𝑬𝑵𝑼
═══════════════════
%1
═══════════════════
💬 𝑹𝒆́𝒑𝒐𝒏𝒅𝒔 𝒊𝒄𝒊`,

			success:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✅ 𝑻𝑹𝑨𝑵𝑺𝑴𝑰𝑺𝑺𝑰𝑶𝑵 𝑹𝑬́𝑼𝑺𝑺𝑰𝑬

📡 𝑬𝒏𝒗𝒐𝒚𝒆́ 𝒂̀ %1 𝒂𝒅𝒎𝒊𝒏(𝒔)
%2
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			failed:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
⚠️ 𝑬́𝑪𝑯𝑬𝑪 𝑷𝑨𝑹𝑻𝑰𝑬𝑳

❌ %1 𝒆́𝒄𝒉𝒆𝒄(𝒔)
%2
📌 𝑪𝒐𝒏𝒔𝒐𝒍𝒆
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			reply:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
📩 𝑹𝑬́𝑷𝑶𝑵𝑺𝑬 𝑫𝑼 𝑹𝑶𝑰 👑 %1
═══════════════════
%2
═══════════════════
💬 𝑪𝒐𝒏𝒕𝒊𝒏𝒖𝒆
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			replySuccess:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✅ 𝑬𝑵𝑽𝑶𝒀𝑬́ 𝑨𝑼 𝑹𝑶𝑰 👑
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			feedback:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
📝 𝑴𝑬𝑺𝑺𝑨𝑮𝑬 𝑼𝑻𝑰𝑳𝑰𝑺𝑨𝑻𝑬𝑼𝑹

👤 %1
🆔 %2%3

═══════════════════
%4
═══════════════════
💬 𝑹𝒆́𝒑𝒐𝒏𝒅𝒔
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			replyUserSuccess:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✅ 𝑹𝑬́𝑷𝑶𝑵𝑺𝑬 𝑬𝑵𝑽𝑶𝒀𝑬́𝑬
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

			noAdmin:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
🚫 𝑨𝑼𝑪𝑼𝑵 𝑹𝑶𝑰

⚠️ 𝑨𝒅𝒎𝒊𝒏 𝒊𝒏𝒅𝒆́𝒇𝒊𝒏𝒊
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;

		if (!args[0])
			return message.reply(getLang("missingMessage"));

		if (config.adminBot.length == 0)
			return message.reply(getLang("noAdmin"));

		const { senderID, threadID, isGroup } = event;
		const senderName = await usersData.getName(senderID);

		const msg =
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
📨 𝑨𝑷𝑷𝑬𝑳 𝑨𝑼 𝑹𝑶𝑰 👑
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

👤 ${senderName}
🆔 ${senderID}`
			+ (isGroup
				? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID)
				: getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [];
		const failedIDs = [];

		const adminNames = await Promise.all(config.adminBot.map(async item => ({
			id: item,
			name: await usersData.getName(item)
		})));

		for (const uid of config.adminBot) {
			try {
				const messageSend = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);

				global.GoatBot.onReply.set(messageSend.messageID, {
					commandName,
					messageID: messageSend.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			}
			catch (err) {
				failedIDs.push({ adminID: uid, error: err });
			}
		}

		let msg2 = "";

		if (successIDs.length > 0)
			msg2 += getLang("success", successIDs.length,
				adminNames
					.filter(item => successIDs.includes(item.id))
					.map(item => ` <@${item.id}> (${item.name})`)
					.join("\n")
			);

		if (failedIDs.length > 0) {
			msg2 += getLang("failed", failedIDs.length,
				failedIDs.map(item =>
					` <@${item.adminID}> (${adminNames.find(a => a.id == item.adminID)?.name || item.adminID})`
				).join("\n")
			);
			log.err("CALL ADMIN", failedIDs);
		}

		return message.reply({
			body: msg2,
			mentions: adminNames.map(item => ({
				id: item.id,
				tag: item.name
			}))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const { isGroup } = event;

		switch (type) {

			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", senderName, args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);

					message.reply(getLang("replyUserSuccess"));

					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}

			case "adminReply": {
				let sendByGroup = "";

				if (isGroup) {
					const { threadName } = await api.getThreadInfo(event.threadID);
					sendByGroup = getLang("sendByGroup", threadName, event.threadID);
				}

				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);

					message.reply(getLang("replySuccess"));

					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
		}
	}
};
