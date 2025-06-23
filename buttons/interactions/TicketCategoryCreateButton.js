const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { CategoryTicketModal } = require("../../modals/CategoryTicketModal");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class TicketCategoryCreateButton {
    static customId = "TicketCategoryCreateButton";

    static create(lang, category) {
        return new ButtonBuilder()
        .setCustomId(`${TicketCategoryCreateButton.customId}:${category}`)
        .setLabel(LocalisationManager.getString(
            `ticket_custom_category_button_label`, 
            lang, 
            {'category': category}
        ))
        .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {

        const lang = interaction.locale;
        const customId = interaction.customId;
        const [prefix, category] = customId.split(':');

        return interaction.showModal(CategoryTicketModal.create(lang, category));
    }
}

module.exports.TicketCategoryCreateButton = TicketCategoryCreateButton;