const {
    ContainerBuilder,
    TextDisplayBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
} = require('discord.js');
const { CreateTicketButton } = require('../buttons/interactions/CreateTicketButton');
const { CreateWebsiteTicketButton } = require('../buttons/interactions/CreateWebsiteTicketButton');
const { ForwardToWebsiteButton } = require('../buttons/interactions/ForwardToWebsiteButton');
const { LocalisationManager } = require('../managers/LocalisationManager');
const ColorManager = require('../managers/ColorManager');

class CreateTicketComponent {
    static async create(lang, announcementChannelId, guildId, mode = 'native') {
        const container = new ContainerBuilder();
        if (guildId) container.setAccentColor(await ColorManager.getMainColor(guildId));

        const bannerMedia = new MediaGalleryBuilder();
        bannerMedia.addItems(
            new MediaGalleryItemBuilder().setURL('attachment://cover1.png'),
        );
        container.addMediaGalleryComponents(bannerMedia);

        container.addSeparatorComponents(
            new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small, divider: true }),
        );

        const title = new TextDisplayBuilder().setContent(
            `## ${LocalisationManager.getString('create_ticket', lang)}`,
        );

        const bodyKey = mode === 'website' ? 'create_ticket_website_1' : 'create_ticket_1';
        const body = new TextDisplayBuilder().setContent(
            LocalisationManager.getString(bodyKey, lang),
        );

        const footnote = new TextDisplayBuilder().setContent(
            `-# ${LocalisationManager.getString(
                'create_ticket_2',
                lang,
                { 'patchnoteChannel': announcementChannelId },
            )}`,
        );

        container.addTextDisplayComponents(title);
        container.addTextDisplayComponents(body);
        container.addTextDisplayComponents(footnote);

        const primaryButton = mode === 'website'
            ? CreateWebsiteTicketButton.create(lang)
            : CreateTicketButton.create(lang);

        container.addActionRowComponents(row => row.addComponents(
            primaryButton,
            ForwardToWebsiteButton.create(
                lang,
                'https://lookee-app.com/contact',
                LocalisationManager.getString('contact_form_button_label', lang),
            ),
        ));

        return container;
    }
}

module.exports.CreateTicketComponent = CreateTicketComponent;
