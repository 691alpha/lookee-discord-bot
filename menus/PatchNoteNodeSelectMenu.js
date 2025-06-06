const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { PatchNoteEditNodeModal } = require("../modals/PatchNoteEditNodeModal");
const { ModalManager } = require("../managers/ModalManager");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");

class PatchNoteNodeSelectMenu {
    static customId = "PatchNoteNodeSelectMenu";

    static create(lang, nodes, type) {
        
        const menu = new StringSelectMenuBuilder()
        .setCustomId(`${PatchNoteNodeSelectMenu.customId}/type=${type}`)
        .addOptions(
            nodes.slice(0, 25).map(node => ({
                label: node.content.slice(0, 80),
                value: node.id.toString(),
                description: `${LocalisationManager.getString('patchnote_node_status_description', lang)}${node.status}`,
            }))
        );

    if (type === "delete") {
        menu.setMinValues(1).setMaxValues(Math.min(25, nodes.length));
        menu.setPlaceholder(LocalisationManager.getString('patchnote_select_delete_placeholder'))
    } else if (type === "edit") {
        menu.setMinValues(1).setMaxValues(1);
        menu.setPlaceholder(LocalisationManager.getString('patchnote_select_edit_placeholder'))
    }

    return menu;
    }

    static async onInteraction(interaction) {

        const customId = interaction.customId;
        const {params} = ModalManager.getCustomIdData(customId);
        const type = params.type;

        const selectedIds = interaction.values;
        
        const lang = interaction?.locale ?? 'en-US';

        // Checks what the menu should show depending on the type
        if (type === 'edit') {
            const selectedId = selectedIds[0];
            const node = await PatchNoteNodes.findByPk(selectedId);

            if (!node) {
            throw EmptyResultError(LocalisationManager.getString(
                'patchnote_node_edit_not_found', lang
            ));
        }

            return interaction.showModal(PatchNoteEditNodeModal.create(lang, node, node.id));

        } else if (type === 'delete') {

            await PatchNoteNodes.update(
                { status: 'deleted' },
                { where: { id: selectedIds } }
            );

            PatchnoteUtils.updateAllPatchNotePreviews(interaction);

            return interaction.reply({
                content: LocalisationManager.getString('patchnote_node_deleted', lang).replace('{count}', selectedIds.length),
                flags: MessageFlags.Ephemeral
            });
        }

    }
}

module.exports.PatchNoteNodeSelectMenu = PatchNoteNodeSelectMenu;
