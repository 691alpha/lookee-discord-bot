const { SlashCommandBuilder, MessageFlags, PermissionsBitField, ChannelType } = require('discord.js');
const Setups = require('../../database/models/Setups');
const TestflightApps = require('../../database/models/TestflightApps');
const AppStoreConnectManager = require('../../managers/AppStoreConnectManager');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('add_testflight_app')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Subscribes to TestFlight build announcements for an App Store Connect app.')
        .addStringOption(option =>
            option
                .setName('app_id')
                .setDescription('Numeric Apple ID of the app (App Store Connect → App Information).')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel for the announcements. Defaults to the current channel.')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Display name. Defaults to the app name on App Store Connect.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('public_link')
                .setDescription('TestFlight public invite link, used for the button on announcements.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const lang = interaction.locale;

        if (!AppStoreConnectManager.isConfigured()) {
            const container = NoVariableResponseComponent.create(
                'set_testflight_channel_not_configured',
                lang,
            );
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });
        if (!setup) {
            const container = NoVariableResponseComponent.create('patchnote_no_setup_found', lang);
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const appId = interaction.options.getString('app_id').trim();
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const publicLink = interaction.options.getString('public_link');

        let container;
        try {
            const appInfo = await AppStoreConnectManager.getAppInfo(appId);
            if (!appInfo) {
                container = VariableResponseComponent.create('testflight_app_add_failed', lang, { appId });
                return interaction.editReply({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2],
                });
            }

            const name = interaction.options.getString('name') ?? appInfo.name ?? appId;

            // Seed with the current latest build so only future uploads get announced.
            const latest = await AppStoreConnectManager.getLatestBuild(appId).catch(() => null);

            const existing = await TestflightApps.findOne({
                where: { guildId: interaction.guild.id, appStoreAppId: appId },
            });

            if (existing) {
                await existing.update({
                    name,
                    channelId: channel.id,
                    publicLink: publicLink ?? existing.publicLink,
                });
                container = VariableResponseComponent.create('testflight_app_updated', lang, {
                    appName: name,
                    channelId: channel.id,
                });
            } else {
                const { db } = interaction.client;
                await TestflightApps.create({
                    id: await db.getNextId('testflight_apps'),
                    guildId: interaction.guild.id,
                    appStoreAppId: appId,
                    name,
                    channelId: channel.id,
                    publicLink: publicLink ?? null,
                    lastBuildId: latest?.id ?? null,
                });
                container = VariableResponseComponent.create('testflight_app_added', lang, {
                    appName: name,
                    appId,
                    channelId: channel.id,
                });
            }
        } catch (error) {
            console.error('Adding TestFlight app failed:', error.message);
            container = NoVariableResponseComponent.create('testflight_check_failed', lang);
        }

        return interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    },
};
