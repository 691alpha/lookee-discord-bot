const {
    ContainerBuilder,
} = require('discord.js');

const { SetPatchNoteVersionButton } = require('../buttons/interactions/SetPatchNoteVersionButton');
const { PatchNoteRepublishButton } = require('../buttons/interactions/PatchNoteRepublishButton');
const { PatchNoteEditAttachmentsButton } = require('../buttons/interactions/PatchNoteEditAttachmentsButton');
const { PatchNoteEditCategoriesButton } = require('../buttons/interactions/PatchNoteEditCategoriesButton');

class PatchNoteButtonComponentTwo {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            SetPatchNoteVersionButton.create(lang),
            PatchNoteRepublishButton.create(lang),
            PatchNoteEditAttachmentsButton.create(lang),
            PatchNoteEditCategoriesButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteButtonComponentTwo = PatchNoteButtonComponentTwo;