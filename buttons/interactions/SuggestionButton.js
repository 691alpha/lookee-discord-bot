const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { SuggestionModal } = require("../../modals/SuggestionModal");

class SuggestionButton {
    static customId = "SuggestionButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(SuggestionButton.customId)
        .setLabel(LocalisationManager.getString('suggestion_button', lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {

        const lang = interaction.locale;

        return interaction.showModal(SuggestionModal.create(lang));
    }
}

module.exports.SuggestionButton = SuggestionButton;