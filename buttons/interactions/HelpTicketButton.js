const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { HelpTicketModal } = require("../../modals/HelpTicketModal");

class HelpTicketButton {
    static customId = "HelpTicketButton";

    static create() {
        return new ButtonBuilder()
        .setCustomId(HelpTicketButton.customId)
        .setLabel('Help')
        .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {

        return interaction.showModal(HelpTicketModal.create());
    }
}

module.exports.HelpTicketButton = HelpTicketButton;