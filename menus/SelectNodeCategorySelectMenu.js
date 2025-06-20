const { StringSelectMenuBuilder } = require("discord.js");
const { PatchNoteAddNodeModal } = require("../modals/PatchNoteAddNodeModal");
const { LocalisationManager } = require("../managers/LocalisationManager");

class SelectNodeCategorySelectMenu {
    static customId = "SelectNodeCategorySelectMenu";

    static async create(lang, categories) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${SelectNodeCategorySelectMenu.customId}`)
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
        
        return interaction.showModal(PatchNoteAddNodeModal.create(
            lang, 
            selectedCategory
        ));
    }
}

module.exports.SelectNodeCategorySelectMenu = SelectNodeCategorySelectMenu;