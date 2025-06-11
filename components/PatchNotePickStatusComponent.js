const { ContainerBuilder } = require('discord.js');
const { PatchNotePickStatusButton } = require('../buttons/interactions/PatchNotePickStatusButton');

class PatchNotePickStatusComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNotePickStatusButton.create(lang, 'done'),
            PatchNotePickStatusButton.create(lang, 'planned')
        ));

        return container;
    }
}

module.exports.PatchNotePickStatusComponent = PatchNotePickStatusComponent;