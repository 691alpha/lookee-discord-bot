const {
    ContainerBuilder,
    ThumbnailBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
} = require('discord.js');


class BannerComponent {
    static async create() {
        const container = new MediaGalleryBuilder();
        const banner = new MediaGalleryItemBuilder()
        .setURL('attachment://lookee-banner.jpg')
        

       container.addItems(banner); 

        return container;
    }
}

module.exports.BannerComponent = BannerComponent;