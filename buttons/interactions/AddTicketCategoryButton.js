const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { AddTicketCategoryModal } = require("../../modals/AddTicketCategoryModal");

class AddTicketCategoryButton {
    static customId = "AddTicketCategoryButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AddTicketCategoryButton.customId)
            .setLabel(`${LocalisationManager.getString(
                'add_ticket_category_button_label', 
                lang
            )}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;

        return interaction.showModal(AddTicketCategoryModal.create(
            lang
        ));
    }
}

module.exports.AddTicketCategoryButton = AddTicketCategoryButton;
