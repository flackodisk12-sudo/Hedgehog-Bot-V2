module.exports = {
	// Tu peux personnaliser la langue ici ou directement dans les fichiers de commandes
	onlyadminbox: {
		description: "Activer/désactiver le mode où seuls les admins du groupe peuvent utiliser le bot",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Mode réservé aux admins du groupe activé",
			turnedOff: "Mode réservé aux admins du groupe désactivé",
			syntaxError: "Erreur de syntaxe, utilise seulement {pn} on ou {pn} off"
		}
	},
	adduser: {
		description: "Ajouter un utilisateur à votre groupe de discussion",
		guide: "   {pn} [lien du profil | uid]",
		text: {
			alreadyInGroup: "Déjà dans le groupe",
			successAdd: "- %1 membre(s) ajouté(s) au groupe avec succès",
			failedAdd: "- Échec de l'ajout de %1 membre(s) au groupe",
			approve: "- %1 membre(s) ajouté(s) à la liste d'approbation",
			invalidLink: "Veuillez entrer un lien Facebook valide",
			cannotGetUid: "Impossible d'obtenir le UID de cet utilisateur",
			linkNotExist: "Ce lien de profil n'existe pas",
			cannotAddUser: "Le bot est bloqué ou cet utilisateur empêche les inconnus de l'ajouter aux groupes"
		}
	},
	admin: {
		description: "Ajouter, supprimer ou afficher les rôles d'admin du bot",
		guide: "   {pn} [add | -a] <uid>: Ajouter le rôle d'admin du bot\n\t  {pn} [remove | -r] <uid>: Retirer le rôle d'admin du bot\n\t  {pn} [list | -l]: Lister tous les admins du bot",
		text: {
			added: "✅ | Rôle d'admin attribué à %1 utilisateur(s) :\n%2",
			alreadyAdmin: "\n⚠️ | %1 utilisateur(s) ont déjà le rôle d'admin :\n%2",
			missingIdAdd: "⚠️ | Veuillez entrer l'ID ou taguer l'utilisateur à ajouter comme admin",
			removed: "✅ | Rôle d'admin retiré à %1 utilisateur(s) :\n%2",
			notAdmin: "⚠️ | %1 utilisateur(s) n'ont pas le rôle d'admin :\n%2",
			missingIdRemove: "⚠️ | Veuillez entrer l'ID ou taguer l'utilisateur à retirer des admins",
			listAdmin: "👑 | Liste des admins du bot :\n%1"
		}
	},
	adminonly: {
		description: "Activer/désactiver le mode où seuls les admins du bot peuvent l'utiliser",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Mode réservé aux admins du bot activé",
			turnedOff: "Mode réservé aux admins du bot désactivé",
			syntaxError: "Erreur de syntaxe, utilise seulement {pn} on ou {pn} off"
		}
	},
	all: {
		description: "Mentionner tous les membres du groupe",
		guide: "{pn} [message | vide]"
	},
	anime: {
		description: "Image d'anime aléatoire",
		guide: "{pn} <catégorie>\n   Liste des catégories: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Génération de l'image en cours, veuillez patienter...",
			error: "Une erreur est survenue, veuillez réessayer plus tard"
		}
	},
	antichangeinfobox: {
		description: "Activer/désactiver l'anti-modification des infos du groupe",
		guide: "   {pn} avt [on | off]: anti-changement d'avatar du groupe\n   {pn} name [on | off]: anti-changement de nom du groupe\n   {pn} theme [on | off]: anti-changement de thème du groupe\n   {pn} emoji [on | off]: anti-changement d'emoji du groupe",
		text: {
			antiChangeAvatarOn: "Anti-changement d'avatar activé",
			antiChangeAvatarOff: "Anti-changement d'avatar désactivé",
			missingAvt: "Vous n'avez pas défini d'avatar pour le groupe",
			antiChangeNameOn: "Anti-changement de nom activé",
			antiChangeNameOff: "Anti-changement de nom désactivé",
			antiChangeThemeOn: "Anti-changement de thème activé",
			antiChangeThemeOff: "Anti-changement de thème désactivé",
			antiChangeEmojiOn: "Anti-changement d'emoji activé",
			antiChangeEmojiOff: "Anti-changement d'emoji désactivé",
			antiChangeAvatarAlreadyOn: "L'anti-changement d'avatar est déjà activé pour ce groupe",
			antiChangeNameAlreadyOn: "L'anti-changement de nom est déjà activé pour ce groupe",
			antiChangeThemeAlreadyOn: "L'anti-changement de thème est déjà activé pour ce groupe",
			antiChangeEmojiAlreadyOn: "L'anti-changement d'emoji est déjà activé pour ce groupe"
		}
	},
	appstore: {
		description: "Chercher une application sur l'App Store",
		text: {
			missingKeyword: "Vous n'avez saisi aucun mot-clé",
			noResult: "Aucun résultat trouvé pour le mot-clé %1"
		}
	},
	autosetname: {
		description: "Changer automatiquement le surnom des nouveaux membres",
		guide: "   {pn} set <surnom>: définir le format du surnom automatique, raccourcis disponibles:\n   + {userName}: nom du nouveau membre\n   + {userID}: ID du membre\n   Exemple:\n    {pn} set {userName} 🚀\n\n   {pn} [on | off]: activer/désactiver cette fonctionnalité\n\n   {pn} [view | info]: voir la configuration actuelle",
		text: {
			missingConfig: "Veuillez entrer la configuration requise",
			configSuccess: "La configuration a été enregistrée avec succès",
			currentConfig: "La configuration actuelle de autoSetName dans votre groupe est :\n%1",
			notSetConfig: "Votre groupe n'a pas encore configuré l'autoSetName",
			syntaxError: "Erreur de syntaxe, utilise seulement \"{pn} on\" ou \"{pn} off\"",
			turnOnSuccess: "La fonctionnalité autoSetName a été activée",
			turnOffSuccess: "La fonctionnalité autoSetName a été désactivée",
			error: "Une erreur est survenue avec la fonctionnalité autoSetName, désactivez les liens d'invitation du groupe et réessayez plus tard"
		}
	},
	avatar: {
		description: "Créer un avatar anime avec signature",
		guide: "{p}{n} <id ou nom du personnage> | <texte de fond> | <signature> | <nom de couleur ou code hex>\n{p}{n} help: voir comment utiliser cette commande",
		text: {
			initImage: "Génération de l'image en cours, veuillez patienter...",
			invalidCharacter: "Il n'y a actuellement que %1 personnages enregistrés, entrez un ID inférieur à ce chiffre",
			notFoundCharacter: "Aucun personnage nommé %1 n'a été trouvé",
			errorGetCharacter: "Erreur lors de la récupération des données du personnage :\n%1: %2",
			success: "✅ Votre avatar\nPersonnage: %1\nID: %2\nTexte de fond: %3\nSignature: %4\nCouleur: %5",
			defaultColor: "par défaut",
			error: "Une erreur est survenue\n%1: %2"
		}
	},
	badwords: {
		description: "Gérer l'avertissement de mots interdits. Un membre recevra un avertissement avant d'être exclu du groupe à la seconde infraction.",
		guide: "   {pn} add <mots>: ajouter des mots interdits (séparés par des virgules \",\" ou barres verticales \"|\")\n   {pn} delete <mots>: supprimer des mots interdits (séparés par \",\" ou \"|\")\n   {pn} list <hide | laisser vide>: voir la liste (ajouter \"hide\" pour masquer les mots)\n   {pn} unwarn [<userID> | <@tag>]: retirer 1 avertissement à un membre\n   {pn} on: activer les avertissements\n   {pn} off: désactiver les avertissements",
		text: {
			onText: "activé",
			offText: "désactivé",
			onlyAdmin: "⚠️ | Seuls les admins du groupe peuvent ajouter des mots interdits",
			missingWords: "⚠️ | Vous n'avez pas entré de mots interdits",
			addedSuccess: "✅ | %1 mot(s) interdit(s) ajouté(s) à la liste",
			alreadyExist: "❌ | %1 mot(s) interdit(s) étai(en)t déjà présent(s) : %2",
			tooShort: "⚠️ | %1 mot(s) ignoré(s) car faisant moins de 2 caractères : %2",
			onlyAdmin2: "⚠️ | Seuls les admins peuvent supprimer des mots interdits",
			missingWords2: "⚠️ | Vous n'avez pas entré de mots à supprimer",
			deletedSuccess: "✅ | %1 mot(s) interdit(s) supprimé(s)",
			notExist: "❌ | %1 mot(s) n'étai(en)t pas dans la liste : %2",
			emptyList: "⚠️ | La liste de mots interdits de votre groupe est vide",
			badWordsList: "📑 | Liste des mots interdits dans votre groupe : %1",
			onlyAdmin3: "⚠️ | Seuls les admins peuvent %1 cette fonctionnalité",
			turnedOnOrOff: "✅ | Le système de mots interdits a été %1",
			onlyAdmin4: "⚠️ | Seuls les admins peuvent retirer des avertissements",
			missingTarget: "⚠️ | Vous n'avez pas entré d'ID ou tagué d'utilisateur",
			notWarned: "⚠️ | L'utilisateur %1 n'a aucun avertissement pour mots interdits",
			removedWarn: "✅ | 1 avertissement a été retiré pour l'utilisateur %1 | %2",
			warned: "⚠️ | Mot interdit \"%1\" détecté. Attention, à la prochaine infraction vous serez exclu du groupe.",
			warned2: "⚠️ | Mot interdit \"%1\" détecté. 2ème infraction : vous allez être exclu du groupe.",
			needAdmin: "Le bot doit être administrateur du groupe pour pouvoir exclure les membres.",
			unwarned: "✅ | Avertissement pour mot interdit retiré à %1 | %2"
		}
	},
	balance: {
		description: "Consulter votre solde ou celui d'une personne taguée",
		guide: "   {pn}: voir votre solde\n   {pn} <@tag>: voir le solde du membre tagué",
		text: {
			money: "Vous avez %1$",
			moneyOf: "%1 a %2$"
		}
	},
	batslap: {
		description: "Générer une image de gifle (Batslap)",
		text: {
			noTag: "Vous devez taguer la personne que vous souhaitez gifler"
		}
	},
	busy: {
		description: "Activer le mode Ne Pas Déranger. Le bot préviendra ceux qui vous taguent",
		guide: "   {pn} [vide | <raison>]: activer le mode Ne Pas Déranger\n   {pn} off: désactiver le mode Ne Pas Déranger",
		text: {
			turnedOff: "✅ | Le mode Ne Pas Déranger a été désactivé",
			turnedOn: "✅ | Le mode Ne Pas Déranger a été activé",
			turnedOnWithReason: "✅ | Le mode Ne Pas Déranger a été activé avec la raison : %1",
			alreadyOn: "L'utilisateur %1 est actuellement occupé",
			alreadyOnWithReason: "L'utilisateur %1 est actuellement occupé pour la raison : %2"
		}
	},
	callad: {
		description: "Envoyer un rapport, avis ou bug aux administrateurs du bot",
		guide: "   {pn} <message>",
		text: {
			missingMessage: "Veuillez entrer le message à envoyer aux admins",
			sendByGroup: "\n- Envoyé depuis le groupe : %1\n- Thread ID : %2",
			sendByUser: "\n- Envoyé en message privé",
			content: "\n\nContenu :\n─────────────────\n%1\n─────────────────\nRépondez à ce message pour correspondre avec l'utilisateur",
			success: "Message envoyé aux admins avec succès !",
			reply: "📍 Réponse de l'admin %1 :\n─────────────────\n%2\n─────────────────\nRépondez à ce message pour continuer à échanger",
			replySuccess: "Réponse envoyée à l'admin avec succès !",
			feedback: "📝 Message de l'utilisateur %1 :\n- User ID : %2%3\n\nContenu :\n─────────────────\n%4\n─────────────────\nRépondez à ce message pour lui répondre",
			replyUserSuccess: "Réponse envoyée à l'utilisateur avec succès !"
		}
	},
	cmd: {
		description: "Gérer les fichiers de commandes du bot",
		guide: "{pn} load <nom du fichier>\n{pn} loadAll\n{pn} install <url> <nom du fichier.js>: Télécharger et installer une commande depuis une URL (raw)",
		text: {
			missingFileName: "⚠️ | Veuillez entrer le nom de la commande à recharger",
			loaded: "✅ | Commande \"%1\" rechargée avec succès",
			loadedError: "❌ | Échec du rechargement de la commande \"%1\" :\n%2: %3",
			loadedSuccess: "✅ | Rechargement réussi de la commande \"%1\"",
			loadedFail: "❌ | Échec du rechargement de la commande \"%1\"\n%2",
			missingCommandNameUnload: "⚠️ | Veuillez entrer le nom de la commande à décharger",
			unloaded: "✅ | Commande \"%1\" déchargée avec succès",
			unloadedError: "❌ | Échec du déchargement de la commande \"%1\" :\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Veuillez entrer l'URL/code et le nom du fichier de commande",
			missingUrlOrCode: "⚠️ | Veuillez entrer l'URL ou le code de la commande à installer",
			missingFileNameInstall: "⚠️ | Veuillez entrer le nom du fichier pour sauvegarder la commande (avec l'extension .js)",
			invalidUrlOrCode: "⚠️ | Impossible de récupérer le code de la commande",
			alreadExist: "⚠️ | Ce fichier de commande existe déjà. Souhaitez-vous le remplacer ?\nRéagissez à ce message pour confirmer",
			installed: "✅ | Commande \"%1\" installée avec succès dans %2",
			installedError: "❌ | Échec de l'installation de la commande \"%1\" :\n%2: %3",
			missingFile: "⚠️ | Fichier de commande \"%1\" introuvable",
			invalidFileName: "⚠️ | Nom de fichier invalide",
			unloadedFile: "✅ | Commande \"%1\" déchargée"
		}
	},
	count: {
		description: "Voir le nombre de messages envoyés par membre ou par soi-même (depuis l'arrivée du bot)",
		guide: "   {pn}: voir son propre nombre de messages\n   {pn} @tag: voir le nombre de messages des membres tagués\n   {pn} all: voir le classement complet du groupe",
		text: {
			count: "Nombre de messages des membres :",
			endMessage: "Les personnes absentes de la liste n'ont envoyé aucun message.",
			page: "Page [%1/%2]",
			reply: "Répondez avec le numéro de page pour voir la suite",
			result: "%1 rang %2 avec %3 messages",
			yourResult: "Vous êtes classé(e) %1 avec %2 messages envoyés dans ce groupe",
			invalidPage: "Numéro de page invalide"
		}
	},
	customrankcard: {
		description: "Personnaliser sa carte de niveau (rank card)",
		guide: {
			body: "   {pn} [maincolor | subcolor | linecolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <valeur>"
				+ "\n   Options disponibles : "
				+ "\n  + maincolor | background <valeur>: arrière-plan principal"
				+ "\n  + subcolor <valeur>: arrière-plan secondaire"
				+ "\n  + linecolor <valeur>: couleur de la ligne de séparation"
				+ "\n  + expbarcolor <valeur>: couleur de la barre d'expérience"
				+ "\n  + progresscolor <valeur>: couleur de la progression actuelle"
				+ "\n  + alphasubcolor <valeur>: opacité du fond secondaire (de 0 à 1)"
				+ "\n  + textcolor <valeur>: couleur du texte"
				+ "\n  + namecolor <valeur>: couleur du pseudo"
				+ "\n  + expcolor <valeur>: couleur de l'expérience"
				+ "\n  + rankcolor <valeur>: couleur du rang"
				+ "\n  + levelcolor <valeur>: couleur du niveau"
				+ "\n    • <valeur> peut être un code couleur hex, rgb, rgba, dégradé ou un lien d'image"
				+ "\n    • Pour un dégradé, entrez plusieurs couleurs séparées par des espaces"
				+ "\n   {pn} reset: tout réinitialiser par défaut",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
			}
		},
		text: {
			invalidImage: "Lien d'image invalide (extensions acceptées : jpg, jpeg, png, gif). Vous pouvez héberger votre image sur https://imgbb.com/ pour obtenir un lien direct.",
			invalidAttachment: "Fichier joint invalide, veuillez envoyer une image",
			invalidColor: "Code couleur invalide, utilisez un code Hex (6 chiffres) ou un format RGBA",
			notSupportImage: "Les liens d'images ne sont pas pris en charge pour l'option \"%1\"",
			success: "Modifications enregistrées ! Voici un aperçu :",
			reseted: "Toutes les options ont été réinitialisées par défaut",
			invalidAlpha: "Veuillez entrer un nombre compris entre 0 et 1"
		}
	},
	dhbc: {
		description: "Jeu : Devine l'image / le mot",
		guide: "{pn}",
		text: {
			reply: "Répondez à ce message avec votre réponse :\n%1",
			isSong: "Il s'agit du titre d'une chanson de l'artiste %1",
			notPlayer: "⚠️ Vous n'êtes pas le joueur ayant lancé cette partie",
			correct: "🎉 Félicitations ! Bonne réponse, vous gagnez %1$",
			wrong: "⚠️ Mauvaise réponse, réessayez !"
		}
	},
	emojimix: {
		description: "Fusionner 2 emojis ensemble",
		guide: "   {pn} <emoji1> <emoji2>\n   Exemple: {pn} 🤣 🥰"
	},
	eval: {
		description: "Tester du code rapidement (Admin bot)",
		guide: "{pn} <code à tester>",
		text: {
			error: "❌ Une erreur s'est produite :"
		}
	},
	event: {
		description: "Gérer les fichiers d'événements du bot",
		guide: "{pn} load <nom du fichier>\n{pn} loadAll\n{pn} install <url> <nom du fichier.js>",
		text: {
			missingFileName: "⚠️ | Veuillez entrer le nom de l'événement à recharger",
			loaded: "✅ | Événement \"%1\" rechargé avec succès",
			loadedError: "❌ | Échec du rechargement de l'événement \"%1\" :\n%2: %3",
			loadedSuccess: "✅ | Rechargement réussi de l'événement \"%1\"",
			loadedFail: "❌ | Échec du rechargement de l'événement \"%1\"\n%2",
			missingCommandNameUnload: "⚠️ | Veuillez entrer le nom de l'événement à décharger",
			unloaded: "✅ | Événement \"%1\" déchargé avec succès",
			unloadedError: "❌ | Échec du déchargement de l'événement \"%1\" :\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Veuillez fournir l'URL/code et le nom du fichier",
			missingUrlOrCode: "⚠️ | Veuillez entrer l'URL ou le code de l'événement",
			missingFileNameInstall: "⚠️ | Veuillez indiquer le nom du fichier (avec l'extension .js)",
			invalidUrlOrCode: "⚠️ | Impossible de lire le code de l'événement",
			alreadExist: "⚠️ | Le fichier existe déjà. Souhaitez-vous le remplacer ?\nRéagissez à ce message pour continuer",
			installed: "✅ | Événement \"%1\" installé dans %2",
			installedError: "❌ | Échec de l'installation de l'événement \"%1\" :\n%2: %3",
			missingFile: "⚠️ | Fichier \"%1\" introuvable",
			invalidFileName: "⚠️ | Nom de fichier invalide",
			unloadedFile: "✅ | Événement \"%1\" déchargé"
		}
	},
	filteruser: {
		description: "Filtrer les membres du groupe par nombre de messages ou supprimer les comptes bloqués/désactivés",
		guide: "   {pn} [<nombre de messages> | die]",
		text: {
			needAdmin: "⚠️ | Le bot doit être administrateur du groupe pour exécuter cette commande",
			confirm: "⚠️ | Êtes-vous sûr de vouloir supprimer les membres ayant moins de %1 message(s) ?\nRéagissez à ce message pour confirmer",
			kickByBlock: "✅ | %1 membre(s) ayant un compte bloqué/supprimé ont été retiré(s)",
			kickByMsg: "✅ | %1 membre(s) ayant moins de %2 message(s) ont été retiré(s)",
			kickError: "❌ | Erreur lors de l'expulsion de %1 membre(s) :\n%2",
			noBlock: "✅ | Aucun membre du groupe n'a de compte bloqué",
			noMsg: "✅ | Aucun membre n'a envoyé moins de %1 message(s)"
		}
	},
	getfbstate: {
		description: "Obtenir le fbstate (cookie) actuel du bot",
		guide: "{pn}",
		text: {
			success: "Fbstate envoyé en message privé. Veuillez vérifier votre boîte de réception."
		}
	},
	grouptag: {
		description: "Gérer et mentionner des sous-groupes de membres",
		guide: "   {pn} add <nomDuGroupe> <@tags>: créer un sous-groupe ou y ajouter des membres\n   Exemple:\n    {pn} TEAM1 @tag1 @tag2\n\n   {pn} del <nomDuGroupe> <@tags>: retirer des membres d'un sous-groupe\n   {pn} remove <nomDuGroupe>: supprimer un sous-groupe\n   {pn} rename <ancienNom> | <nouveauNom>: renommer un sous-groupe\n   {pn} [list | all]: voir les sous-groupes existants\n   {pn} info <nomDuGroupe>: détails sur un sous-groupe",
		text: {
			noGroupTagName: "Veuillez indiquer le nom du sous-groupe",
			noMention: "Vous n'avez tagué aucun membre à ajouter",
			addedSuccess: "Membre(s) ajouté(s) :\n%1\nau sous-groupe \"%2\"",
			addedSuccess2: "Sous-groupe \"%1\" créé avec les membres :\n%2",
			existedInGroupTag: "Les membres suivants font déjà partie du sous-groupe \"%2\" :\n%1",
			notExistedInGroupTag: "Les membres suivants ne font pas partie du sous-groupe \"%2\" :\n%1",
			noExistedGroupTag: "Le sous-groupe \"%1\" n'existe pas dans votre discussion",
			noExistedGroupTag2: "Aucun sous-groupe n'a encore été créé dans cette discussion",
			noMentionDel: "Veuillez taguer les membres à retirer du sous-groupe \"%1\"",
			deletedSuccess: "Membre(s) retiré(s) :\n%1\ndu sous-groupe \"%2\"",
			deletedSuccess2: "Sous-groupe \"%1\" supprimé",
			tagged: "Mention du groupe \"%1\" :\n%2",
			noGroupTagName2: "Indiquez l'ancien nom et le nouveau nom séparés par \"|\"",
			renamedSuccess: "Sous-groupe \"%1\" renommé en \"%2\"",
			infoGroupTag: "📑 | Nom : \"%1\"\n👥 | Nombre de membres : %2\n👨‍👩‍👧‍👦 | Membres :\n %3"
		}
	},
	help: {
		description: "Afficher l'aide et la liste des commandes",
		guide: "{pn} [vide | <numéro de page> | <nom de la commande>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Page [ %2/%3 ]\n│ Actuellement, %4 commandes sont disponibles\n│ » Tapez %5help <page> pour parcourir la liste\n│ » Tapez %5help <commande> pour voir son utilisation\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Actuellement, %2 commandes sont disponibles\n│ » Tapez %3help <commande> pour plus de détails\n│ %4\n╰─────────────⭓",
			commandNotFound: "La commande \"%1\" n'existe pas",
			getInfoCommand: "╭── NOM ────⭓\n│ %1\n├── INFOS\n│ Description: %2\n│ Aliases généraux: %3\n│ Aliases dans ce groupe: %4\n│ Version: %5\n│ Permission: %6\n│ Délai d'attente: %7s\n│ Auteur: %8\n├── Utilisation\n%9\n├── Remarques\n│ Le contenu entre <XXXXX> est variable\n│ Le contenu entre [a|b|c] signifie le choix a, b ou c\n╰──────⭔",
			doNotHave: "Aucun",
			roleText0: "0 (Tous les membres)",
			roleText1: "1 (Admins du groupe)",
			roleText2: "2 (Admin du bot)",
			roleText0setRole: "0 (défini sur : tous les membres)",
			roleText1setRole: "1 (défini sur : admins du groupe)",
			pageNotFound: "La page %1 n'existe pas"
		}
	},
	kick: {
		description: "Exclure un ou plusieurs membres du groupe",
		guide: "{pn} @tags: taguer les personnes à exclure"
	},
	loadconfig: {
		description: "Recharger la configuration du bot"
	},
	moon: {
		description: "Afficher l'état de la lune à une date précise (jj/mm/aaaa)",
		guide: "  {pn} <jour/mois/année>\n   {pn} <jour/mois/année> <caption>",
		text: {
			invalidDateFormat: "Veuillez entrer une date valide au format JJ/MM/AAAA",
			error: "Erreur lors de la récupération de la lune du %1",
			invalidDate: "Le %1 n'est pas une date valide",
			caption: "- Phase lunaire du %1"
		}
	},
	notification: {
		description: "Envoyer une annonce générale à tous les groupes où se trouve le bot",
		guide: "{pn} <message>",
		text: {
			missingMessage: "Veuillez entrer le message à diffuser à l'ensemble des groupes",
			notification: "📢 Annonce des administrateurs du bot (ne pas répondre à ce message)",
			sendingNotification: "Début de l'envoi de l'annonce à %1 groupe(s)",
			sentNotification: "✅ Annonce transmise avec succès à %1 groupe(s)",
			errorSendingNotification: "Une erreur est survenue lors de l'envoi à %1 groupe(s) :\n %2"
		}
	},
	prefix: {
		description: "Changer le préfixe du bot dans le groupe actuel ou globalement (admin bot)",
		guide: "   {pn} <nouveau préfixe>: changer le préfixe du groupe\n   Exemple:\n    {pn} #\n\n   {pn} <nouveau préfixe> -g: changer le préfixe global (admins bot uniquement)\n\n   {pn} reset: réinitialiser le préfixe du groupe par défaut",
		text: {
			reset: "Le préfixe de votre groupe a été réinitialisé par défaut : %1",
			onlyAdmin: "Seuls les admins du bot peuvent modifier le préfixe global",
			confirmGlobal: "Réagissez à ce message pour confirmer la modification du préfixe global",
			confirmThisThread: "Réagissez à ce message pour confirmer le changement de préfixe dans ce groupe",
			successGlobal: "Préfixe du système mis à jour : %1",
			successThisThread: "Préfixe de votre groupe mis à jour : %1",
			myPrefix: "🌐 Préfixe global : %1\n🛸 Préfixe de ce groupe : %2"
		}
	},
	rank: {
		description: "Consulter votre niveau/expérience ou celui des personnes taguées"
	},
	rankup: {
		description: "Activer/désactiver l'annonce de passage de niveau (rankup)",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "Erreur de syntaxe, utilisez {pn} on ou {pn} off",
			turnedOn: "Notifications de montée de niveau activées",
			turnedOff: "Notifications de montée de niveau désactivées",
			notiMessage: "🎉🎉 Félicitations, vous avez atteint le niveau %1 !"
		}
	},
	refresh: {
		description: "Rafraîchir les données enregistrées d'un groupe ou d'un utilisateur",
		guide: "   {pn} [thread | group]: rafraîchir les données du groupe actuel\n   {pn} group <threadID>: rafraîchir les données d'un groupe via son ID\n\n   {pn} user: rafraîchir vos données d'utilisateur\n   {pn} user [<userID> | @tag]: rafraîchir les données d'un utilisateur",
		text: {
			refreshMyThreadSuccess: "✅ | Données de votre groupe rafraîchies avec succès !",
			refreshThreadTargetSuccess: "✅ | Données du groupe %1 rafraîchies avec succès !"
		}
	},
	rules: {
		description: "Créer, afficher ou modifier le règlement intérieur du groupe",
		guide: "   {pn} [add | -a] <règle>: ajouter une règle\n   {pn}: afficher le règlement\n   {pn} [edit | -e] <n°> <nouveau contenu>: modifier la règle n°\n   {pn} [move | -m] <n°1> <n°2>: inverser l'ordre de deux règles\n   {pn} [delete | -d] <n°>: supprimer la règle n°\n   {pn} [remove | -r]: effacer toutes les règles du groupe\n\n   Exemples:\n    {pn} add Ne pas spammer\n    {pn} move 1 3\n    {pn} -e 1 Ne pas envoyer de messages inutiles\n    {pn} -r"
	},
	sendnoti: {
		description: "Créer et gérer des listes de diffusion pour vos groupes",
		guide: "   {pn} create <nomDuGroupeNoti>: créer un groupe de diffusion\n   {pn} add <nomDuGroupeNoti>: ajouter le groupe actuel à la liste (admin du groupe requis)\n   {pn} delete <nomDuGroupeNoti>: retirer le groupe actuel de la liste\n   {pn} send <nomDuGroupeNoti> | <message>: transmettre une annonce à la liste\n   {pn} remove <nomDuGroupeNoti>: supprimer définitivement la liste",
		text: {
			missingGroupName: "Veuillez entrer le nom du groupe de diffusion",
			groupNameExists: "Un groupe de diffusion nommé %1 existe déjà, choisissez un autre nom",
			createdGroup: "Groupe de diffusion créé :\n- Nom: %1\n- ID: %2",
			missingGroupNameToAdd: "Veuillez spécifier le nom du groupe de diffusion auquel ajouter ce tchat",
			groupNameNotExists: "Aucun groupe de diffusion trouvé sous le nom : %1",
			notAdmin: "Vous devez être administrateur du groupe pour effectuer cette action",
			added: "Groupe actuel ajouté à la liste de diffusion : %1",
			missingGroupNameToDelete: "Veuillez spécifier la liste de diffusion à quitter",
			notInGroup: "Ce groupe ne fait pas partie de la liste de diffusion %1",
			deleted: "Groupe actuel retiré de la liste de diffusion : %1",
			failed: "Échec de l'envoi du message à %1 groupe(s) :\n%2",
			missingGroupNameToRemove: "Veuillez préciser la liste de diffusion à supprimer",
			removed: "Liste de diffusion supprimée : %1",
			missingGroupNameToSend: "Veuillez préciser le nom de la liste de diffusion destinataire",
			groupIsEmpty: "La liste de diffusion \"%1\" ne contient aucun groupe",
			sending: "Envoi en cours à %1 groupe(s)...",
			success: "Annonce envoyée à %1 groupe(s) de la liste \"%2\" avec succès",
			notAdminOfGroup: "Vous n'êtes pas administrateur de ce groupe",
			missingGroupNameToView: "Veuillez spécifier la liste à consulter",
			groupInfo: "- Nom : %1\n - ID : %2\n - Créé le : %3\n%4 ",
			groupInfoHasGroup: "- Groupes enregistrés : \n%1",
			noGroup: "Vous n'avez créé aucune liste de diffusion"
		}
	},
	setalias: {
		description: "Créer un alias (raccourci) pour une commande",
		guide: "   {pn} add <alias> <commande>: ajouter un alias pour votre groupe\n   {pn} add <alias> <commande> -g: ajouter un alias global (admin bot)\n   {pn} [remove | rm] <alias> <commande>: supprimer un alias de groupe\n   {pn} list: lister les alias personnalisés du groupe"
	},
	setavt: {
		description: "Modifier la photo de profil du bot",
		text: {
			cannotGetImage: "❌ | Impossible d'accéder à l'image fournie",
			invalidImageFormat: "❌ | Format d'image invalide",
			changedAvatar: "✅ | Photo de profil du bot mise à jour avec succès"
		}
	},
	setlang: {
		description: "Définir la langue par défaut du bot pour ce groupe ou tout le système",
		guide: "   {pn} <code langue ISO 639-1>\n   Exemples: {pn} fr {pn} en {pn} vi",
		text: {
			setLangForAll: "Langue du système configurée sur : %1",
			setLangForCurrent: "Langue de ce groupe configurée sur : %1",
			noPermission: "Seuls les administrateurs du bot peuvent changer la langue globale"
		}
	},
	setleave: {
		description: "Personnaliser ou activer/désactiver le message de départ des membres",
		guide: {
			body: "   {pn} on: activer le message de départ\n   {pn} off: désactiver le message de départ\n   {pn} text [<texte> | reset]: modifier le message ou réinitialiser. Variables :\n  + {userName}: nom du membre partant\n  + {userNameTag}: mention du membre\n  + {boxName}: nom du groupe\n  + {type}: parti de lui-même / exclu par admin\n  + {session}: moment de la journée\n\n   Exemple:\n    {pn} text {userName} a quitté le groupe ({type}), bonne continuation ! 🤧\n\n   Répondez ou joignez un média avec la commande {pn} file: pour ajouter une image/vidéo/audio au message de départ.",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setleave/setleave_en_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
			}
		},
		text: {
			missingContent: "Veuillez spécifier le contenu du message",
			edited: "Message de départ mis à jour pour votre groupe :\n%1",
			reseted: "Message de départ réinitialisé",
			noFile: "Aucun fichier joint à réinitialiser",
			resetedFile: "Fichier joint du message de départ supprimé",
			missingFile: "Répondez avec une image, une vidéo ou un fichier audio",
			addedFile: "%1 fichier(s) joint(s) ajouté(s) au message de départ"
		}
	},
	setname: {
		description: "Modifier le surnom des membres du groupe selon un modèle",
		guide: {
			body: "   {pn} <surnom>: changer son propre surnom\n   {pn} @tags <surnom>: changer le surnom des personnes taguées\n   {pn} all <surnom>: changer le surnom de tout le monde\n\nVariables disponibles :\n   + {userName}: nom de l'utilisateur\n   + {userID}: ID de l'utilisateur",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setname_1.png`]: "https://i.ibb.co/gFh23zb/guide1.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/setname_2.png`]: "https://i.ibb.co/BNWHKgj/guide2.png"
			}
		},
		text: {
			error: "Une erreur est survenue, désactivez les liens d'invitation du groupe et réessayez"
		}
	},
	setrole: {
		description: "Modifier le niveau de permission requis pour une commande (pour les commandes < 2)",
		guide: "   {pn} <nomCommande> <rôle>: définir la permission requise\n   Rôles disponibles :\n   + 0 : accessible à tous les membres\n   + 1 : réservé aux admins du groupe\n   + default : réinitialiser par défaut\n Exemples:\n    {pn} rank 1 (commande rank réservée aux admins)\n    {pn} rank 0 (accessible à tous)\n    {pn} rank default\n—————\n   {pn} [viewrole|view|show]: afficher les permissions modifiées dans ce groupe",
		text: {
			noEditedCommand: "✅ Aucune commande n'a été modifiée dans ce groupe",
			editedCommand: "⚠️ Commandes modifiées dans votre groupe :\n",
			noPermission: "❗ Seuls les admins du groupe peuvent utiliser cette commande",
			commandNotFound: "Commande \"%1\" introuvable",
			noChangeRole: "❗ Impossible de modifier la permission de la commande \"%1\"",
			resetRole: "Permission de la commande \"%1\" réinitialisée par défaut",
			changedRole: "Permission de la commande \"%1\" modifiée à : %2"
		}
	},
	setwelcome: {
		description: "Personnaliser ou configurer le message de bienvenue des nouveaux membres",
		guide: {
			body: "   {pn} text [<texte> | reset]: éditer le message de bienvenue ou réinitialiser, variables disponibles :\n  + {userName}: nom du nouveau membre\n  + {userNameTag}: mention du membre\n  + {boxName}: nom du groupe\n  + {multiple}: toi || vous\n  + {session}: moment de la journée\n\n   Exemple:\n    {pn} text Bienvenue {userName} dans {boxName} ! Passe un bon moment parmi nous.\n\n   Répondez avec une pièce jointe et la commande {pn} file: pour associer une image, une vidéo ou un audio au message.",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setwelcome/setwelcome_en_1.png`]: "https://i.ibb.co/vsCz0ks/setwelcome-en-1.png"
			}
		},
		text: {
			missingContent: "Veuillez saisir le texte de bienvenue",
			edited: "Message de bienvenue mis à jour : %1",
			reseted: "Message de bienvenue réinitialisé",
			noFile: "Aucun fichier joint à supprimer",
			resetedFile: "Fichier joint supprimé avec succès",
			missingFile: "Veuillez répondre à ce message avec une image, une vidéo ou un fichier audio",
			addedFile: "%1 fichier(s) joint(s) ajouté(s) au message de bienvenue"
		}
	},
	shortcut: {
		description: "Créer des réponses automatiques (raccourcis) à des mots-clés dans le groupe",
		text: {
			missingContent: "Veuillez préciser le contenu du raccourci",
			shortcutExists: "Le raccourci \"%1\" existe déjà, réagissez à ce message pour remplacer son contenu",
			shortcutExistsByOther: "Le mot-clé \"%1\" a déjà été configuré par un autre membre, choisissez un autre terme",
			added: "Raccourci ajouté : %1 => %2",
			addedAttachment: " avec %1 fichier(s) joint(s)",
			missingKey: "Entrez le mot-clé du raccourci à supprimer",
			notFound: "Aucun raccourci trouvé pour le mot-clé \"%1\"",
			onlyAdmin: "Seuls les administrateurs peuvent supprimer les raccourcis des autres membres",
			deleted: "Raccourci \"%1\" supprimé",
			empty: "Aucun raccourci n'est configuré dans votre groupe",
			message: "Message",
			attachment: "Pièce jointe",
			list: "Liste de vos raccourcis",
			onlyAdminRemoveAll: "Seuls les administrateurs peuvent effacer tous les raccourcis",
			confirmRemoveAll: "Voulez-vous vraiment supprimer TOUS les raccourcis du groupe ? (réagissez pour confirmer)",
			removedAll: "Tous les raccourcis du groupe ont été supprimés"
		}
	},
	simsimi: {
		description: "Discuter avec l’IA Simsimi",
		guide: "   {pn} [on | off]: activer ou désactiver Simsimi dans le groupe\n\n   {pn} <message>: parler avec Simsimi",
		text: {
			turnedOn: "Simsimi est désormais activé !",
			turnedOff: "Simsimi a été désactivé !",
			chatting: "Simsimi réfléchit...",
			error: "Simsimi est indisponible pour le moment, réessayez plus tard"
		}
	},
	sorthelp: {
		description: "Changer l'ordre d'affichage de la commande help",
		guide: "{pn} [name | category]",
		text: {
			savedName: "Affichage de l'aide trié par nom",
			savedCategory: "Affichage de l'aide trié par catégorie"
		}
	},
	thread: {
		description: "Gérer les groupes enregistrés dans la base de données du bot",
		guide: "   {pn} [find | -f | search | -s] <nom>: chercher un groupe dans la base de données\n   {pn} [find | -f] [-j | joined] <nom>: chercher parmi les groupes où le bot est présent\n   {pn} [ban | -b] [<tid> | vide] <raison>: interdire à un groupe d'utiliser le bot\n   {pn} unban [<tid> | vide]: lever le bannissement d'un groupe",
		text: {
			noPermission: "Vous n'avez pas la permission d'utiliser cette commande",
			found: "🔎 %1 groupe(s) correspondant à \"%2\" trouvé(s) :\n%3",
			notFound: "❌ Aucun groupe correspondant à \"%1\" n'a été trouvé",
			hasBanned: "Le groupe [%1 | %2] est déjà banni :\n» Raison: %3\n» Date: %4",
			banned: "Groupe [%1 | %2] banni d'utilisation du bot.\n» Raison: %3\n» Date: %4",
			notBanned: "Le groupe [%1 | %2] n'est pas banni",
			unbanned: "Bannissement levé pour le groupe [%1 | %2]",
			missingReason: "La raison du bannissement ne peut pas être vide",
			info: "» ID Groupe : %1\n» Nom : %2\n» Enregistré le : %3\n» Total membres : %4\n» Hommes : %5\n» Femmes : %6\n» Total messages : %7%8"
		}
	},
	tid: {
		description: "Afficher l'ID (ThreadID) du groupe actuel",
		guide: "{pn}"
	},
	tik: {
		description: "Télécharger des vidéos, images/diaporama ou fichiers audio depuis TikTok",
		guide: "   {pn} [video|-v|v] <url>: télécharger la vidéo ou le diaporama\n   {pn} [audio|-a|a] <url>: télécharger la bande son",
		text: {
			invalidUrl: "Veuillez fournir un lien TikTok valide",
			downloadingVideo: "Téléchargement de la vidéo : %1...",
			downloadedSlide: "Diaporama téléchargé : %1\n%2",
			downloadedVideo: "Vidéo téléchargée : %1\nLien direct: %2",
			downloadingAudio: "Téléchargement de l'audio : %1...",
			downloadedAudio: "Audio téléchargé : %1"
		}
	},
	trigger: {
		description: "Générer une image animée 'Triggered'",
		guide: "{pn} [@tag | vide]"
	},
	uid: {
		description: "Obtenir l'ID Facebook (UID) d'un utilisateur",
		guide: "   {pn}: voir son propre UID\n   {pn} @tag: voir l'UID d'un membre\n   {pn} <lien de profil>: obtenir l'UID à partir d'un lien",
		text: {
			syntaxError: "Taguez une personne ou laissez vide pour obtenir votre propre UID"
		}
	},
	unsend: {
		description: "Supprimer un message envoyé par le bot",
		guide: "Répondez au message du bot que vous voulez supprimer avec {pn}",
		text: {
			syntaxError: "Veuillez répondre directement au message du bot à supprimer"
		}
	},
	user: {
		description: "Gérer les utilisateurs dans le système du bot",
		guide: "   {pn} [find | -f | search | -s] <nom>: rechercher un utilisateur par son nom\n   {pn} [ban | -b] [<uid> | @tag | réponse] <raison>: bannir un utilisateur du bot\n   {pn} unban [<uid> | @tag | réponse]: débannir un utilisateur",
		text: {
			noUserFound: "❌ Aucun utilisateur correspondant au mot-clé \"%1\" trouvé",
			userFound: "🔎 %1 utilisateur(s) trouvé(s) pour \"%2\" :\n%3",
			uidRequired: "L'UID est requis. Précisez un UID, taguez la personne ou répondez à son message : user ban <uid> <raison>",
			reasonRequired: "La raison du bannissement est obligatoire",
			userHasBanned: "L'utilisateur [%1 | %2] est déjà banni :\n» Raison: %3\n» Date: %4",
			userBanned: "L'utilisateur [%1 | %2] a été banni du bot :\n» Raison: %3\n» Date: %4",
			uidRequiredUnban: "Veuillez spécifier l'UID à débannir",
			userNotBanned: "L'utilisateur [%1 | %2] n'est pas banni",
			userUnbanned: "L'utilisateur [%1 | %2] a été débanni"
		}
	},
	videofb: {
		description: "Télécharger une vidéo ou une story publique depuis Facebook",
		guide: "   {pn} <url de la vidéo/story>",
		text: {
			missingUrl: "Veuillez entrer le lien de la vidéo ou de la story publique Facebook",
			error: "Une erreur est survenue lors du téléchargement de la vidéo",
			downloading: "Téléchargement de votre vidéo en cours...",
			tooLarge: "Désolé, la vidéo dépasse la limite autorisée de 83 Mo"
		}
	},
	warn: {
		description: "Système d'avertissement de groupe. À 3 avertissements, le membre est exclu et banni du groupe.",
		guide: "   {pn} @tag <raison>: avertir un membre\n   {pn} list: voir la liste des membres avertis\n   {pn} listban: voir la liste des membres bannis\n   {pn} info [@tag | <uid> | vide]: consulter la fiche d'un membre\n   {pn} unban <uid>: débannir un membre via son UID\n   {pn} unwarn <uid> [<n° avertissement> | vide]: retirer un avertissement\n   {pn} warn reset: réinitialiser les avertissements du groupe\n⚠️ Le bot doit être administrateur pour expulser automatiquement les membres bannis",
		text: {
			list: "Liste des membres avertis :\n%1\n\nPour voir le détail, utilisez \"%2warn info [@tag | <uid>]\"",
			listBan: "Membres ayant accumulé 3 avertissements et bannis du groupe :\n%1",
			listEmpty: "Aucun membre n'a reçu d'avertissement dans votre groupe",
			listBanEmpty: "Aucun membre n'est actuellement banni du groupe",
			invalidUid: "Veuillez spécifier un UID valide",
			noData: "Aucun enregistrement",
			noPermission: "❌ Seuls les administrateurs du groupe peuvent débannir des membres",
			invalidUid2: "⚠️ Veuillez préciser un UID valide à débannir",
			notBanned: "⚠️ L'utilisateur avec l'ID %1 n'est pas banni du groupe",
			unbanSuccess: "✅ L'utilisateur [%1 | %2] a été débanni et peut de nouveau rejoindre le groupe",
			noPermission2: "❌ Seuls les administrateurs du groupe peuvent retirer des avertissements",
			invalidUid3: "⚠️ Indiquez un UID ou taguez le membre à dégrever",
			noData2: "⚠️ L'utilisateur %1 ne possède aucun avertissement",
			notEnoughWarn: "❌ L'utilisateur %1 n'a que %2 avertissement(s)",
			unwarnSuccess: "✅ Avertissement n°%1 retiré au membre [%2 | %3]",
			noPermission3: "❌ Seuls les administrateurs du groupe peuvent réinitialiser les données d'avertissement",
			resetWarnSuccess: "✅ Historique des avertissements du groupe réinitialisé",
			noPermission4: "❌ Seuls les administrateurs du groupe peuvent donner un avertissement",
			invalidUid4: "⚠️ Vous devez taguer ou répondre au message du membre à avertir",
			warnSuccess: "⚠️ Membre %1 averti (%2/3)\n- Uid: %3\n- Raison: %4\n- Date: %5\nAyant atteint 3 avertissements, ce membre a été exclu. Pour le débannir : \"%6warn unban <uid>\"",
			noPermission5: "⚠️ Le bot a besoin des droits d'administration pour exclure les membres bannis",
			warnSuccess2: "⚠️ Membre %1 averti (%2/3)\n- Uid: %3\n- Raison: %4\n- Date: %5\nEncore %6 infraction(s) avant l'exclusion définitive du groupe.",
			hasBanned: "⚠️ Les membres suivants avaient déjà atteint 3 avertissements et sont bannis :\n%1",
			failedKick: "⚠️ Erreur lors de l'expulsion des membres suivants :\n%1"
		}
	},
	weather: {
		description: "Consulter la météo actuelle et les prévisions sur 5 jours",
		guide: "{pn} <ville/lieu>",
		text: {
			syntaxError: "Veuillez entrer le nom d'une ville",
			notFound: "Emplacement introuvable : %1",
			error: "Une erreur est survenue : %1",
			today: "Météo aujourd'hui à %1 :\n🌡 Températures min - max : %2°C - %3°C\n🌡 Ressenti : %4°C - %5°C\n🌅 Lever du soleil : %6\n🌄 Coucher du soleil : %7\n🌃 Lever de lune : %8\n🏙️ Coucher de lune : %9\n🌞 Jour : %10\n🌙 Nuit : %11"
		}
	},
	ytb: {
		description: "Rechercher et télécharger des vidéos ou audios depuis YouTube",
		guide: "   {pn} [video|-v] [<nom/lien>]: télécharger la vidéo\n   {pn} [audio|-a] [<nom/lien>]: télécharger l'audio MP3\n   {pn} [info|-i] [<nom/lien>]: voir les détails de la vidéo\n   Exemples:\n    {pn} -v Fallen Kingdom\n    {pn} -a Fallen Kingdom\n    {pn} -i Fallen Kingdom",
		text: {
			error: "Une erreur est survenue : %1",
			noResult: "Aucun résultat trouvé pour \"%1\"",
			choose: "%1Répondez avec le numéro correspondant ou n'importe quel texte pour annuler",
			downloading: "Téléchargement de la vidéo : %1...",
			noVideo: "Désolé, aucune vidéo de moins de 83 Mo n'a été trouvée",
			downloadingAudio: "Téléchargement de l'audio : %1...",
			noAudio: "Désolé, aucun fichier audio de moins de 26 Mo n'a été trouvé",
			info: "💠 Titre : %1\n🏪 Chaîne : %2\n👨‍👩‍👧‍👦 Abonnés : %3\n⏱ Durée : %4\n👀 Vues : %5\n👍 Likes : %6\n🆙 Date de mise en ligne : %7\n🔠 ID : %8\n🔗 Lien : %9",
			listChapter: "\n📖 Chapitres : %1\n"
		}
	}
};
