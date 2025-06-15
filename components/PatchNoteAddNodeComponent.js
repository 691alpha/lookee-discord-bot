const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchNoteAddNodeModalButton } = require('../buttons/interactions/PatchNoteAddNodeModalButton');
const { EPatchNoteStatus } = require('../enums/EPatchNoteStatus');

class PatchNoteAddNodeComponent {
    static async create(lang) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `### ${LocalisationManager.getString('add_patchnote_node', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodeModalButton.create(EPatchNoteStatus.PLANNED, lang),
            PatchNoteAddNodeModalButton.create(EPatchNoteStatus.DONE, lang)
        ));

        return container;
    }
}

module.exports.PatchNoteAddNodeComponent = PatchNoteAddNodeComponent;