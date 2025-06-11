const { ContainerBuilder } = require('discord.js');
const { SetPatchNoteVersionFormatButton } = require('../buttons/interactions/SetPatchNoteVersionFormatButton');
const { PatchNoteIncreaseVersionButton } = require('../buttons/interactions/PatchNoteIncreaseVersionButton');
const { PatchNoteEditVersionDescriptionButton } = require('../buttons/interactions/PatchNoteEditVersionDescriptionButton');

class PatchNoteVersionButtonComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteIncreaseVersionButton.create(lang),
            SetPatchNoteVersionFormatButton.create(lang),
            PatchNoteEditVersionDescriptionButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteVersionButtonComponent = PatchNoteVersionButtonComponent;