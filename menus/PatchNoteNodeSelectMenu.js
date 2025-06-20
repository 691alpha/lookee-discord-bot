const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const { PatchNoteEditNodeModal } = require("../modals/PatchNoteEditNodeModal");
const { ModalManager } = require("../managers/ModalManager");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");
const { PatchNoteComponent } = require("../components/PatchNoteComponent");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const Setups = require("../database/models/Setups");
const PatchNoteCategories = require("../database/models/PatchNoteCategories");

class PatchNoteNodeSelectMenu {
    static customId = "PatchNoteNodeSelectMenu";

    static async create(lang, nodes, type, guildId) {
        PatchNoteComponent.curr_categories = await PatchNoteCategories.findAll({});
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${PatchNoteNodeSelectMenu.customId}/type=${type}`)

        let effectiveNodes = nodes;

        if (type != 'delete' && type != 'edit') {
            effectiveNodes = await PatchnoteUtils.findAllNodes(
                guildId, 
                false, 
                {[Op.ne]: type}
            );
        }

        if (!effectiveNodes || effectiveNodes.length === 0) {
            return null;
        }

        menu.addOptions(
            effectiveNodes.slice(0, 25).map(node => ({
                label: node.content.slice(0, 80),
                value: node.id.toString(),
                description: `${LocalisationManager.getString(
                    'patchnote_node_category_description',
                    lang)}${PatchNoteComponent.findCategory(node.categoryId).name}`
            }))
        );

        if (type === 'delete') {
            menu.setMinValues(1).setMaxValues(Math.min(25, effectiveNodes.length));
            menu.setPlaceholder(LocalisationManager.getString(
                'patchnote_select_delete_placeholder', 
                lang
            ));
        } else if (type === 'edit') {
            menu.setMinValues(1).setMaxValues(1);
            menu.setPlaceholder(LocalisationManager.getString(
                'patchnote_select_edit_placeholder', 
                lang
            ));
        } else {
            menu.setMinValues(1).setMaxValues(Math.min(25, effectiveNodes.length));
            menu.setPlaceholder(LocalisationManager.getString(
                'patchnote_select_change_status_placeholder', 
                lang
            ));
        }

        return menu;
    }

    static async onInteraction(interaction) {

        const customId = interaction.customId;
        const {params} = ModalManager.getCustomIdData(customId);
        const type = params.type;
        const selectedIds = interaction.values;
        const selectedId = selectedIds[0];
        const server = Setups.findOne({
            where: {guildId: interaction.guild.id}
        })
        
        const lang = interaction.locale;

        // Checks what the menu should show depending on the type
        if (type === 'edit') {
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
            const selectedNode = await PatchNoteNodes.findByPk(selectedId);

            if(selectedIds.length === 1 && !selectedNode) {
                const container = NoVariableResponseComponent.create(
                    'patchnote_selected_node_alr_deleted', 
                    lang
                )

                return interaction.reply({
                    components: [container],
                    flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
                })
            }

            await PatchNoteNodes.update(
                { deleted: true},
                { where: { id: selectedIds } }
            );

            PatchnoteUtils.updateAllPatchNotePreviews(
                interaction.guild, 
                interaction.client, 
                server.defaultLang
            );

            const container = VariableResponseComponent.create(
                'patchnote_node_deleted', 
                lang,
                {"count": selectedIds.length}
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            })
        }
        else {

            await PatchNoteNodes.update(
                { category: type },
                { where: { id: selectedIds } }
            );

            PatchnoteUtils.updateAllPatchNotePreviews(
                interaction.guild, 
                interaction.client, 
                server.defaultLang
            );

            return interaction.reply({
                content: LocalisationManager.getString(
                    'patchnote_node_status_changed', 
                    lang,
                    {'type': type}
                ).replace('{count}', selectedIds.length),
                flags: MessageFlags.Ephemeral
            });
        }

    }

    static async getNodeCategoryName(node) {
        const category = await PatchNoteCategories.findOne({where: {id: node.categoryId}});
        return category.name;
    }
}

module.exports.PatchNoteNodeSelectMenu = PatchNoteNodeSelectMenu;
