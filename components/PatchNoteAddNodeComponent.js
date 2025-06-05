const {
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchNoteAddNodeModalButton } = require('../buttons/interactions/PatchNoteAddNodeModalButton');

class PatchNoteAddNodeComponent {
    static async create(interaction) {

        const container = new ContainerBuilder();

        const lang = interaction?.locale ?? 'en-US';

        const text1 = new TextDisplayBuilder().setContent(
            [
                `# ${LocalisationManager.getString('add_patchnote_node', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodeModalButton.create('planned', lang),
            PatchNoteAddNodeModalButton.create('done', lang)
        ));

        return container;
    }
}

module.exports.PatchNoteAddNodeComponent = PatchNoteAddNodeComponent;