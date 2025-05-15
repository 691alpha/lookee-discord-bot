const { ButtonBuilder, ButtonStyle } = require("discord.js");

class BugTicketButton {
    static customId = "BugTicketButton";

    static create() {
        return new ButtonBuilder()
        .setCustomId(BugTicketButton.customId)
        .setLabel('Bug')
        .setStyle(ButtonStyle.Secondary);
    }

    static onComponentInteraction(component) {
        if(component.customId == BugTicketButton.customId) {
            
        }

        return;
    }
}

module.exports.BugTicketButton = BugTicketButton;