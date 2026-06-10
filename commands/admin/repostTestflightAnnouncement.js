const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const Setups = require('../../database/models/Setups');
const AppStoreConnectManager = require('../../managers/AppStoreConnectManager');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('repost_testflight_announcement')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Reposts the announcement for the latest TestFlight build (debug).'),
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
        if (!setup || !setup.testflightChannelId) {
            const container = NoVariableResponseComponent.create('testflight_channel_not_set', lang);
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        let container;
        try {
            const latest = await AppStoreConnectManager.getLatestBuild();
            if (!latest) {
                container = NoVariableResponseComponent.create('testflight_check_no_builds', lang);
            } else {
                await interaction.client.announceTestflightBuild(setup, latest);
                container = NoVariableResponseComponent.create('testflight_repost_success', lang);
            }
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
