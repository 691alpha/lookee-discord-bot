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
        .setURL('https://cdn.discordapp.com/attachments/1386458050994503711/1386458102966124544/Sypher-Twitter-Header.png?ex=6859c73a&is=685875ba&hm=42923ed001eadb781ea0c4df2aa64daab6016f6400955149e2c233b1d20a25ef&')
        

       container.addItems(banner); 

        return container;
    }
}

module.exports.BannerComponent = BannerComponent;