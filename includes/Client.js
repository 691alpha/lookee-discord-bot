const { Client, GatewayIntentBits, Partials, MessageFlags, AttachmentBuilder } = require("discord.js");
const path = require("node:path");
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
                try {
                    await this.runTestflightCheck();
                } catch (error) {
                    console.error('TestFlight poll failed:', error.message);
                }
            }
        )
    }

    /**
     * Fetches the latest TestFlight build and announces it in every guild
     * whose stored build id differs. Returns the latest build and the number
     * of guilds an announcement was sent to.
     */
    async runTestflightCheck() {
        const setups = await Setups.findAll({
            where: { testflightChannelId: { [Op.ne]: null } },
        });
        if (setups.length === 0) return { latest: null, announcedCount: 0 };

        const latest = await AppStoreConnectManager.getLatestBuild();
        if (!latest) return { latest: null, announcedCount: 0 };

        let announcedCount = 0;

        for (const setup of setups) {
            if (setup.lastTestflightBuildId === latest.id) continue;

            try {
                await this.announceTestflightBuild(setup, latest);
                await setup.update({ lastTestflightBuildId: latest.id });
                announcedCount++;
            } catch (error) {
                console.error(`TestFlight notify failed for guild ${setup.guildId}:`, error.message);
                // Don't retry a build forever when the channel is gone.
                if (error.code === 'CHANNEL_UNAVAILABLE') {
                    await setup.update({ lastTestflightBuildId: latest.id });
                }
            }
        }

        return { latest, announcedCount };
    }

    /**
     * Posts the announcement for the given build in the guild's configured
     * TestFlight channel. Throws if the channel is missing or not text-based.
     */
    async announceTestflightBuild(setup, build) {
        const channel = await this.channels.fetch(setup.testflightChannelId).catch(() => null);
        if (!channel || !channel.isTextBased()) {
            const error = new Error(`Channel ${setup.testflightChannelId} is missing or not text-based.`);
            error.code = 'CHANNEL_UNAVAILABLE';
            throw error;
        }

        const container = await TestflightNewBuildComponent.create(
            setup.defaultLang,
            setup.guildId,
            build,
        );

        const bannerAttachment = new AttachmentBuilder(
            path.join(__dirname, '../assets/images/cover1.png'),
        );

        await channel.send({
            components: [container],
            files: [bannerAttachment],
            flags: MessageFlags.IsComponentsV2,
        });
    }

}