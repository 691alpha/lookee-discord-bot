const {
    ContainerBuilder,
} = require('discord.js');

const { PatchNotePublishButton } = require('../buttons/interactions/PatchNotePublishButton');
const { PatchNoteEditNodeButton } = require('../buttons/interactions/PatchNoteEditNodeButton');
const { PatchNoteDeleteNodeButton } = require('../buttons/interactions/PatchNoteDeleteNodeButton');
const { PatchNoteAddNodePickStatusButton } = require('../buttons/interactions/PatchNoteAddNodePickStatusButton');
const { SetPatchNoteVersionButton } = require('../buttons/interactions/SetPatchNoteVersionButton');

class PatchNoteButtonComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodePickStatusButton.create(lang),
            PatchNotePublishButton.create(lang),
            PatchNoteEditNodeButton.create(lang),
            PatchNoteDeleteNodeButton.create(lang),
            SetPatchNoteVersionButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteButtonComponent = PatchNoteButtonComponent;