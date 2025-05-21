const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { TicketUtilities } = require("../../utils/TicketUtils");
const { EmbedManager } = require("../../managers/EmbedManager");

class ReopenTicketButton {
    static customId = "ReopenTicketButton";
    
        static create() {
            return new ButtonBuilder()
                .setCustomId(ReopenTicketButton.customId)
                .setLabel('Re-open Ticket')
                .setStyle(ButtonStyle.Secondary);
        }
    
        static async onInteraction(interaction) {

            const ticket = await TicketUtilities.findTicketByChannel(interaction.channel.id);

            if(ticket.moderator) {
                TicketUtilities.moveTicketToCategory(
                    interaction.guild, 
                    ticket.id,
                    interaction.channel, 
                    'assigned', 
                    // 'solvedTicketsId'
                );
            } else {
                TicketUtilities.moveTicketToCategory(
                    interaction.guild, 
                    ticket.id, 
                    interaction.channel, 
                    'unassigned', 
                    // 'unsolvedTicketsId'
                );
            }

            let outputEmbed = EmbedManager.getEmbed('ticketChannel.reopened');

            interaction.reply({ embeds: [outputEmbed]});
        }
}

module.exports.ReopenTicketButton = ReopenTicketButton;