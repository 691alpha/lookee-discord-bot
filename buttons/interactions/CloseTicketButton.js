const { ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField, ActionRowBuilder } = require("discord.js");
const { TicketUtilities } = require("../../utils/TicketUtils");
const { ReopenTicketButton } = require("../interactions/ReopenTicketButton");
const { EmbedManager } = require("../../managers/EmbedManager");

class CloseTicketButton {
    static customId = "CloseTicketButton";

    static create() {
        return new ButtonBuilder()
            .setCustomId(CloseTicketButton.customId)
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const ticket = await TicketUtilities.findTicketByChannel(interaction.channel.id);
        TicketUtilities.moveTicketToCategory(
            interaction.guild, 
            ticket.id, 
            interaction.channel, 
            'closed', 
            'closedTicketsId'
        );

        const row = new ActionRowBuilder()
                    .addComponents(ReopenTicketButton.create());

        let outputEmbed = EmbedManager.getEmbed('ticketChannel.movedToClosed');

        interaction.reply({ embeds: [outputEmbed], components: [row]});

    }

}

module.exports.CloseTicketButton = CloseTicketButton;
