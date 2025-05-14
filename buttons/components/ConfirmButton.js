const { ButtonBuilder, ButtonStyle } = require("discord.js");

class ConfirmButton {
    static customId = "confirm";

    static create() {
        return new ButtonBuilder()
        .setCustomId(ConfirmButton.customId)
        .setLabel('Confirm Kick')
        .setStyle(ButtonStyle.Danger);
    }

    static onComponentInteraction(component, callback) {
        if(component.customId == ConfirmButton.customId) callback();

        return;
    }
}

module.exports.ConfirmButton = ConfirmButton;