const { ButtonBuilder, ButtonStyle } = require("discord.js");

class CancelButton {
    static customId = "cancel";

    static create() {
        return new ButtonBuilder()
        .setCustomId(CancelButton.customId)
        .setLabel('Cancel Kick')
        .setStyle(ButtonStyle.Danger);
    }

    static onComponentInteraction(component, callback) {
        if(component.customId == CancelButton.customId) callback();

        return;
    }
}

module.exports.CancelButton = CancelButton;