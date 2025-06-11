const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const { PatchNoteEditNodeModal } = require("../modals/PatchNoteEditNodeModal");
const { ModalManager } = require("../managers/ModalManager");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");

class PatchNoteNodeSelectMenu {
    static customId = "PatchNoteNodeSelectMenu";

    static create(lang, nodes, type) {
        
        const menu = new StringSelectMenuBuilder()
        .setCustomId(`${PatchNoteNodeSelectMenu.customId}/type=${type}`)
        .addOptions(
            nodes.slice(0, 25).map(node => ({
                label: node.content.slice(0, 80),
                value: node.id.toString(),
                description: `${LocalisationManager.getString(
                    'patchnote_node_status_description', 
                    lang)}${node.status}`,
            }))
        );

        if (type === "delete") {
            menu.setMinValues(1).setMaxValues(Math.min(25, nodes.length));
            menu.setPlaceholder(LocalisationManager.getString(
                'patchnote_select_delete_placeholder',
                lang
            ))
        } 
        if (type === "edit") {
            menu.setMinValues(1).setMaxValues(1);
            menu.setPlaceholder(LocalisationManager.getString(
                'patchnote_select_edit_placeholder',
                lang
            ))
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
                const container = NoVariableResponseComponent.create(
                    'patchnote_selected_nodes_not_found', 
                    lang
                );
                
                interaction.reply({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
                })
            }

            return interaction.showModal(PatchNoteEditNodeModal.create(lang, node, node.id));

        }
        if (type === 'delete') {

            await PatchNoteNodes.update(
                { status: 'deleted' },
                { where: { id: selectedIds } }
            );

            PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild.id, interaction.client, lang);

            return interaction.reply({
                content: LocalisationManager.getString(
                    'patchnote_node_deleted', 
                    lang).replace('{count}', selectedIds.length),
                flags: MessageFlags.Ephemeral
            });
        }

    }
}

module.exports.PatchNoteNodeSelectMenu = PatchNoteNodeSelectMenu;
