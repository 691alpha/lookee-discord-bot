const {SlashCommandBuilder} = require('discord.js');
const {LocalisationManager} = require('../../managers/LocalisationManager.js');

module.exports = {
    category: 'utility',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('hallo')
        .setDescription('Hallos the user.'),
    async execute(interaction) {
        let string = LocalisationManager.getString('error', interaction.locale, {"{error}": "something went wrong :ccc", "{test}": "teeest"});
        interaction.reply(string);
    },
};