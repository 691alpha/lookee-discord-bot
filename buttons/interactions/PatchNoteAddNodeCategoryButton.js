const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteAddNodeCategoryModal } = require("../../modals/PatchNoteAddNodeCategoryModal");

class PatchNoteAddNodeCategoryButton {
    static customId = "PatchNoteAddNodeCategoryButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(PatchNoteAddNodeCategoryButton.customId)
        .setLabel(LocalisationManager.getString('patchnote_add_node_category_label', lang))
        .setStyle(ButtonStyle.Success);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;

        return interaction.showModal(PatchNoteAddNodeCategoryModal.create(lang));
    }
}

module.exports.PatchNoteAddNodeCategoryButton = PatchNoteAddNodeCategoryButton;