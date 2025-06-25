const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");
const PatchNoteCategories = require("../database/models/PatchNoteCategories");
const PatchNoteNodes = require("../database/models/PatchNoteNodes");
const { PatchnoteUtils } = require("../utils/PatchnoteUtils");

class DeleteNodeCategorySelectMenu {
    static customId = "DeleteNodeCategorySelectMenu";

    static async create(lang, categories) {
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${DeleteNodeCategorySelectMenu.customId}`)
            .setMinValues(1)
            .setMaxValues(categories.length)
            .setPlaceholder(LocalisationManager.getString(
                'patchnote_select_category_delete_menu_placeholder', 
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
        const selectedCategoriesIds = interaction.values;
        const lang = interaction.locale;

        if(!selectedCategoriesIds || selectedCategoriesIds.length === 0) {
            const container = NoVariableResponseComponent.create(
                'patchnote_selected_category_invalid',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        for(const selectedCategoryId of selectedCategoriesIds) {
            await PatchNoteNodes.update(
                {deleted: true},
                {where: {categoryId: selectedCategoryId}}
            );
            await PatchNoteCategories.update(
                {archived: true},
                {where:{id: selectedCategoryId}}
            )
        }

        const container = VariableResponseComponent.create(
            'patchnote_category_deletion_success',
            lang,
            {
                'categoriesLength': selectedCategoriesIds.length
            }
        );

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild, interaction.client, lang);

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.DeleteNodeCategorySelectMenu = DeleteNodeCategorySelectMenu;
