const { Client, GatewayIntentBits, Partials, MessageFlags, AttachmentBuilder, TextDisplayBuilder } = require("discord.js");
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
const TestflightApps = require("../database/models/TestflightApps.js");
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
     * Checks every tracked TestFlight app for a new build and announces it.
     * Returns { checkedCount, announcements } where announcements is a list
     * of { appName, marketingVersion, buildNumber }.
     */
    async runTestflightCheck() {
        await this.migrateLegacyTestflightSetup();

        const apps = await TestflightApps.findAll();
        const announcements = [];

        for (const app of apps) {
            let latest;
            try {
                latest = await AppStoreConnectManager.getLatestBuild(app.appStoreAppId);
            } catch (error) {
                console.error(`TestFlight check failed for app ${app.name} (${app.appStoreAppId}):`, error.message);
                continue;
            }
            if (!latest || app.lastBuildId === latest.id) continue;

            try {
                await this.announceTestflightBuild(app, latest);
                await app.update({ lastBuildId: latest.id });
                announcements.push({
                    appName: app.name,
                    marketingVersion: latest.marketingVersion,
                    buildNumber: latest.buildNumber,
                });
            } catch (error) {
                console.error(`TestFlight notify failed for app ${app.name} (guild ${app.guildId}):`, error.message);
                // Don't retry a build forever when the channel is gone.
                if (error.code === 'CHANNEL_UNAVAILABLE') {
                    await app.update({ lastBuildId: latest.id });
                }
            }
        }

        return { checkedCount: apps.length, announcements };
    }

    /**
     * One-time migration: guilds configured through the old single-app setup
     * (testflightChannelId on Setups + APP_STORE_CONNECT_APP_ID env) get a
     * TestflightApps row so the multi-app poll picks them up.
     */
    async migrateLegacyTestflightSetup() {
        const legacyAppId = process.env.APP_STORE_CONNECT_APP_ID;
        if (!legacyAppId) return;

        const setups = await Setups.findAll({
            where: { testflightChannelId: { [Op.ne]: null } },
        });

        for (const setup of setups) {
            const count = await TestflightApps.count({ where: { guildId: setup.guildId } });
            if (count > 0) continue;

            const appInfo = await AppStoreConnectManager.getAppInfo(legacyAppId).catch(() => null);
            await TestflightApps.create({
                id: await this.db.getNextId('testflight_apps'),
                guildId: setup.guildId,
                appStoreAppId: legacyAppId,
                name: appInfo?.name ?? 'App',
                channelId: setup.testflightChannelId,
                publicLink: process.env.TESTFLIGHT_PUBLIC_LINK || null,
                lastBuildId: setup.lastTestflightBuildId,
            });
            console.log(`Migrated legacy TestFlight setup for guild ${setup.guildId} to testflight_apps.`);
        }
    }

    /**
     * Posts the announcement for the given build in the app's configured
     * channel, pinging the guild's notification role when one is set.
     * Throws if the channel is missing or not text-based.
     */
    async announceTestflightBuild(app, build, { ping = true } = {}) {
        const channel = await this.channels.fetch(app.channelId).catch(() => null);
        if (!channel || !channel.isTextBased()) {
            const error = new Error(`Channel ${app.channelId} is missing or not text-based.`);
            error.code = 'CHANNEL_UNAVAILABLE';
            throw error;
        }

        const setup = await Setups.findOne({ where: { guildId: app.guildId } });

        const container = await TestflightNewBuildComponent.create(
            setup?.defaultLang ?? 'en-US',
            app.guildId,
            build,
            app,
        );

        const bannerAttachment = new AttachmentBuilder(
            path.join(__dirname, '../assets/images/cover1.png'),
        );

        const components = [];
        const roleId = ping ? setup?.notificationRoleId : null;
        if (roleId) {
            components.push(new TextDisplayBuilder().setContent(`<@&${roleId}>`));
        }
        components.push(container);

        await channel.send({
            components,
            files: [bannerAttachment],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: roleId ? { roles: [roleId] } : undefined,
        });
    }

}