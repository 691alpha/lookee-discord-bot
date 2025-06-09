const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const Setups = require('../../database/models/Setups');

// Sets the current channel as 'announcement' channel which is used to send patchnotes

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_announcement_channel')
        .setDescription('Sets the current channel as announcement channel.'),
    async execute(interaction) {

        const setups = await Setups.findAll({
            where: {
                guildId: interaction.guild.id
            }
        });

        if(!setups || setups.length === 0) {

            const { db } = interaction.client;

            await Setups.create({
                id: await db.getNextId('setups'),
                guildId: interaction.guild.id,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                announcementChannelId: interaction.channel.id,
                defaultLang: 'en-US',
            });
        }

        await Setups.update(
                    { announcementChannelId: interaction.channel.id },
                    { where: { guildId: interaction.guild.id } }
                );

        await interaction.reply({
            content: 'This Channel is now set as Annoucement Channel.',
            flags: MessageFlags.Ephemeral,
        })
    },
};