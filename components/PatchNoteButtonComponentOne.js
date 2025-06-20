const {
    ContainerBuilder,
} = require('discord.js');

const { PatchNotePublishButton } = require('../buttons/interactions/PatchNotePublishButton');
const { PatchNoteEditNodeButton } = require('../buttons/interactions/PatchNoteEditNodeButton');
const { PatchNoteDeleteNodeButton } = require('../buttons/interactions/PatchNoteDeleteNodeButton');
const { PatchNoteAddNodeButton } = require('../buttons/interactions/PatchNoteAddNodeButton');

class PatchNoteButtonComponentOne {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodeButton.create(lang),
            PatchNoteEditNodeButton.create(lang),
            PatchNoteDeleteNodeButton.create(lang),
            PatchNotePublishButton.create(lang),
        ));

        return container;
    }
}

module.exports.PatchNoteButtonComponentOne = PatchNoteButtonComponentOne;