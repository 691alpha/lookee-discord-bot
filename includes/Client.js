const { Client, GatewayIntentBits, Partials, MessageFlags } = require("discord.js");
const Database = require("../database/Database.js");
// const { default: OpenAI } = require("openai");
const { Mistral } = require("@mistralai/mistralai");
const ClosedTicketHandler = require("../handlers/ClosedTicketHandler.js");
const { scheduleJob } = require("node-schedule");
const { Op } = require("sequelize");
const Setups = require("../database/models/Setups.js");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent.js");
const AppStoreConnectManager = require("../managers/AppStoreConnectManager.js");
const { TestflightNewBuildComponent } = require("../components/TestflightNewBuildComponent.js");


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
        this.startTestflightNotifyClock();
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
        scheduleJob(
            process.env["SCHEDULE_JOB_NAME_TICKET_TIMEOUT"] ?? "SCHEDULE_JOB_TICKET_TIMEOUT",
            '00 * * * * *',
            async () => {
                console.log('Running ticket timeout clock...');
                const tickets = ClosedTicketHandler.getTickets();

                let logChannel;
                let setup;

                for (const ticket of tickets) {
                    // if (!(Date.now() - ticket.closedAt > (1000 * 10))) continue;
                    if (!(Date.now() - closedTicket.closedAt > (1000 * 3600 * 24 * 7))) continue;
                    
                    if (!ticket.channelId) {
                        console.log(`Ticket ${ticket.id} already has a null channelId. Skipping.`);
                        continue;
                    }

                    if (!(Date.now() - ticket.closedAt > (1000 * 3600 * 24 * 7))) continue;
            
                    console.log(`Ticket ${ticket.id} (Channel: ${ticket.channelId}) has timed out. Attempting deletion...`);

                    let channel;
                    
                    const ticketChannelId = ticket.channelId
                    
                    ticket.update({channelId: null});
                    try {
                        channel = await this.channels.fetch(ticketChannelId);
                    } catch {
                        console.log(`Ticket ${ticket.id} (Channel: ${ticket.channelId}) Deletion failed.`);
                        continue;
                        // if (!setup) setup = await Setups.findOne({where: {guildId: channel.guild.id}});
                        // if (!logChannel) logChannel = this.channels.fetch(setup.logChannelId);
    
                        // const container = NoVariableResponseComponent.create(
                        //     'autodeletion_failed'
                        // );
    
                        // logChannel.send({
                        //     components: [container],
                        //     flags: [MessageFlags.IsComponentsV2]
                        // })
                    }
                    channel.delete();
                    console.log(`Ticket ${ticket.id} (Channel: ${ticket.channelId}) has been deleted.`);

                }
            }
        )
    }

    startCachingClock() {
        scheduleJob(
            process.env["SCHEDULE_JOB_NAME_TICKET_CACHE"] ?? "SCHEDULE_JOB_TICKET_CACHE",
            // '*/2 * * * *',
            '30 4 * * 3,7',
            async () => {
                ClosedTicketHandler.loadCache();
            }
        )
    }

    startTestflightNotifyClock() {
        if (!AppStoreConnectManager.isConfigured()) {
            console.log('TestFlight polling disabled: App Store Connect credentials missing.');
            return;
        }

        scheduleJob(
            process.env["SCHEDULE_JOB_NAME_TESTFLIGHT_POLL"] ?? "SCHEDULE_JOB_TESTFLIGHT_POLL",
            '*/5 * * * *',
            async () => {
                const setups = await Setups.findAll({
                    where: { testflightChannelId: { [Op.ne]: null } },
                });
                if (setups.length === 0) return;

                let latest;
                try {
                    latest = await AppStoreConnectManager.getLatestBuild();
                } catch (error) {
                    console.error('TestFlight poll failed:', error.message);
                    return;
                }
                if (!latest) return;

                for (const setup of setups) {
                    if (setup.lastTestflightBuildId === latest.id) continue;

                    try {
                        const channel = await this.channels.fetch(setup.testflightChannelId);
                        if (!channel || !channel.isTextBased()) {
                            await setup.update({ lastTestflightBuildId: latest.id });
                            continue;
                        }

                        const container = await TestflightNewBuildComponent.create(
                            setup.defaultLang,
                            setup.guildId,
                            latest,
                        );
                        await channel.send({
                            components: [container],
                            flags: MessageFlags.IsComponentsV2,
                        });
                        await setup.update({ lastTestflightBuildId: latest.id });
                    } catch (error) {
                        console.error(`TestFlight notify failed for guild ${setup.guildId}:`, error.message);
                    }
                }
            }
        )
    }

}