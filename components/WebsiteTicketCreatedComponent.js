const {
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const ColorManager = require('../managers/ColorManager');

class WebsiteTicketCreatedComponent {
    static async create(lang, ticketNumber, ticketUrl, guildId) {
        const container = new ContainerBuilder();
        if (guildId) container.setAccentColor(await ColorManager.getMainColor(guildId));

        const text = new TextDisplayBuilder().setContent(
            [
                `## ${LocalisationManager.getString('ticket_created', lang)}`,
                `### ${LocalisationManager.getString(
                    'website_ticket_created_info',
                    lang,
                    { 'ticketNumber': ticketNumber },
                )}`,
                `-# ${LocalisationManager.getString('ticket_created_at', lang)} ${new Date().toLocaleString(lang, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })}`,
            ].join('\n'),
        );
        container.addTextDisplayComponents(text);

        const linkButton = new ButtonBuilder()
            .setLabel(LocalisationManager.getString('website_ticket_view_button_label', lang))
            .setStyle(ButtonStyle.Link)
            .setURL(ticketUrl);

        container.addActionRowComponents(row => row.addComponents(linkButton));

        return container;
    }
}

module.exports.WebsiteTicketCreatedComponent = WebsiteTicketCreatedComponent;
