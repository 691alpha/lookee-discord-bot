const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchNoteClearAttachmentsButton } = require('../buttons/interactions/PatchNoteClearAttachmentsButton');
const { PatchNoteAddImageButton } = require('../buttons/interactions/PatchNoteAddImageButton');

class PatchNoteEditAttachmentsComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('patchnote_edit_attachments_component_text', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddImageButton.create(lang),
            PatchNoteClearAttachmentsButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteEditAttachmentsComponent = PatchNoteEditAttachmentsComponent;