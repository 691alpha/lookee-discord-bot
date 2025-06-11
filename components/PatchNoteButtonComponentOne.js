const {
    ContainerBuilder,
} = require('discord.js');

const { PatchNotePublishButton } = require('../buttons/interactions/PatchNotePublishButton');
const { PatchNoteEditNodeButton } = require('../buttons/interactions/PatchNoteEditNodeButton');
const { PatchNoteDeleteNodeButton } = require('../buttons/interactions/PatchNoteDeleteNodeButton');
const { PatchNoteAddNodePickStatusButton } = require('../buttons/interactions/PatchNoteAddNodePickStatusButton');

class PatchNoteButtonComponentOne {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodePickStatusButton.create(lang),
            PatchNotePublishButton.create(lang),
            PatchNoteEditNodeButton.create(lang),
            PatchNoteDeleteNodeButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteButtonComponentOne = PatchNoteButtonComponentOne;