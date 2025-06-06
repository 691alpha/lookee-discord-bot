const { MessageFlags, ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { ModalManager } = require("../managers/ModalManager");
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");

class PatchNoteEditNodeModal {

    static customId = `PatchNoteEditNodeModal`;
    
    static create(lang, node, nodeId) {

        let customId = `${PatchNoteEditNodeModal.customId}/nodeId=${nodeId}`;
        ModalManager.checkCustomIdLength(customId);
        
        const modal = new ModalBuilder()
            .setCustomId(customId)
            .setTitle(LocalisationManager.getString('patchnote_edit_node_modal_title', lang))

        const descriptionInput = new TextInputBuilder()
            .setCustomId("patchNoteEditNodeModalDescription")
            .setLabel("Patch Note Content")
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(1000)
            .setValue(node.content)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(descriptionInput);
        modal.addComponents(row);
        return modal;
    }
    static async onSubmit(interaction) {

        const lang = interaction?.locale ?? 'en-US';

        const customId = interaction.customId;
        const {params} = ModalManager.getCustomIdData(customId);
        const nodeId = params.nodeId;

        const node = await PatchNoteNodes.findByPk(nodeId);

        if (!node) {
            return interaction.reply({
                content: LocalisationManager.getString('patchnote_node_not_found', lang),
                flags: MessageFlags.Ephemeral
            });
        }

        const newContent = interaction.fields.getTextInputValue("patchNoteEditNodeModalDescription");

        node.content = newContent;
        await node.save();

        PatchnoteUtils.updateAllPatchNotePreviews(interaction);

        await interaction.reply({
            content: LocalisationManager.getString('patchnote_node_updated', lang),
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PatchNoteEditNodeModal = PatchNoteEditNodeModal;
