const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { SuggestionModal } = require("../../modals/SuggestionModal");

class SuggestionButton {
    static customId = "SuggestionButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(SuggestionButton.customId)
        .setEmoji('1386432557947682887')
        .setLabel(LocalisationManager.getString('suggestion_button', lang))
        .setStyle(ButtonStyle.Success);
    }

    static onInteraction(interaction) {

        const lang = interaction.locale;

        return interaction.showModal(SuggestionModal.create(lang));
    }
}

module.exports.SuggestionButton = SuggestionButton;