const { MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { PatchNoteEditNodeModal } = require("../modals/PatchNoteEditNodeModal");
const { ModalManager } = require("../managers/ModalManager");

class PatchNoteNodeSelectMenu {
    static customId = "PatchNoteNodeSelectMenu";

    static create(lang, nodes, placeholder, type) {
        const menu = new StringSelectMenuBuilder()
        .setCustomId(`${PatchNoteNodeSelectMenu.customId}/type=${type}`)
        .setPlaceholder(placeholder)
        .addOptions(
            nodes.slice(0, 25).map(node => ({
                label: node.content.slice(0, 80),
                value: node.id.toString(),
                description: `Status: ${node.status}`,
            }))
        );

    if (type === "delete") {
        menu.setMinValues(1).setMaxValues(Math.min(25, nodes.length));
    } else if (type === "edit") {
        menu.setMinValues(1).setMaxValues(1);
    }

    return menu;
    }

    static async onInteraction(interaction) {

        const customId = interaction.customId;
        const {params} = ModalManager.getCustomIdData(customId);
        const type = params.type;

        const selectedIds = interaction.values;
        
        const lang = interaction?.locale ?? 'en-US';

        if (type === 'edit') {
            const selectedId = selectedIds[0];
            const node = await PatchNoteNodes.findByPk(selectedId);

            if (!node) {
                return interaction.reply({
                    content: 'Could not find the selected patch note node.',
                    flags: MessageFlags.Ephemeral
                });
            }

            return interaction.showModal(PatchNoteEditNodeModal.create(lang, node, node.id));

        } else if (type === 'delete') {

            await PatchNoteNodes.update(
                { status: 'deleted' },
                { where: { id: selectedIds } }
            );

            return interaction.reply({
                content: `Deleted ${selectedIds.length} node(s).`,
                flags: MessageFlags.Ephemeral
            });
        }

    }
}

module.exports.PatchNoteNodeSelectMenu = PatchNoteNodeSelectMenu;
