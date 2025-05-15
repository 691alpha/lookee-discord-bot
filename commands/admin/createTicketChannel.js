const {SlashCommandBuilder, ActionRowBuilder} = require('discord.js');
const { CreateTicketButton } = require('../../buttons/interactions/CreateTicketButton.js');
const {EmbedManager} = require('../../managers/EmbedManager.js');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_channel')
        .setDescription('Sends a Ticket embed in the current channel.'),
    async execute(interaction) {
        let outputEmbed = EmbedManager.getEmbed('ticketChannel.create');

        const row = new ActionRowBuilder()
                    .addComponents(CreateTicketButton.create())

        interaction.reply({ 
            embeds: [outputEmbed], 
            components: [row]
         });
    },
};