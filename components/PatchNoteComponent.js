const {
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');
const PatchNoteNodes = require('../database/models/PatchNoteNodes');

class PatchNoteComponent {
    static async create(nodes, interaction) {
        //const container = new ContainerBuilder();

        const lang = interaction?.locale ?? 'en-US';

        // const text1 = new TextDisplayBuilder().setContent(
        //     [
        //         LocalisationManager.getString('patchnote_section_empty', lang)
        //     ].join('\n'),
        // );

        const container = PatchNoteComponent.buildFromNodes(nodes, interaction);
        
        //container.addTextDisplayComponents(text1);

        return container;
    }

    static async buildFromNodes(nodes, interaction) {
        const container = new ContainerBuilder();

        const lines = nodes.map((node, i) => {
            return `- ${node.content}`;
        });

        const lang = interaction?.locale ?? 'en-US';

        const output = lines.length > 0
            ? lines.join('\n')
            : LocalisationManager.getString('patchnote_section_empty', lang);

        const title = new TextDisplayBuilder().setContent(
                `**Patch Note** ${new Date().toLocaleString(lang, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })}`);

        const text = new TextDisplayBuilder().setContent(output);

        container.addTextDisplayComponents(title, text);
        return container;
    }
}

module.exports.PatchNoteComponent = PatchNoteComponent;