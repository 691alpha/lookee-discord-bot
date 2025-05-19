const {SlashCommandBuilder, ChannelType, MessageFlags} = require('discord.js');
const Setups = require('../../database/models/Setups');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_categories')
        .setDescription('Creates all needed categories for ticket management.'),
    async execute(interaction) {

        const { db } = interaction.client;
        const guildId = interaction.guild.id;

        const assignedCategory = await interaction.guild.channels.create({
            name: 'assigned tickets',
            type: ChannelType.GuildCategory,
        });

        const unassignedCategory = await interaction.guild.channels.create({
            name: 'unassigned tickets',
            type: ChannelType.GuildCategory,
        });
        
        const closedCategory = await interaction.guild.channels.create({
            name: 'closed tickets',
            type: ChannelType.GuildCategory,
        });

        await Setups.create({
            id: await db.getNextId('setups'),
            guildId: guildId,
            solvedTicketsId: assignedCategory.id,
            unsolvedTicketsId: unassignedCategory.id,
            closedTicketsId: closedCategory.id,
            defaultLang: 'en-US', // or interaction.locale or your own logic
        });

        await interaction.reply({
            content: `Created ticket categories and saved setup to database.`,
            flags: MessageFlags.Ephemeral
        });
    },
};