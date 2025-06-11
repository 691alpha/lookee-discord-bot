const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class PatchNoteNoSetupComponent {
    static async create(lang) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('patchnote_no_setup_found', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteNoSetupComponent = PatchNoteNoSetupComponent;
