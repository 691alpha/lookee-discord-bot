const { ContainerBuilder } = require('discord.js');
const { PatchNotePickStatusButton } = require('../buttons/interactions/PatchNotePickStatusButton');

class PatchNotePickStatusComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNotePickStatusButton.create(lang, 'Planned'),
            PatchNotePickStatusButton.create(lang, 'Done')
        ));

        return container;
    }
}

module.exports.PatchNotePickStatusComponent = PatchNotePickStatusComponent;