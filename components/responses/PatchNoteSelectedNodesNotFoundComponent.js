const { ContainerBuilder,TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class PatchNoteSelectedNodesNotFoundComponent {
    static async create(lang) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString(
                    'patchnote_selected_nodes_not_found', 
                    lang
                )}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.PatchNoteSelectedNodesNotFoundComponent = PatchNoteSelectedNodesNotFoundComponent;
