var request = require('request-promise-native'), // si vous souhaitez faire des requêtes HTTP
	pluginName = "[assistant-EDF-Tempo]",
	messages = {
		BLEU: {
			today: ["Nous sommes un jour BLEU.", "Voyez la vie en BLEU aujourd'hui !", "Vous voyez le ciel ? Peut importe sa couleur, aujourd'hui c'est BLEU.", "Vous pouvez avoir peur de Gargamelle, nous sommes BLEU aujourd'hui.", "Salut la bleusaille, c'est votre jour aujourd'hui."],
			tomorrow: ["Demain sera un jour BLEU.", "Demain, verrez la vie en BLEU.", "Je vous promets un avenir tout BLEU.", "Demain sera ce rêve BLEU !"]
		},
		BLANC: {
			today: ["Nous sommes un jour BLANC.", "Tarif BLANC pour aujourd'hui, pas de stress.", "Aujourd'hui on paye le même prix que le peuple, jour BLANC.", "La couleur du jour est aussi colorée que le visage d'un cadavre, jour BLANC !"],
			tomorrow: ["Demain sera un jour BLANC.", "Demain sera pavé de tempo BLANC.", "Tarif normal pour demain : BLANC."]
		},
		ROUGE: {
			today: ["Nous sommes un jour ROUGE.", "Eteignez les radiateurs, la lumière, le frigo, sortez les couvertures, nous sommes ROUGE.", "Si vous avez une cheminée, allumez là, nous sommes ROUGE... attendez, vous n'avez pas de cheminée? Fuyez pauvres fous !", "Code rouge, je répète, code rouge !"],
			tomorrow: ["Demain sera un jour ROUGE.", "Winter is coming, ROUGE pour demain.", "Conseil pour demain, installez un tas de fumier dans le salon pour le réchauffer, ROUGE.", "Prenez rendez vous chez le médecin, demain ce sera rouge, vous serez malades.", "Le cor de Helm, mes amis, va retentir dans le gouffre une nouvelle fois. Et que l'aube soit rouge !"]
		},
		ND: {
			today: ["La couleur du jour n'est pas définie... ce n'est pas normal quelque chose à du mal se passer..."],
			tomorrow: ["La couleur de demain n'est pas encore définie... réessayez cet après midi pour être sur"]
		}
	};

/**
 * on crée une fonction `AssistantEDFTempo`
 * @param {Object} configuration L'objet `configuration` qui vient du fichier configuration.json
 */
var AssistantEDFTempo = function(configuration) {
	// par exemple configuration.key si on a `{ "key": "XXX" }` dans le fichier configuration.json
	// exemple: this.key = configuration.key;
	// URLs WS Domogeek (http://domogeek.entropialux.com/static/doc/index.html#api-Domogeek-GetTempo)
	this.wsURLToday = "http://api.domogeek.fr/tempoedf/now/json";
	this.wsURLTomorrow = "http://api.domogeek.fr/tempoedf/tomorrow/json";
}, trace = function(message) {
	var dateTrace = new Date();
	console.log(dateTrace.getDate() + "/" + dateTrace.getMonth() + "/" + dateTrace.getFullYear() + " " + dateTrace.getHours() + ":" + dateTrace.getMinutes() + ":" + dateTrace.getSeconds() + "," + dateTrace.getMilliseconds() + " :: " + pluginName + message);
};

/**
 * Il faut ensuite créer une fonction `init()`
 *
 * @param  {Object} plugins Un objet représentant les autres plugins chargés
 * @return {Promise}
 */
AssistantEDFTempo.prototype.init = function(plugins) {
	var _this = this;
	_this.plugins = plugins;
	// si une configuration est requise (en reprenant l'exemple de "key") :
	// if (!this.key) return Promise.reject("[assistant-template] Erreur : vous devez configurer ce plugin !");
	return Promise.resolve(_this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande La commande à executer
 */
AssistantEDFTempo.prototype.action = function(commande) {
	var _this = this;
	return _this.executeCommand(commande).then(function() {
		trace("Commande « " + commande + " » exécutée");
	});
};

function getMessageForCouleur(couleur, jour) {
	var listeMessages = [],
		messageCouleur = "",
		messageCount = 0;
	if (messages && messages.hasOwnProperty(couleur)) {
		if (messages[couleur] && messages[couleur].hasOwnProperty(jour)) {
			listeMessages = messages[couleur][jour];
			if (listeMessages.length) {
				messageCount = Math.floor(Math.random() * Math.floor(listeMessages.length -1));
				messageCouleur = listeMessages[messageCount];
			}
		}
	}
	return messageCouleur;
}

AssistantEDFTempo.prototype.executeCommand = function (commande) {
	var _this = this,
		texte = "",
		jour = "",
		url = "";
	if (commande) {
		commande = commande.trim();
		if (commande == "today") {
			texte = "du jour";
			url = _this.wsURLToday;
		} else if (commande == "tomorrow") {
			texte = "de demain";
			url = _this.wsURLTomorrow;
		}
		jour = commande;
		trace("Appel du service de récupération de la couleur " + texte + ". (url: " + url + ")");
		return request({
			url: url,
			method: "GET",
			json: {},
			encode: "utf-8"
		}).then(function (response) {
			var messageCouleur = "",
				couleur = "";
			if (response) {
				couleur = response.tempocolor;
				trace("Le ws Domogeek a répondu : " + couleur);
				var texte = getMessageForCouleur(couleur, jour);
				if (_this.plugins.notifier) _this.plugins.notifier.action(texte);
			}
		});
	}
};

/**
 * Initialisation du plugin
 *
 * @param  {Object} configuration La configuration
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init = function(configuration, plugins) {
	return new AssistantEDFTempo(configuration).init(plugins).then(function(resource) {
		trace("Plugin edf-tempo chargé et prêt.");
		return resource;
	});
}

/**
 * À noter qu'il est également possible de sauvegarder des informations supplémentaires dans le fichier configuration.json général
 * Pour cela on appellera this.plugins.assistant.saveConfig('nom-du-plugin', {configuration_en_json_complète}); (exemple dans le plugin freebox)
 */
