const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    category: 'utility',
    cooldown: 4,
    data: new SlashCommandBuilder()
        .setName('greeting')
        .setDescription('Greets the user.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        await interaction.reply(`Greetings, ${interaction.user.username}!`)
    },
};