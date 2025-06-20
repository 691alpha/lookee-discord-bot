const { StringSelectMenuBuilder, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { SelectMenuComponent } = require("../components/SelectMenuComponent");
const { PatchNoteChangeCategoryNodeSelectMenu } = require("./PatchNoteChangeCategoryNodeSelectMenu");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const { Op } = require("sequelize");

class ChangeNodeCategorySelectMenu {
    static customId = "ChangeNodeCategorySelectMenu";

    static async create(lang, categories) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${ChangeNodeCategorySelectMenu.customId}`)
            .setMinValues(1)
            .setMaxValues(categories.length)
            .setPlaceholder(LocalisationManager.getString(
                'patchnote_select_node_category_menu_placeholder', 
                lang
            ))
            .addOptions(
                categories.slice(0, 25).map(category => ({
                    label: category.name.slice(0, 80),
                    value: category.id
                }))
            );

        return menu;
    }

    static async onInteraction(interaction) {
        const selectedCategory = interaction.values;
        const lang = interaction.locale;

        const nodes = await PatchNoteNodes.findAll({
            where:{
                categoryId: {[Op.ne]:selectedCategory},
                published: false,
                deleted: false
            }
        });

        if(!nodes || nodes.length === 0) {
            const container = NoVariableResponseComponent.create(
                'patchnote_change_category_no_nodes',
                lang
            );

            interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            })
        }
        
        const container = await SelectMenuComponent.create(
            'patchnote_select_new_node_category',
            PatchNoteChangeCategoryNodeSelectMenu,
            lang,
            nodes,
            selectedCategory
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.ChangeNodeCategorySelectMenu = ChangeNodeCategorySelectMenu;