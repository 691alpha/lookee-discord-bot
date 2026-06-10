const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const Setups = require('../../database/models/Setups');
const AppStoreConnectManager = require('../../managers/AppStoreConnectManager');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_testflight_channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sets the current channel for TestFlight new build announcements.'),
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

        let latestBuildId = setup.lastTestflightBuildId ?? null;
        let initialFetchFailed = false;

        if (!latestBuildId) {
            try {
                const latest = await AppStoreConnectManager.getLatestBuild();
                latestBuildId = latest?.id ?? null;
            } catch (error) {
                console.error('TestFlight initial build lookup failed:', error.message);
                initialFetchFailed = true;
            }
        }

        await Setups.update(
            {
                testflightChannelId: interaction.channel.id,
                lastTestflightBuildId: latestBuildId,
            },
            { where: { guildId: interaction.guild.id } },
        );

        const container = NoVariableResponseComponent.create(
            initialFetchFailed ? 'set_testflight_channel_fetch_failed' : 'set_testflight_channel_success',
            lang,
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
