const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');
const Versions = require('../database/models/Versions');
const Formats = require('../database/models/Formats');
const { PatchNoteTranslateButton } = require('../buttons/interactions/PatchNoteTranslateButton');
const { SuggestionButton } = require('../buttons/interactions/SuggestionButton');
const PatchNoteAttachments = require('../database/models/PatchNoteAttachments');
const PatchNoteCategories = require('../database/models/PatchNoteCategories');

class PatchNoteComponent {
    curr_categories = null;

    static async create(nodes, lang, db, mode, guild, patchnoteId, version, attachments) {
        const container = await PatchNoteComponent.buildFromNodes(
            nodes, 
            lang,
            db,
            mode, 
            guild, 
            patchnoteId,
            version,
            attachments
        );

        return container;
    }

    /**
     * Creates a component out of all given nodes formatted and a title
     * @param {*} nodes List of all nodes which should be in the patchnote
     * @param {*} lang Language
     * @returns Component with needed information for the patchnote
     */
    static async buildFromNodes(nodes, lang, db, mode, guild, patchnoteId, version, attachments) {
        const { PatchnoteUtils } = require('../utils/PatchnoteUtils');

        const container = new ContainerBuilder();
        const separator = new SeparatorBuilder().setDivider(true).setSpacing(2);
        const title = await PatchNoteComponent.createTitle(lang, mode, version);
        container.addTextDisplayComponents(title);

        PatchNoteComponent.curr_categories = await PatchNoteCategories.findAll({});
        
        const sortedNodes = {};
        const sortedOutputs = {};

        if(nodes.length == 0) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `${LocalisationManager.getString(
                        'patchnote_section_empty', 
                        lang
                    )}`
                )
            )
        }

        nodes.forEach(node => {
            // We assume a node always has a categoryId
            if( !sortedNodes[node.categoryId] ) 
                sortedNodes[node.categoryId] = []
            
            sortedNodes[node.categoryId].push(node)
        });

        // Build (nodes) final string
        for (const [categoryId, nodes] of Object.entries(sortedNodes)) {
            let category = PatchNoteComponent.findCategory(categoryId);
            if(!category) {
                category = await PatchNoteCategories.create({
                    id: await db.getNextId('patchnote_categories'),
                    name: 'Done',
                    guildId: guild.id
                });
            }
            if(!sortedOutputs[categoryId]) sortedOutputs[categoryId] = `### ${category.name}\n`;

            nodes.forEach((node) => {
                sortedOutputs[categoryId] += `- ${node.content}\n`;
            });
        }

        let index = 0;
        for (const [key, value] of Object.entries(sortedOutputs)) {
            index++;

            container.addTextDisplayComponents([new TextDisplayBuilder().setContent(value)]);

            // if(Object.keys(sortedOutputs).length == index) break;
            container.addSeparatorComponents(separator);
        }

        // If no nodes are found.
        // if(!sortedOutputs || sortedOutputs.length == 0) {
        //     container.addTextDisplayComponents(
        //         new TextDisplayBuilder().setContent(
        //             `${LocalisationManager.getString('patchnote_section_empty', lang)}`
        //         )
        //     )
        // }

        if(!attachments || attachments.length === 0) {
            attachments = await PatchNoteAttachments.findAll({
                where: {
                    guildId: guild.id,
                    published: false,
                    cleared: false
                }
            });
        }

        if(attachments.length != 0) {
            const mediaGallery = await PatchNoteComponent.createMediaGallery(attachments, guild);
            // container.addSeparatorComponents(separator);
            container.addMediaGalleryComponents(mediaGallery);
        }

        const notificationRole = await PatchnoteUtils.checkPatchnoteRole(guild)
        const notificationText = new TextDisplayBuilder().setContent([
            `-# ${LocalisationManager.getString('patchnotes_info_1', lang)}`,
            `-# ${LocalisationManager.getString('patchnotes_info_2', lang)}`,
            ``,
            `-# ${LocalisationManager.getString('patchnotes_info_3', lang,
                {'notificationRoleId': notificationRole.id})}`,
            `-# ${LocalisationManager.getString('patchnotes_info_4', lang)}`
            ].join('\n'),
        );

        if (mode != "edit") {

            const { PatchNoteGetPingRoleButton } = require(
                '../buttons/interactions/PatchNoteGetPingRoleButton'
            );

            container.addTextDisplayComponents(notificationText);
            container.addActionRowComponents(row => row.addComponents(
                SuggestionButton.create(lang),
                PatchNoteTranslateButton.create(lang, patchnoteId),
                PatchNoteGetPingRoleButton.create(lang),
            ));

            return container;
        } 

        return container;
        
    }

    static findCategory(categoryId) {
        let foundCategory = PatchNoteComponent.curr_categories.length > 0 
                            ? PatchNoteComponent.curr_categories[0] 
                            : null;
        
        PatchNoteComponent.curr_categories.forEach((category)=> {
            if(category.id == categoryId) return foundCategory = category;
        })

        return foundCategory;
    }

    static async createTitle(lang, mode, version) {
        // We assume we always have a version (since the version is
        // auto created on first launch).
        if (mode === 'republish') version = await Versions.findOne({
                where: {id: version.id} })
        else version = await Versions.findOne({
                order: [['createdAt', 'DESC']] });

        let formattedVersion = '';
        
        let format = await Formats.findOne({ where: { id: version.formatId } });
        let defaultFormat = '{major}.{feature}.{patch}';

        if (!format) format = defaultFormat;
        else format = format.value
        
        formattedVersion = format
            .replace('{major}', version.major_number)
            .replace('{feature}', version.feature_number)
            .replace('{patch}', version.patch_number);
    
        // Build title from version
        const title = new TextDisplayBuilder().setContent(
            `## ${LocalisationManager.getString('patchnote_title', lang)} \
${formattedVersion} \n<t:${Date.now()}:F>`);

        return title;
    }

    static async createMediaGallery(attachments) {
        const mediaGallery = new MediaGalleryBuilder();

        if(attachments.length != 0) {
            let mediaGalleryItems = [];
    
            for(const attachment of attachments) {
                mediaGalleryItems.push(new MediaGalleryItemBuilder().setURL(
                    attachment.attachmentUrl
                ));    
            }

            mediaGallery.addItems(mediaGalleryItems);
        }

        return mediaGallery;
    }
}

module.exports.PatchNoteComponent = PatchNoteComponent;