const {
    ContainerBuilder,
} = require('discord.js');
const { SetPatchNoteVersionFormatButton } = require('../buttons/interactions/SetPatchNoteVersionFormatButton');
const { PatchNoteIncreaseVersionButton } = require('../buttons/interactions/PatchNoteIncreaseVersionButton');

class PatchNoteVersionButtonComponent {
    static async create(interaction) {
        const container = new ContainerBuilder();

        const lang = interaction?.locale ?? 'en-US';

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteIncreaseVersionButton.create(lang),
            SetPatchNoteVersionFormatButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteVersionButtonComponent = PatchNoteVersionButtonComponent;