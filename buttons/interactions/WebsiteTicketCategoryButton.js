const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { WebsiteTicketModal } = require("../../modals/WebsiteTicketModal");

class WebsiteTicketCategoryButton {
    static customId = "WebsiteTicketCategoryButton";

    static create(lang, category) {
        return new ButtonBuilder()
            .setCustomId(`${WebsiteTicketCategoryButton.customId}:${category}`)
            .setLabel(LocalisationManager.getString(
                `website_ticket_category_${category}`,
                lang,
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static onInteraction(interaction) {
        const lang = interaction.locale;
        const [, category] = interaction.customId.split(':');

        const member = interaction.member;
        const user = interaction.user;
        const displayName = member?.displayName || user.globalName || user.username || '';
        const parts = displayName.trim().split(/\s+/);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ');

        return interaction.showModal(
            WebsiteTicketModal.create(lang, category, { firstName, lastName }),
        );
    }
}

module.exports.WebsiteTicketCategoryButton = WebsiteTicketCategoryButton;
