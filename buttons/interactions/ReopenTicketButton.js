const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { EmbedManager } = require("../../managers/EmbedManager");

class ReopenTicketButton {
    static customId = "ReopenTicketButton";
    
        static create(lang) {
            return new ButtonBuilder()
                .setCustomId(ReopenTicketButton.customId)
                .setLabel(LocalisationManager.getString('reopen_ticket_label_button', lang))
                .setStyle(ButtonStyle.Secondary);
        }
    
        static async onInteraction(interaction) {

            const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);

            if(ticket.moderator) {
                TicketUtils.moveTicketToCategory(
                    interaction.guild, 
                    ticket.id,
                    interaction.channel, 
                    'assigned', 
                );
            } else {
                TicketUtils.moveTicketToCategory(
                    interaction.guild, 
                    ticket.id, 
                    interaction.channel, 
                    'unassigned', 
                );
            }

            let outputEmbed = EmbedManager.getEmbed('ticketChannel.reopened');

            interaction.reply({ embeds: [outputEmbed]});
        }
}

module.exports.ReopenTicketButton = ReopenTicketButton;