const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteSetVersionModal } = require("../../modals/PatchNoteSetVersionModal");

class PatchNoteSetVersionButton {
    static customId = "PatchNoteSetVersionButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(`${PatchNoteSetVersionButton.customId}`)
            .setLabel(LocalisationManager.getString('patchnote_set_version_button_label', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {

        const lang = interaction?.locale ?? 'en-US';

        return interaction.showModal(PatchNoteSetVersionModal.create(lang));
    }
}

module.exports.PatchNoteSetVersionButton = PatchNoteSetVersionButton;