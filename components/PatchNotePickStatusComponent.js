const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { PatchNotePickStatusButton } = require('../buttons/interactions/PatchNotePickStatusButton');
const { LocalisationManager } = require('../managers/LocalisationManager');

class PatchNotePickStatusComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('patchnote_pick_status_to_apply', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            PatchNotePickStatusButton.create(lang, 'Planned'),
            PatchNotePickStatusButton.create(lang, 'Done')
        ));

        return container;
    }
}

module.exports.PatchNotePickStatusComponent = PatchNotePickStatusComponent;