const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class PatchNoteVersionDescriptionEditedComponent {
    static async create(lang, result) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `### ${LocalisationManager.getString(
                    'patchnote_version_description_updated', 
                    lang
                )}`,
                `${LocalisationManager.getString(
                    'description_label', 
                    lang
                )} ${result}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteVersionDescriptionEditedComponent = PatchNoteVersionDescriptionEditedComponent;