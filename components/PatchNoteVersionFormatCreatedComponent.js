const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');

class PatchNoteVersionFormatCreatedComponent {
    static async create(lang, newContent) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `### ${LocalisationManager.getString('set_patchnote_version_format', lang)}`,
                `${newContent}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteVersionFormatCreatedComponent = PatchNoteVersionFormatCreatedComponent;