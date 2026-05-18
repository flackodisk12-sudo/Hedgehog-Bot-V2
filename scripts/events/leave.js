const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.9",
		author: "NTKhang x Célestin 🔥",
		category: "events"
	},

	langs: {
		fr: {
			session1: "matin",
			session2: "midi",
			session3: "après-midi",
			session4: "soir",
			leaveType1: "a quitté",
			leaveType2: "a été expulsé",
			defaultLeaveMessage: "{userName} a quitté le groupe"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage) return;

				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID()) return;

				const userName = await usersData.getName(leftParticipantFbId);

				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

				const form = {
					mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : null
				};

				const isKicked = event.author && event.author != leftParticipantFbId;

				const hour = new Date().getHours();
				let timeText = "🌙 𝑵𝒖𝒊𝒕 𝒔𝒐𝒎𝒃𝒓𝒆...";
				if (hour >= 5 && hour < 12) timeText = "🌅 𝑴𝒂𝒕𝒊𝒏 𝒄𝒂𝒍𝒎𝒆...";
				else if (hour >= 12 && hour < 17) timeText = "☀️ 𝑷𝒍𝒆𝒊𝒏 𝒋𝒐𝒖𝒓...";
				else if (hour >= 17 && hour < 22) timeText = "🌆 𝑺𝒐𝒊𝒓𝒆́𝒆 𝒂𝒄𝒕𝒊𝒗𝒆...";

				// 🎯 QUITTÉ
				const leaveMsgs = [
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

${timeText}

💨 𝑳𝒆 𝒎𝒆𝒎𝒃𝒓𝒆 ${userName} 𝒂 𝒒𝒖𝒊𝒕𝒕𝒆́...
💅 𝑳𝒆 𝒔𝒕𝒚𝒍𝒆 𝒓𝒆𝒔𝒕𝒆.

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

${timeText}

👀 ${userName} 𝒆𝒔𝒕 𝒑𝒂𝒓𝒕𝒊.
🔥 𝑹𝒊𝒆𝒏 𝒏𝒆 𝒄𝒉𝒂𝒏𝒈𝒆.

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

${timeText}

🫠 ${userName} 𝒂 𝒅𝒊𝒔𝒑𝒂𝒓𝒖...
👑 𝑳’𝒆́𝒍𝒊𝒕𝒆 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆.

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`
				];

				// 💀 EXPULSÉ
				const kickMsgs = [
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

${timeText}

💀 ${userName} 𝒂 𝒆́𝒕𝒆́ 𝒆𝒙𝒑𝒖𝒍𝒔𝒆́.
⚠️ 𝑵𝒊𝒗𝒆𝒂𝒖 𝒊𝒏𝒔𝒖𝒇𝒇𝒊𝒔𝒂𝒏𝒕.

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

${timeText}

🚫 ${userName} 𝒂 𝒆́𝒕𝒆́ 𝒔𝒖𝒑𝒑𝒓𝒊𝒎𝒆́.
👑 𝑺𝒆́𝒍𝒆𝒄𝒕𝒊𝒐𝒏 𝒏𝒂𝒕𝒖𝒓𝒆𝒍𝒍𝒆.

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,

`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

${timeText}

⚡ ${userName} 𝒂 𝒆́𝒕𝒆́ 𝒆́𝒋𝒆𝒄𝒕𝒆́.
🔥 𝑳𝒆 𝒈𝒓𝒐𝒖𝒑𝒆 𝒓𝒆𝒔𝒑𝒊𝒓𝒆 𝒎𝒊𝒆𝒖𝒙.

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`
				];

				const messages = isKicked ? kickMsgs : leaveMsgs;
				form.body = messages[Math.floor(Math.random() * messages.length)];

				if (leaveMessage.includes("{userNameTag}")) {
					form.mentions = [{
						id: leftParticipantFbId,
						tag: userName
					}];
				}

				if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}

				message.send(form);
			};
	}
};
