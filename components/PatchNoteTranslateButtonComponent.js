const {
    ContainerBuilder,
} = require('discord.js');

const { PatchNoteTranslateButton } = require('../buttons/interactions/PatchNoteTranslateButton');

class PatchNoteTranslateButtonComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteTranslateButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteTranslateButtonComponent = PatchNoteTranslateButtonComponent;