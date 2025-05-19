const { ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField } = require("discord.js");
const { TicketUtilities } = require("../../utils/TicketUtils");

class CloseTicketButton {
    static customId = "CloseTicketButton";

    static create() {
        return new ButtonBuilder()
            .setCustomId(CloseTicketButton.customId)
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        
    }
}

module.exports.CloseTicketButton = CloseTicketButton;
