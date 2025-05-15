const {SlashCommandBuilder, ActionRowBuilder, ChannelType, MessageFlags} = require('discord.js');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_categories')
        .setDescription('Creates all needed categories for ticket management.'),
    async execute(interaction) {
        interaction.guild.channels.create({name: 'BugTickets', type: ChannelType.GuildCategory});
        interaction.guild.channels.create({name: 'HelpTickets', type: ChannelType.GuildCategory});
        interaction.guild.channels.create({name: 'SuggestionTickets', type: ChannelType.GuildCategory});
        interaction.guild.channels.create({name: 'OtherTickets', type: ChannelType.GuildCategory});

        await interaction.reply({content: `Created Ticket Management Categories.`, flags: MessageFlags.Ephemeral})
    },
};