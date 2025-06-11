const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager")
const { PatchNoteNodeSelectMenu } = require("../../menus/PatchNoteNodeSelectMenu");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchNoteNoNodesComponent } = require("../../components/responses/PatchNoteNoNodesComponent");
const { PatchNoteEditVersionDescriptionModal } = require("../../modals/PatchNoteEditVersionDescriptionModal");

class PatchNoteEditVersionDescriptionButton {
    static customId = "PatchNoteEditVersionDescriptionButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteEditVersionDescriptionButton.customId)
            .setLabel(LocalisationManager.getString(
                'edit_version_description_patchnote_node_button', 
                lang
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const lang = interaction?.locale ?? 'en-US';

        return interaction.showModal(PatchNoteEditVersionDescriptionModal.create(lang));
    }
}

module.exports.PatchNoteEditVersionDescriptionButton = PatchNoteEditVersionDescriptionButton;
