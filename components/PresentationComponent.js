const { ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorSpacingSize, SeparatorBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const ColorManager = require('../managers/ColorManager');

class PresentationComponent {
    static async create(lang, guildId) {
        const container = new ContainerBuilder();
        const separator = new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small,
            divider: true,
        });

        const BannerMedia = new MediaGalleryBuilder();
        const banner = new MediaGalleryItemBuilder()
        .setURL('attachment://cover1.png')
       BannerMedia.addItems(banner);

        const PresentationTitle = new TextDisplayBuilder().setContent(
            `### ${
                LocalisationManager.getString('presentation_title', lang)
            }`
        );

        const PresentationText = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('presentation_text_1', lang)}`,
            ].join('\n'),
        );
        
        container.setAccentColor(await ColorManager.getMainColor(guildId))
        container.addMediaGalleryComponents(BannerMedia);
        container.addSeparatorComponents(separator);
        container.addTextDisplayComponents(PresentationTitle);
        container.addTextDisplayComponents(PresentationText);

        return container;
    }
}

module.exports.PresentationComponent = PresentationComponent;