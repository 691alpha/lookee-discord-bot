const { ButtonBuilder, ButtonStyle } = require("discord.js");

class OtherTicketButton {
    static customId = "otherTicket";

    static create() {
        return new ButtonBuilder()
        .setCustomId(OtherTicketButton.customId)
        .setLabel('Other')
        .setStyle(ButtonStyle.Secondary);
    }

    static onComponentInteraction(component) {
        if(component.customId == OtherTicketButton.customId) {
            
        }

        return;
    }
}

module.exports.OtherTicketButton = OtherTicketButton;