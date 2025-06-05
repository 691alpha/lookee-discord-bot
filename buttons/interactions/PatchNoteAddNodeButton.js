const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteAddNodeComponent } = require("../../components/PatchNoteAddNodeComponent");

class PatchNoteAddNodeButton {
    static customId = "PatchNoteAddNodeButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(PatchNoteAddNodeButton.customId)
        .setLabel(LocalisationManager.getString('create_patchnote_node_button', lang))
        .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {

        return interaction.showModal(PatchNoteAddNodeComponent.create(lang));
    }
}

module.exports.PatchNoteAddNodeButton = PatchNoteAddNodeButton;