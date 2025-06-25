const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const PatchNoteCategories = require("../database/models/PatchNoteCategories");
const { PatchnoteUtils } = require('../utils/PatchnoteUtils');

class PatchNoteChangeCategoryNodeSelectMenu {
    static customId = "PatchNoteChangeCategoryNodeSelectMenu";

    static async create(lang, nodes, category) {
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${PatchNoteChangeCategoryNodeSelectMenu.customId}/${category}`)
            .setMinValues(1)
            .setMaxValues(nodes.length)

        let effectiveNodes = nodes;

        if (!effectiveNodes || effectiveNodes.length === 0) {
            return null;
        }

        menu.addOptions(
            effectiveNodes.slice(0, 25).map(node => ({
                label: node.content.slice(0, 80),
                value: node.id.toString(),
            }))
        );

        return menu;
    }

    static async onInteraction(interaction) {

        const customId = interaction.customId;
        const [prefix, categoryId] = customId.split('/');
        const selectedNodesIds = interaction.values;
        const lang = interaction.locale;

        for(const selectedNodeId of selectedNodesIds) {
            PatchNoteNodes.update(
                {categoryId: categoryId},
                {where: {id: selectedNodeId}}
            )
        }

        const category = await PatchNoteCategories.findOne({
            where:{
                id: categoryId, 
                archived: false
            }
        });
        const container = VariableResponseComponent.create(
            'patchnote_node_category_updated',
            lang,
            {'selectedNodesLength': selectedNodesIds.length, 'categoryName': category.name}
        );

        await new Promise(r => setTimeout(r, 1000));

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild, interaction.client, lang);


        interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })

    }
}

module.exports.PatchNoteChangeCategoryNodeSelectMenu = PatchNoteChangeCategoryNodeSelectMenu;
