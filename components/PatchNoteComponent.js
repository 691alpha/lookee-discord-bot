const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');
const Versions = require('../database/models/Versions');
const Formats = require('../database/models/Formats');
const { PatchNoteTranslateButton } = require('../buttons/interactions/PatchNoteTranslateButton');

class PatchNoteComponent {
    static async create(nodes, lang, mode, guild) {
        const container = await PatchNoteComponent.buildFromNodes(nodes, lang, mode, guild);

        // container.setAccentColor(0x5e5e5e); 

        return container;
    }

    /**
     * Creates a component out of all given nodes formatted and a title
     * @param {*} nodes List of all nodes which should be in the patchnote
     * @param {*} lang Language
     * @returns Component with needed information for the patchnote
     */
    static async buildFromNodes(nodes, lang, mode, guild) {
        const { PatchnoteUtils } = require('../utils/PatchnoteUtils');

        const container = new ContainerBuilder();

        let plannedNodes;
        let doneNodes;

        if(mode === 'republish') {
            plannedNodes = nodes.filter(node => 
                node.status === 'planned' 
                && node.published);
            doneNodes = nodes.filter(node => 
                node.status === 'done'
                && node.published
            );
        } else {
            // Gets all nodes with status 'planned' and 'done'
            plannedNodes = nodes.filter(node => 
                node.status === 'planned' 
                && !node.published);
            doneNodes = nodes.filter(node => 
                node.status === 'done'
                && !node.published
            );
        }


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

            } else if (format.value) {
                formattedVersion = format.value
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
        if(mode === 'edit') {
            container.addTextDisplayComponents(title);
            container.addTextDisplayComponents(doneText);
            container.addSeparatorComponents(separator);
            container.addTextDisplayComponents(plannedText); 
            
            return container;
        }

        const { PatchNoteGetPingRoleButton } = require(
            '../buttons/interactions/PatchNoteGetPingRoleButton'
        );
                
        const newRole = await PatchnoteUtils.checkPatchnoteRole(guild);
        const pingText = new TextDisplayBuilder().setContent([
            `-# Patch notes will be released whenever changes are made to the server.`,
            `-# These updates won’t follow a strict schedule — they're simply here to keep everyone informed.`,
            ``,
            `-# To obtain the role <@&${newRole.id}> to be notified about future patch notes,`,
            `-# click the button below.`
            ].join('\n'),
        );

        if(plannedLines.length < 1) {
            container.addTextDisplayComponents(title);
            container.addTextDisplayComponents(doneText);
            container.addTextDisplayComponents(pingText);
            container.addActionRowComponents(row => row.addComponents(
                PatchNoteTranslateButton.create(lang),
                PatchNoteGetPingRoleButton.create(lang)
            ));
        } else if(doneLines.length < 1) {
            container.addTextDisplayComponents(title);
            container.addTextDisplayComponents(plannedText);
            container.addTextDisplayComponents(pingText);
            container.addActionRowComponents(row => row.addComponents(
                PatchNoteTranslateButton.create(lang),
                PatchNoteGetPingRoleButton.create(lang)
            ));
        } else {
            container.addTextDisplayComponents(title);
            container.addTextDisplayComponents(doneText);
            container.addSeparatorComponents(separator);
            container.addTextDisplayComponents(plannedText); 
            container.addTextDisplayComponents(pingText);
            container.addActionRowComponents(row => row.addComponents(
                PatchNoteTranslateButton.create(lang),
                PatchNoteGetPingRoleButton.create(lang)
            ));
        }
        

        return container;
    }
}

module.exports.PatchNoteComponent = PatchNoteComponent;