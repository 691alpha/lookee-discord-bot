const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { ReloadModal } = require('../../modals/ReloadModal.js');

module.exports = {
    category: 'utility',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Tests modal.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        await interaction.showModal(ReloadModal.create());
    },
};