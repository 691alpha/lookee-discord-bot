const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Formats = require('../../database/models/Formats');
const { PatchNoteCreateVersionFormatModal } = require('../../modals/PatchNoteCreateVersionFormatModal')

class SetPatchNoteVersionFormatButton {
    static customId = "SetPatchNoteVersionFormatButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(SetPatchNoteVersionFormatButton.customId)
            .setLabel(`${LocalisationManager.getString(
                'set_patchnote_version_format_button_label', 
                lang
            )}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction?.locale ?? 'en-US';

        return interaction.showModal(PatchNoteCreateVersionFormatModal.create(lang));
    }
}

module.exports.SetPatchNoteVersionFormatButton = SetPatchNoteVersionFormatButton;
