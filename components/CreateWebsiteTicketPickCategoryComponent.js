const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { WebsiteTicketCategoryButton } = require('../buttons/interactions/WebsiteTicketCategoryButton');
const ColorManager = require('../managers/ColorManager');

const WEBSITE_TICKET_CATEGORIES = ['bug', 'billing', 'account', 'feature', 'other'];

class CreateWebsiteTicketPickCategoryComponent {
    static async create(lang, guildId) {
        const textContainer = new ContainerBuilder();
        if (guildId) textContainer.setAccentColor(await ColorManager.getMainColor(guildId));

        const text = new TextDisplayBuilder().setContent(
            [
                `## ${LocalisationManager.getString(
                    'create_ticket_pick_category_title_component',
                    lang,
                )}`,
                `${LocalisationManager.getString(
                    'create_ticket_pick_category_description_component',
                    lang,
                )}`,
            ].join('\n'),
        );
        textContainer.addTextDisplayComponents(text);

        textContainer.addActionRowComponents(row => row.addComponents(
            ...WEBSITE_TICKET_CATEGORIES.map(category =>
                WebsiteTicketCategoryButton.create(lang, category),
            ),
        ));

        return [textContainer];
    }
}

module.exports.CreateWebsiteTicketPickCategoryComponent = CreateWebsiteTicketPickCategoryComponent;
module.exports.WEBSITE_TICKET_CATEGORIES = WEBSITE_TICKET_CATEGORIES;
