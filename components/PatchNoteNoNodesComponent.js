const {
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');

class PatchNoteNoNodesComponent {
    static async create(lang, action) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('patchnote_no_nodes', lang, {"action": action})}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteNoNodesComponent = PatchNoteNoNodesComponent;