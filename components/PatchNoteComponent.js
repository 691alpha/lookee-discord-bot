const {
    ContainerBuilder,
    TextDisplayBuilder,
    Colors,
    SeparatorBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');
const Versions = require('../database/models/Versions');
const Formats = require('../database/models/Formats');

class PatchNoteComponent {
    static async create(nodes, interaction) {
        //const container = new ContainerBuilder();

        // const text1 = new TextDisplayBuilder().setContent(
        //     [
        //         LocalisationManager.getString('patchnote_section_empty', lang)
        //     ].join('\n'),
        // );

        const container = await PatchNoteComponent.buildFromNodes(nodes, interaction);

        container.setAccentColor(0x5e5e5e); 
        
        //container.addTextDisplayComponents(text1);

        return container;
    }

    /**
     * Creates a component out of all given nodes formatted and a title
     * @param {*} nodes List of all nodes which should be in the patchnote
     * @param {*} interaction 
     * @returns Component with needed information for the patchnote
     */
    static async buildFromNodes(nodes, interaction) {
        const container = new ContainerBuilder();
        const lang = interaction?.locale ?? 'en-US';

        // Gets all nodes with status 'planned' and 'done'
        const plannedNodes = nodes.filter(node => node.status === 'planned');
        const doneNodes = nodes.filter(node => node.status === 'done');

        // Makes list of all gotten nodes
        const plannedLines = plannedNodes.map(node => `- ${node.content}`);
        const doneLines = doneNodes.map(node => `- ${node.content}`);

        // Constructs output out of all lines
        const plannedOutput = plannedLines.length > 0 
            ? plannedLines.join('\n') 
            : LocalisationManager.getString('patchnote_section_empty', lang);

        const doneOutput = doneLines.length > 0 
            ? doneLines.join('\n') 
            : LocalisationManager.getString('patchnote_section_empty', lang);

        const separator = new SeparatorBuilder().setDivider(true).setSpacing(2);

        // Titles with full output nodes of each category
        const plannedText = new TextDisplayBuilder().setContent(
            `### ${LocalisationManager.getString('patchnote_section_planned', lang)}\n${plannedOutput}`
        );

        const doneText = new TextDisplayBuilder().setContent(
            `### ${LocalisationManager.getString('patchnote_section_done', lang)}\n${doneOutput}`
        );


        // const output = lines.length > 0
        //     ? lines.join('\n')
        //     : LocalisationManager.getString('patchnote_section_empty', lang);

        const version = await Versions.findOne({
                    order: [['createdAt', 'DESC']],
                });

        let formattedVersion = '';
        
        if (version?.formatId) {
            
            let format = await Formats.findOne({ where: { id: version.formatId } });
            let tmpformat;

            if(!format) {
                tmpformat = '{major}.{feature}.{patch}'
                formattedVersion = tmpformat
                    .replace('{major}', version.major_number)
                    .replace('{feature}', version.feature_number)
                    .replace('{patch}', version.patch_number);

            }

            if (format?.format) {
                formattedVersion = format.format
                    .replace('{major}', version.major_number)
                    .replace('{feature}', version.feature_number)
                    .replace('{patch}', version.patch_number);
            }
        }

        const title = new TextDisplayBuilder().setContent(
                `## Patchnote ${formattedVersion} \n ${new Date().toLocaleString(lang, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })}`);

        // const text = new TextDisplayBuilder().setContent(fullOutput);

        container.addTextDisplayComponents(title);
        container.addTextDisplayComponents(doneText);
        container.addSeparatorComponents(separator);
        container.addTextDisplayComponents(plannedText);

        return container;
    }
}

module.exports.PatchNoteComponent = PatchNoteComponent;