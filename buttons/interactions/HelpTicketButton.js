const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { HelpTicketModal } = require("../../modals/CategoryTicketModal");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class HelpTicketButton {
    static customId = "HelpTicketButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(HelpTicketButton.customId)
        .setLabel(LocalisationManager.getString('help_ticket_button', lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {

        const lang = interaction.locale;

        return interaction.showModal(HelpTicketModal.create(lang));
    }
}

module.exports.HelpTicketButton = HelpTicketButton;