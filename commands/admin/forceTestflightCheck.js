const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const AppStoreConnectManager = require('../../managers/AppStoreConnectManager');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('force_testflight_check')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Checks for a new TestFlight build right now and announces it if found.'),
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

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        let container;
        try {
            const { latest, announcedCount } = await interaction.client.runTestflightCheck();

            if (!latest) {
                container = NoVariableResponseComponent.create('testflight_check_no_builds', lang);
            } else {
                container = VariableResponseComponent.create(
                    announcedCount > 0 ? 'testflight_check_announced' : 'testflight_check_no_new_build',
                    lang,
                    {
                        marketingVersion: latest.marketingVersion ?? '—',
                        buildNumber: latest.buildNumber ?? '—',
                    },
                );
            }
        } catch (error) {
            console.error('Forced TestFlight check failed:', error.message);
            container = NoVariableResponseComponent.create('testflight_check_failed', lang);
        }

        return interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    },
};
