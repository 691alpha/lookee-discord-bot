const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const Setups = require('../../database/models/Setups');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_notification_role')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sets the role pinged on TestFlight build announcements.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Role to ping. Leave empty to disable the ping.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const lang = interaction.locale;
        const role = interaction.options.getRole('role');

        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });
        if (!setup) {
            const container = NoVariableResponseComponent.create('patchnote_no_setup_found', lang);
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        await Setups.update(
            { notificationRoleId: role?.id ?? null },
            { where: { guildId: interaction.guild.id } },
        );

        const container = role
            ? VariableResponseComponent.create('set_notification_role_success', lang, { roleId: role.id })
            : NoVariableResponseComponent.create('set_notification_role_cleared', lang);

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
