const { Client, GatewayIntentBits, Partials } = require("discord.js");
const Database = require("../database/Database.js");
// const { default: OpenAI } = require("openai");
const { Mistral } = require("@mistralai/mistralai");
const ClosedTicketHandler = require("../handlers/ClosedTicketHandler.js");


module.exports = class extends Client {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
            partials: [Partials.Channel, Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember]
        });

        this.db = new Database();
        this.mistralClient = this.loadMistralClient();
        this.loadDatabase();

        this.startTicketTimeoutClock();
        this.startCachingClock();
    }

    loadDatabase() {
        this.db.authenticate();
    }

    loadMistralClient() {
        return new Mistral({
            apiKey: process.env.MISTRAL_API_KEY,
        })
    }

    startTicketTimeoutClock() {
        
    }

    startCachingClock() {
        ClosedTicketHandler
    }

}