const { MessageFlags, ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { ModalManager } = require("../managers/ModalManager");

class PatchNoteEditNodeModal {

    static customId = `PatchNoteEditNodeModal`;
    
    static create(lang, node, nodeId) {

        let customId = `${PatchNoteEditNodeModal.customId}/nodeId=${nodeId}`;
        ModalManager.checkCustomIdLength(customId);
        
        const modal = new ModalBuilder()
            .setCustomId(customId)
            .setTitle(`Edit Patchnote Node`);

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

        const customId = interaction.customId;
        const {params} = ModalManager.getCustomIdData(customId);
        const nodeId = params.nodeId;

        const node = await PatchNoteNodes.findByPk(nodeId);

        if (!node) {
            return interaction.reply({
                content: "Node not found.",
                flags: MessageFlags.Ephemeral
            });
        }

        const newContent = interaction.fields.getTextInputValue("patchNoteEditNodeModalDescription");

        node.content = newContent;
        await node.save();

        await interaction.reply({
            content: "Patchnote node updated.",
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PatchNoteEditNodeModal = PatchNoteEditNodeModal;
