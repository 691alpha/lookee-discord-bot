const { MessageFlags, StringSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");
const TicketCategories = require("../database/models/TicketCategories");

class DeleteTicketCategorySelectMenu {
    static customId = "DeleteTicketCategorySelectMenu";

    static async create(lang, categories) {
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${DeleteTicketCategorySelectMenu.customId}`)
            .setMinValues(1)
            .setMaxValues(categories.length)
            .setPlaceholder(LocalisationManager.getString(
                'delete_ticket_category_select_menu_placeholder', 
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
                'delete_ticket_category_selection_invalid',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        for(const selectedId of selectedCategoriesIds) {
            TicketCategories.update(
                {archived: true},
                {where: {id: selectedId}}
            )
        }

        const container = VariableResponseComponent.create(
            'patchnote_category_deletion_success',
            lang,
            {
                'categoriesLength': selectedCategoriesIds.length
            }
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.DeleteTicketCategorySelectMenu = DeleteTicketCategorySelectMenu;
