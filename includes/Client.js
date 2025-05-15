const { Client, GatewayIntentBits, Partials } = require("discord.js");
const Database = require("../database/Database.js");

 
module.exports = class extends Client {
    constructor () {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
			partials: [Partials.Channel, Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember]
		});

        this.db = new Database();
        this.loadDatabase();
    }

    loadDatabase() {
        this.db.authenticate();
    }

}