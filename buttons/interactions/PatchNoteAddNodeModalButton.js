const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteAddNodeModal } = require("../../modals/PatchNoteAddNodeModal");

class PatchNoteAddNodeModalButton {
    static customId = "PatchNoteAddNodeModalButton";

    static create(status, lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteAddNodeModalButton.customId}:${status}`)
        .setLabel(LocalisationManager.getString(status, lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {
        const status = interaction.customId.split(':')[1];

        const lang = interaction.locale;

        return interaction.showModal(PatchNoteAddNodeModal.create(lang, status));
    }
}

module.exports.PatchNoteAddNodeModalButton = PatchNoteAddNodeModalButton;