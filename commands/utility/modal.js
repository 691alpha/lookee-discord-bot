const { SlashCommandBuilder } = require('discord.js');
const { ReloadModal } = require('../../modals/ReloadModal.js');

module.exports = {
    category: 'utility',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Tests modal.'),
    async execute(interaction) {
        await interaction.showModal(ReloadModal.create());
    },
};