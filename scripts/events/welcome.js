const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "welcome",
    version: "2.3",
    author: "Saimx69x + Celestin 😎",
    category: "events"
  },

  onStart: async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData } = event;
    const newUsers = logMessageData.addedParticipants;
    const botID = api.getCurrentUserID();

    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName;
    const memberCount = threadInfo.participantIDs.length;

    // 🤖 SI C’EST LE BOT QUI EST AJOUTÉ → PRÉSENTATION
    if (newUsers.some(u => u.userFbId === botID)) {

      // 🔥 NOM DU BOT DEPUIS CONFIG
      let botName = "BOT";
      if (global.GoatBot && global.GoatBot.config && global.GoatBot.config.nickNameBot) {
        botName = global.GoatBot.config.nickNameBot;
      }

      try {
        await api.changeNickname(`✧ ${botName} ✧`, threadID, botID);
      } catch (e) {
        console.log("Erreur rename bot:", e);
      }

      return api.sendMessage(
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

🤖 𝑩𝑶𝑻 𝑪𝑶𝑵𝑵𝑬𝑪𝑻𝑬́

👋 𝑺𝒂𝒍𝒖𝒕 𝒕𝒐𝒖𝒕 𝒍𝒆 𝒎𝒐𝒏𝒅𝒆 !
𝑱𝒆 𝒗𝒊𝒆𝒏𝒔 𝒅'𝒆̂𝒕𝒓𝒆 𝒂𝒋𝒐𝒖𝒕𝒆́ 😎

✨ 𝑱𝒆 𝒔𝒖𝒊𝒔 𝒗𝒐𝒕𝒓𝒆 𝒂𝒔𝒔𝒊𝒔𝒕𝒂𝒏𝒕 :
📌 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔
🎮 𝑱𝒆𝒖𝒙
🤖 𝑰𝑨
⚙️ 𝑶𝒖𝒕𝒊𝒍𝒔

💡 𝑻𝒂𝒑𝒆 "help"

❤️ 𝑴𝒆𝒓𝒄𝒊 𝒅𝒆 𝒎'𝒂𝒗𝒐𝒊𝒓 𝒂𝒋𝒐𝒖𝒕𝒆́

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,
        threadID
      );
    }

    // 👥 NOUVEAUX MEMBRES
    for (const user of newUsers) {
      const userId = user.userFbId;
      const fullName = user.fullName;

      try {
        const timeStr = new Date().toLocaleString("en-BD", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          weekday: "long", year: "numeric", month: "2-digit", day: "2-digit",
          hour12: true,
        });

        const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/welcome?name=${encodeURIComponent(fullName)}&uid=${userId}&threadname=${encodeURIComponent(groupName)}&members=${memberCount}`;

        const tmp = path.join(__dirname, "..", "cache");
        await fs.ensureDir(tmp);
        const imagePath = path.join(tmp, `welcome_${userId}.png`);

        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, response.data);

        await api.sendMessage({
          body:
`✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧

🎉 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑼𝑬 ${fullName} !

💬 𝑻𝒖 𝒗𝒊𝒆𝒏𝒔 𝒅𝒆 𝒓𝒆𝒋𝒐𝒊𝒏𝒅𝒓𝒆 :
📌 ${groupName}

👥 𝑴𝒆𝒎𝒃𝒓𝒆 𝒏° ${memberCount}

✨ 𝑶𝒏 𝒆𝒔𝒕 𝒄𝒐𝒏𝒕𝒆𝒏𝒕 𝒅𝒆 𝒕’𝒂𝒗𝒐𝒊𝒓 𝒊𝒄𝒊
🤝 𝑨𝒎𝒖𝒔𝒆-𝒕𝒐𝒊 𝒃𝒊𝒆𝒏 !

━━━━━━━━━━━━━━━━
📅 ${timeStr}

✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧
✧ ▬▭▬ ▬▭▬ ✦✧✦ ▬▭▬ ▬▭▬ ✧`,
          attachment: fs.createReadStream(imagePath),
          mentions: [{ tag: fullName, id: userId }]
        }, threadID);

        fs.unlinkSync(imagePath);

      } catch (err) {
        console.error("❌ Error sending welcome message:", err);
      }
    }
  }
};
