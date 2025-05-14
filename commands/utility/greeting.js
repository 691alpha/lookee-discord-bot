const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    category: 'utility',
    cooldown: 4,
    data: new SlashCommandBuilder()
        .setName('greeting')
        .setDescription('Greets the user.'),
    async execute(interaction) {
        await interaction.reply(`Greetings, ${interaction.user.username}!`)
    },
};