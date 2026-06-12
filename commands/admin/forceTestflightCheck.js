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
        .setDescription('Checks all tracked apps for new TestFlight builds right now.'),
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
            const { checkedCount, announcements } = await interaction.client.runTestflightCheck();

            if (checkedCount === 0) {
                container = NoVariableResponseComponent.create('testflight_no_apps', lang);
            } else if (announcements.length === 0) {
                container = VariableResponseComponent.create('testflight_check_no_new_build', lang, {
                    appCount: checkedCount,
                });
            } else {
                container = VariableResponseComponent.create('testflight_check_announced', lang, {
                    list: announcements
                        .map(a => `- **${a.appName}** ${a.marketingVersion ?? '—'} (${a.buildNumber ?? '—'})`)
                        .join('\n'),
                });
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
