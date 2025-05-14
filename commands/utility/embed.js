const {SlashCommandBuilder} = require('discord.js');
const {EmbedManager} = require('../../managers/EmbedManager.js');

module.exports = {
    category: 'utility',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Tests Embed.'),
    async execute(interaction) {
        let outputEmbed = EmbedManager.getEmbed('reload.success');
        interaction.reply({ embeds: [outputEmbed] });
    },
};