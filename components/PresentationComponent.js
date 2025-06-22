const { ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, SeparatorSpacingSize, SeparatorBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');

class PresentationComponent {
    static async create(lang) {
        const container = new ContainerBuilder();
        const separator = new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small,
            divider: true,
        });

        const BannerMedia = new MediaGalleryBuilder();
        const banner = new MediaGalleryItemBuilder()
        .setURL('https://cdn.discordapp.com/attachments/1386458050994503711/1386458102966124544/Sypher-Twitter-Header.png?ex=6859c73a&is=685875ba&hm=42923ed001eadb781ea0c4df2aa64daab6016f6400955149e2c233b1d20a25ef&')
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
        
        container.setAccentColor(0xac182b)
        container.addMediaGalleryComponents(BannerMedia);
        container.addSeparatorComponents(separator);
        container.addTextDisplayComponents(PresentationTitle);
        container.addTextDisplayComponents(PresentationText);

        return container;
    }
}

module.exports.PresentationComponent = PresentationComponent;