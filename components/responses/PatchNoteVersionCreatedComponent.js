const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class PatchNoteVersionCreatedComponent {
    static async create(lang, result) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `### ${LocalisationManager.getString('patchnote_version_created', lang)}`,
                `Id: ${result.id}`,
                `FormatId: ${result.formatId}`,
                `Majot number: ${result.major_number}`,
                `Feature number: ${result.feature_number}`,
                `Patch number: ${result.patch_number}`,
                `Description: ${result.description}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteVersionCreatedComponent = PatchNoteVersionCreatedComponent;