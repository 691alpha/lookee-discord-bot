const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const TestflightApps = require('../../database/models/TestflightApps');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('list_testflight_apps')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Lists the apps tracked for TestFlight build announcements.'),
    async execute(interaction) {
        const lang = interaction.locale;

        const apps = await TestflightApps.findAll({
            where: { guildId: interaction.guild.id },
        });

        const container = apps.length === 0
            ? NoVariableResponseComponent.create('testflight_no_apps', lang)
            : VariableResponseComponent.create('testflight_apps_list', lang, {
                list: apps
                    .map(app => `- **${app.name}** (\`${app.appStoreAppId}\`) → <#${app.channelId}>`)
                    .join('\n'),
            });

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
