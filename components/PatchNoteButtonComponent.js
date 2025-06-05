const {
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchNoteAddNodeModalButton } = require('../buttons/interactions/PatchNoteAddNodeModalButton');
const { PatchNotePublishButton } = require('../buttons/interactions/PatchNotePublishButton');
const { PatchNoteEditNodeButton } = require('../buttons/interactions/PatchNoteEditNodeButton');
const { PatchNoteDeleteNodeButton } = require('../buttons/interactions/PatchNoteDeleteNodeButton');

class PatchNoteButtonComponent {
    static async create(interaction) {
        const container = new ContainerBuilder();

        const lang = interaction?.locale ?? 'en-US';

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodeModalButton.create('planned'),
            PatchNoteAddNodeModalButton.create('done'),
            PatchNotePublishButton.create(lang),
            PatchNoteEditNodeButton.create(lang),
            PatchNoteDeleteNodeButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteButtonComponent = PatchNoteButtonComponent;