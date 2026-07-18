const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

if (!global.spaceAdventures) {
    global.spaceAdventures = {};
}
if (!global.narutoState) {
    global.narutoState = {};
}
if (!global.tournamentState) {
    global.tournamentState = {};
}

const shipShop = [
    { id: "1", name: "Interceptor-V2", price: 5000, powerBonus: 15 },
    { id: "2", name: "Vanguard-Elite", price: 12000, powerBonus: 35 },
    { id: "3", name: "Star-Destroyer", price: 30000, powerBonus: 80 }
];

const villainsList = [
    { name: "Enfant Calmé", power: 25, effect: "🔇 Aura de silence" },
    { name: "Camille", power: 50, effect: "⚡ Surchauffe" },
    { name: "Célestin", power: 75, effect: "🧩 Brouillage" },
    { name: "Delfa", power: 100, effect: "🔮 Miroir cosmique" }
];

const ninjaCharacters = [
    { name: "Célestin the King 👑", basic: "pouvoir de Mark Zuckerberg", ultimate: "attaque +coup Géant 🌪️" },
    { name: "Naruto (Baryon Mode)", basic: "Punch Ultra Rapide ⚡", ultimate: "Explosion Chakra Nucléaire ☢️" },
    { name: "Sasuke (Rinnegan)", basic: "Amaterasu 🔥", ultimate: "Indra's Arrow ⚡🏹" },
    { name: "Kakashi (DMS)", basic: "Kamui Raikiri ⚡🌀", ultimate: "Susano'o Parfait 💠" }
];

function makeProgressBar(value, max) {
    const size = 10;
    const filledCount = Math.round((Math.max(0, value) / max) * size);
    return "❤️".repeat(filledCount) + "🖤".repeat(size - filledCount);
}

module.exports = {
    config: {
        name: "aventure",
        aliases: ["start", "espace", "exploration", "avengers", "storm", "rangs", "tournoi"],
        version: "11.0",
        author: "Gemini",
        countDown: 2,
        role: 0,
        shortDescription: {
            fr: "🚀 Aventure spatiale, PVP Storm et Mode Tournoi à 4 joueurs automatisé."
        },
        category: "jeux",
        guide: {
            fr: "Commandes : start etape, start storm, start rangs, start tournoi, start rejoindre"
        }
    },

    onStart: async function({ api, event, message, args, usersData }) {
        return this.onChat({ api, event, message, args, usersData });
    },

    onChat: async function({ api, event, message, args, usersData }) {  
        if (!event.body) return;  

        const msg = event.body.trim().toLowerCase();  
        const { threadID, senderID } = event;  
        const words = msg.split(" ");  
        const subCommand = words[1] ? words[1].toLowerCase() : "";  
        const subArg = words[2] ? words[2].toLowerCase() : "";

        // --- 🏆 SUIVI ET GESTION DU MODE TOURNOI ---
        const tourney = global.tournamentState[threadID];
        
        // Interception des combats spécifiques aux matchs du tournoi en cours
        if (global.narutoState[threadID]) {
            const state = global.narutoState[threadID];

            if (msg === 'fin' && !state.isTournamentMatch) {
                delete global.narutoState[threadID];
                return message.reply("🔄 Combat annulé.");
            }

            if (state.step === "choose_characters_p1" || state.step === "choose_characters_p2" || state.step === "battle") {
                const index = parseInt(msg) - 1;

                if (state.step === "choose_characters_p1" && senderID === state.players.p1) {
                    if (isNaN(index) || index < 0 || index >= ninjaCharacters.length) return message.reply("❌ Choix invalide.");
                    state.p1Char = ninjaCharacters[index];
                    state.step = "choose_characters_p2";
                    const p2Name = await usersData.getName(state.players.p2);
                    return message.reply(`✨ J1 prêt.\n👉 @${p2Name}, choisissez votre numéro de Shinobi !`);
                }

                if (state.step === "choose_characters_p2" && senderID === state.players.p2) {
                    if (isNaN(index) || index < 0 || index >= ninjaCharacters.length) return message.reply("❌ Choix invalide.");
                    state.p2Char = ninjaCharacters[index];
                    state.turn = "p1";
                    state.step = "battle";
                    const p1Name = await usersData.getName(state.players.p1);
                    return message.reply(`⚔️ **MATCH EN COURS** ⚔️\n\n🔥 **${state.p1Char.name}** VS **${state.p2Char.name}**\n\n👉 @${p1Name}, attaquez ! (a, b, d)`);
                }

                if (state.step === "battle") {
                    const currentTurnID = state.turn === "p1" ? state.players.p1 : state.players.p2;
                    if (senderID !== currentTurnID) return;

                    const attacker = state.turn === "p1" ? state.p1Char : state.p2Char;
                    const hpKey = state.turn === "p1" ? "p2HP" : "p1HP";
                    let damage = 0;

                    if (msg === 'a') damage = Math.floor(Math.random() * 12) + 8;
                    else if (msg === 'b') damage = Math.floor(Math.random() * 20) + 15;
                    else if (msg === 'd') {
                        state.defending = state.turn;
                        state.turn = state.turn === "p1" ? "p2" : "p1";
                        return message.reply(`🛡️ En garde.`);
                    } else return;

                    if (state.defending && state.defending !== state.turn) {
                        damage = Math.floor(damage * 0.5);
                        state.defending = false;
                    }

                    state[hpKey] = Math.max(0, state[hpKey] - damage);
                    let log = `💥 Dégâts : -${damage}% HP.\n`;
                    const p1Name = await usersData.getName(state.players.p1);
                    const p2Name = await usersData.getName(state.players.p2);
                    log += `👤 ${p1Name} : ${state.p1HP}% │ 👤 ${p2Name} : ${state.p2HP}%\n\n`;

                    if (state.p1HP <= 0 || state.p2HP <= 0) {
                        const winnerID = state.p1HP <= 0 ? state.players.p2 : state.players.p1;
                        const winnerName = state.p1HP <= 0 ? p2Name : p1Name;

                        message.reply(`${log}🏆 **${winnerName}** remporte la manche !`);
                        delete global.narutoState[threadID];

                        // Logique de progression du tournoi
                        if (state.isTournamentMatch && tourney) {
                            if (tourney.phase === "demi1") {
                                tourney.finalistes.push(winnerID);
                                tourney.phase = "demi2";
                                return p1_vs_p2_tournoi(api, message, usersData, threadID, tourney.participants[2], tourney.participants[3], "DEUXIÈME DEMI-FINALE");
                            } else if (tourney.phase === "demi2") {
                                tourney.finalistes.push(winnerID);
                                tourney.phase = "finale";
                                return p1_vs_p2_tournoi(api, message, usersData, threadID, tourney.finalistes[0], tourney.finalistes[1], "🏆 GRANDE FINALE 🏆");
                            } else if (tourney.phase === "finale") {
                                const wData = await usersData.get(winnerID);
                                await usersData.set(winnerID, { money: (wData.money || 0) + tourney.cashprize });
                                delete global.tournamentState[threadID];
                                return message.reply(`🎉 **FIN DU TOURNOI** 🎉\n\nLe grand champion suprême est **${winnerName}** !\n💰 Il empoche le Cashprize réel de **${tourney.cashprize} $** !`);
                            }
                        }
                        return;
                    }

                    state.turn = state.turn === "p1" ? "p2" : "p1";
                    const nextName = await usersData.getName(state.turn === "p1" ? state.players.p1 : state.players.p2);
                    return message.reply(`${log}👉 À ton tour, @${nextName} !`);
                }
            }
        }

        // --- ENTRÉE DES COMMANDES PRINCIPALES ---
        if (msg.startsWith("start") || msg.startsWith("avengers") || msg.startsWith("storm") || msg.startsWith("rangs") || msg.startsWith("tournoi")) {
            const senderName = await usersData.getName(senderID);

            if (!global.spaceAdventures[senderID]) {
                global.spaceAdventures[senderID] = {
                    id: senderID, name: senderName, xp: 0, rank: "Cadet", vessel: "Dreadnought-Alpha", powerBonus: 0, stage: 1, lastDaily: 0
                };
            }

            const player = global.spaceAdventures[senderID];
            const userData = await usersData.get(senderID);
            let currentMoney = userData.money || 0;

            // 📢 ACTION : INITIALISER UN TOURNOI (4 Joueurs)
            if (subCommand === "tournoi") {
                if (tourney) return message.reply("❌ Un tournoi est déjà en cours ou en phase d'inscription dans ce groupe.");
                
                global.tournamentState[threadID] = {
                    phase: "inscriptions",
                    participants: [senderID],
                    finalistes: [],
                    cashprize: 10000
                };

                return message.reply(`🏆 **OUVERTURE D'UN TOURNOI SHINOBI** 🏆\n\nL'organisateur s'est inscrit.\n💰 **Cashprize à gagner : 10 000 $** (Argent réel)\n👥 Places disponibles : 3\n\n👉 Envoyez **'start rejoindre'** pour participer !`);
            }

            // 📝 ACTION : REJOINDRE LE TOURNOI DÉJÀ INITIÉ
            if (subCommand === "rejoindre") {
                if (!tourney || tourney.phase !== "inscriptions") return message.reply("❌ Aucun tournoi ne prend d'inscriptions actuellement.");
                if (tourney.participants.includes(senderID)) return message.reply("❌ Vous êtes déjà inscrit.");

                tourney.participants.push(senderID);
                let structure = `📝 **Inscription validée (${tourney.participants.length}/4)**\nJoueurs inscrits :\n`;
                for (let uid of tourney.participants) {
                    structure += `- ${await usersData.getName(uid)}\n`;
                }

                if (tourney.participants.length === 4) {
                    tourney.phase = "demi1";
                    structure += `\n🔥 **Le tournoi est complet ! Génération de l'arbre...**\n`;
                    await message.reply(structure);
                    
                    // Lancement automatique du premier match (Demi-finale 1)
                    return p1_vs_p2_tournoi(api, message, usersData, threadID, tourney.participants[0], tourney.participants[1], "PREMIÈRE DEMI-FINALE");
                } else {
                    return message.reply(structure);
                }
            }

            // --- PVP CASUAL STORM (MATCH STANDARD) ---
            if (subCommand === "storm" || msg.startsWith("storm")) {
                if (currentMoney < 1000) return message.reply("❌ Solde insuffisant (1000 $ requis).");
                global.narutoState[threadID] = { step: "choose_p1", players: { p1: senderID }, p1HP: 100, p2HP: 100, turn: null, defending: false, isTournamentMatch: false };
                return message.reply("╔══════ 🪐  𝗡𝗔𝗥𝗨𝗧𝗢 𝗦𝗧𝗢𝗥𝗠  🪐 ══════╗\n\n Envoyer **p1** pour accepter le défi !");
            }

            // --- MODE AVENTURE COMBAT SOLO ---
            if (subCommand === "etape" || subCommand === "étape" || subCommand === "combat") {  
                const boss = villainsList[(player.stage - 1) % villainsList.length];
                const finalBossPower = boss.power * (Math.floor((player.stage - 1) / villainsList.length) + 1);
                const stageLoot = player.stage * 2000;

                const playerPower = 40 + (player.xp * 0.1) + (player.powerBonus || 0);  
                const isSuccess = Math.random() < (playerPower / (playerPower + finalBossPower));  

                if (isSuccess) {  
                    currentMoney += stageLoot;
                    await usersData.set(senderID, { money: currentMoney });
                    player.stage += 1; 
                    return message.reply(`✨ **Victoire !**\n💰 +${stageLoot} $ réels ajoutés.`);
                } else {  
                    const loss = Math.floor(currentMoney * 0.05);  
                    currentMoney = Math.max(0, currentMoney - loss);
                    await usersData.set(senderID, { money: currentMoney });
                    return message.reply(`🚨 **Échec.** │ Réparations : -${loss} $ réels.`);
                }  
            }  

            // --- RÉCOMPENSE DAILY ---
            if (subCommand === "daily" || subCommand === "jour") {
                if (Date.now() - player.lastDaily < 24 * 60 * 60 * 1000) return message.reply("⏳ Déjà récupéré.");
                currentMoney += 1500;
                await usersData.set(senderID, { money: currentMoney });
                player.lastDaily = Date.now();
                return message.reply("🎁 **Daily** │ +1500 $ synchronisés.");
            }

            // --- BOUTIQUE ET ARSENAL ---
            if (subCommand === "boutique" || subCommand === "shop") {
                let shopMsg = `🛒 **BOUTIQUE** │ Solde : ${currentMoney} $\n\n`;
                shipShop.forEach(s => shopMsg += `🆔 [ ${s.id} ] ${s.name} │ Prix : ${s.price} $\n`);
                return message.reply(shopMsg + `\nAcheter avec : start acheter [ID]`);
            }

            if (subCommand === "acheter" || subCommand === "buy") {
                const ship = shipShop.find(s => s.id === subArg);
                if (!ship) return message.reply("❌ ID invalide.");
                if (currentMoney < ship.price) return message.reply("❌ Solde insuffisant.");

                currentMoney -= ship.price;
                await usersData.set(senderID, { money: currentMoney });
                player.vessel = ship.name;
                player.powerBonus = ship.powerBonus;
                return message.reply(`🛸 Appareil équipé : **${ship.name}**.`);
            }

            // --- CLASSEMENT TOP 3 CANVAS ---
            if (subCommand === "rangs" || subCommand === "classement" || subCommand === "top") {
                try {
                    const canvas = createCanvas(600, 450);
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#09090e"; ctx.fillRect(0, 0, 600, 450);
                    ctx.strokeStyle = "#ffb700"; ctx.lineWidth = 4; ctx.strokeRect(5, 5, 590, 440);

                    ctx.fillStyle = "#ffb700"; ctx.font = "bold 28px sans-serif"; ctx.textAlign = "center";
                    ctx.fillText("CLASSEMENT DES COMMANDANTS", 300, 45);

                    const sortedPlayers = Object.values(global.spaceAdventures).sort((a, b) => b.stage - a.stage).slice(0, 3);

                    for (let i = 0; i < sortedPlayers.length; i++) {
                        const p = sortedPlayers[i];
                        const yPos = 110 + (i * 110);

                        ctx.fillStyle = "#131324"; ctx.beginPath(); ctx.roundRect(30, yPos, 540, 90, 15); ctx.fill();
                        ctx.textAlign = "left"; ctx.font = "bold 24px sans-serif";
                        ctx.fillStyle = i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#cd7f32";
                        ctx.fillText(`#${i + 1}`, 50, yPos + 53);

                        const pfpUrl = `https://graph.facebook.com/${p.id}/picture?height=150&width=150&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                        try {
                            const imgProfile = await loadImage(pfpUrl);
                            ctx.save(); ctx.beginPath(); ctx.roundRect(110, yPos + 15, 60, 60, 12); ctx.clip();
                            ctx.drawImage(imgProfile, 110, yPos + 15, 60, 60); ctx.restore();
                        } catch(e) {
                            ctx.fillStyle = "#2a2a40"; ctx.beginPath(); ctx.roundRect(110, yPos + 15, 60, 60, 12); ctx.fill();
                        }

                        ctx.fillStyle = "#ffffff"; ctx.font = "bold 20px sans-serif"; ctx.fillText(p.name.substring(0, 14), 190, yPos + 42);
                        ctx.fillStyle = "#00f0ff"; ctx.font = "15px sans-serif"; ctx.fillText(`Étape actuelle : ${p.stage} │ Vaisseau : ${p.vessel}`, 190, yPos + 68);
                    }

                    const cacheDir = path.join(__dirname, "cache");
                    await fs.ensureDir(cacheDir);
                    const pathImg = path.join(cacheDir, `top_${threadID}.png`);
                    await fs.writeFile(pathImg, canvas.toBuffer('image/png'));

                    await message.reply({ body: "🏆 Podium global :", attachment: fs.createReadStream(pathImg) });
                    return fs.unlinkSync(pathImg);
                } catch (err) {
                    return message.reply("❌ Erreur classement.");
                }
            }

            // --- AFFICHAGE INTERFACE GENERALE PAR DEFAUT ---
            try {  
                const canvas = createCanvas(650, 250);  
                const ctx = canvas.getContext('2d');  
                ctx.fillStyle = "#0c0c16"; ctx.fillRect(0, 0, 650, 250);  
                
                const borderGrad = ctx.createLinearGradient(0, 0, 650, 0);  
                borderGrad.addColorStop(0, "#00f0ff"); borderGrad.addColorStop(1, "#7000ff");  
                ctx.strokeStyle = borderGrad; ctx.lineWidth = 6; ctx.strokeRect(3, 3, 644, 244);  

                try {  
                    const avatarUrl = `https://graph.facebook.com/${senderID}/picture?height=300&width=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;  
                    const imgAvatar = await loadImage(avatarUrl);  
                    ctx.save(); ctx.beginPath(); ctx.roundRect(40, 45, 160, 160, 20); ctx.clip();  
                    ctx.drawImage(imgAvatar, 40, 45, 160, 160); ctx.restore();  
                } catch (e) {  
                    ctx.fillStyle = "#1b1b32"; ctx.beginPath(); ctx.roundRect(40, 45, 160, 160, 20); ctx.fill();  
                }  

                ctx.textAlign = "left"; ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px sans-serif";  
                ctx.fillText(player.name.toUpperCase(), 230, 70);  
                ctx.fillStyle = "#00f0ff"; ctx.font = "bold 15px sans-serif"; ctx.fillText(`RANK : ${player.rank.toUpperCase()}`, 230, 100);  
                ctx.fillStyle = "#e2e2e9"; ctx.font = "16px sans-serif";  
                ctx.fillText(`📍 Niveau : Étape ${player.stage}`, 230, 135);  
                ctx.fillText(`🛸 Vaisseau : ${player.vessel}`, 230, 165);  
                ctx.textAlign = "right"; ctx.fillStyle = "#00ff66"; ctx.font = "bold 18px sans-serif"; ctx.fillText(`${currentMoney} $`, 610, 70);  

                const cacheDir = path.join(__dirname, "cache");  
                await fs.ensureDir(cacheDir);  
                const pathImg = path.join(cacheDir, `space_${senderID}.png`);  
                await fs.writeFile(pathImg, canvas.toBuffer('image/png'));  

                let info = `🛸 **CONTRÔLE DISPONIBLE**\n\n • 'start etape' 👉 Mode Solo\n • 'start storm' 👉 Combat Casual PVP\n • 'start tournoi' 👉 Lancer un tournoi (4 Joueurs)\n • 'start rangs' 👉 Voir le classement`;
                await message.reply({ body: info, attachment: fs.createReadStream(pathImg) });  
                fs.unlinkSync(pathImg);  
            } catch (err) {  
                return message.reply("❌ Erreur de profil.");  
            }  
        }  
    }  
};

// Fonction utilitaire interne pour instancier des combats de tournoi
async function p1_vs_p2_tournoi(api, message, usersData, threadID, p1, p2, matchTitle) {
    global.narutoState[threadID] = {
        step: "choose_characters_p1",
        players: { p1: p1, p2: p2 },
        p1HP: 100,
        p2HP: 100,
        turn: "p1",
        defending: false,
        isTournamentMatch: true
    };

    const name1 = await usersData.getName(p1);
    const name2 = await usersData.getName(p2);

    let list = `⚡ **${matchTitle}** ⚡\n Confrontation directe : @${name1} VS @${name2}\n\n🎭  𝗦𝗛𝗜𝗡𝗢𝗕𝗜𝗦  𝗗𝗜𝗦𝗣𝗢𝗡𝗜𝗕𝗟𝗘𝗦  \n\n`;
    ninjaCharacters.forEach((c, i) => list += `[ ${i + 1} ] ${c.name}\n`);
    
    return message.reply(`${list}\n👉 @${name1}, entrez le numéro de votre combattant !`);
}
