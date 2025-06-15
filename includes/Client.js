const { Client, GatewayIntentBits, Partials } = require("discord.js");
const Database = require("../database/Database.js");
// const { default: OpenAI } = require("openai");
const { Mistral } = require("@mistralai/mistralai");


module.exports = class extends Client {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
            partials: [Partials.Channel, Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember]
        });

        this.db = new Database();
        // this.openAIClient = this.loadOpenAIClient();
        this.mistralClient = this.loadMistralClient();
        this.loadDatabase();
    }

    loadDatabase() {
        this.db.authenticate();
    }

    loadOpenAIClient() {
        return new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
    }

    loadMistralClient() {
        // magistral-small-2506
        return new Mistral({
            apiKey: process.env.MISTRAL_API_KEY,
        })
    }

}