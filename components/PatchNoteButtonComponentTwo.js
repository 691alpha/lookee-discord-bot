const {
    ContainerBuilder,
} = require('discord.js');

const { SetPatchNoteVersionButton } = require('../buttons/interactions/SetPatchNoteVersionButton');
const { PatchNoteChangeStatusButton } = require('../buttons/interactions/PatchNoteChangeStatusButton');
const { PatchNoteRepublishButton } = require('../buttons/interactions/PatchNoteRepublishButton');

class PatchNoteButtonComponentTwo {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteChangeStatusButton.create(lang),
            SetPatchNoteVersionButton.create(lang),
            // PatchNoteRepublishButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteButtonComponentTwo = PatchNoteButtonComponentTwo;