const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class PatchNoteNoAnnouncementChannelComponent {
    static async create(lang) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('patchnote_no_announcement_channel_found', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteNoAnnouncementChannelComponent = PatchNoteNoAnnouncementChannelComponent;