const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const Setups = require('../../database/models/Setups');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_ticket_cooldown')
        .setDescription('Sets the per-user cooldown (in seconds) between ticket creations. 0 to disable.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addIntegerOption(option =>
            option
                .setName('seconds')
                .setDescription('Cooldown in seconds (0 disables the cooldown).')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(86400)
        ),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');

        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });
        if (!setup) {
            const container = NoVariableResponseComponent.create('setup_not_found', interaction.locale);
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        await Setups.update(
            { ticketCooldownSeconds: seconds },
            { where: { guildId: interaction.guild.id } },
        );

        const key = seconds > 0 ? 'set_ticket_cooldown_success' : 'set_ticket_cooldown_disabled';
        const container = VariableResponseComponent.create(key, interaction.locale, { seconds });

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
