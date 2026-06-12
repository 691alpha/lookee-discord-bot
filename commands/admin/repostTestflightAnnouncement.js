const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const { Op } = require('sequelize');
const TestflightApps = require('../../database/models/TestflightApps');
const AppStoreConnectManager = require('../../managers/AppStoreConnectManager');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('repost_testflight_announcement')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Reposts the announcement for the latest TestFlight build (debug).')
        .addStringOption(option =>
            option
                .setName('app')
                .setDescription('Apple ID or name of the tracked app. Defaults to all tracked apps.')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('ping')
                .setDescription('Also ping the notification role. Default: no.')
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

        const input = interaction.options.getString('app')?.trim();
        const ping = interaction.options.getBoolean('ping') ?? false;

        const where = { guildId: interaction.guild.id };
        if (input) where[Op.or] = [{ appStoreAppId: input }, { name: input }];

        const apps = await TestflightApps.findAll({ where });
        if (apps.length === 0) {
            const container = input
                ? VariableResponseComponent.create('testflight_app_not_found', lang, { appId: input })
                : NoVariableResponseComponent.create('testflight_no_apps', lang);
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        let container;
        try {
            let repostedCount = 0;
            for (const app of apps) {
                const latest = await AppStoreConnectManager.getLatestBuild(app.appStoreAppId);
                if (!latest) continue;
                await interaction.client.announceTestflightBuild(app, latest, { ping });
                repostedCount++;
            }

            container = repostedCount === 0
                ? NoVariableResponseComponent.create('testflight_check_no_builds', lang)
                : NoVariableResponseComponent.create('testflight_repost_success', lang);
        } catch (error) {
            console.error('TestFlight repost failed:', error.message);
            container = NoVariableResponseComponent.create('testflight_check_failed', lang);
        }

        return interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    },
};
