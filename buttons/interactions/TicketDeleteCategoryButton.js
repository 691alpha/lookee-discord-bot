const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const { SelectMenuComponent } = require("../../components/SelectMenuComponent");
const { DeleteTicketCategorySelectMenu } = require("../../menus/DeleteTicketCategorySelectMenu");
const TicketCategories = require("../../database/models/TicketCategories");

class TicketDeleteCategoryButton {
    static customId = "TicketDeleteCategoryButton";

    static create(lang) {
        
        return new ButtonBuilder()
            .setCustomId(TicketDeleteCategoryButton.customId)
            .setLabel(LocalisationManager.getString(
                'delete_ticket_category_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        const categories = await TicketCategories.findAll({
            where: {
                guildId: interaction.guild.id,
                archived: false
            }
        });

        if(!categories || categories.length === 0) {
            const container = NoVariableResponseComponent.create(
                'delete_ticket_category_no_category_found',
                lang
            );

            return interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2]
            });
        }

        const container = await SelectMenuComponent.create(
            'delete_ticket_category_select_category',
            DeleteTicketCategorySelectMenu,
            lang,
            categories
        );

        interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
}

module.exports.TicketDeleteCategoryButton = TicketDeleteCategoryButton;
