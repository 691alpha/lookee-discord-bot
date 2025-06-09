const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const Formats = require('../database/models/Formats');
const Versions = require('../database/models/Versions');
const { PatchnoteUtils } = require('../utils/PatchnoteUtils');
const { PatchNoteVersionFormatCreatedComponent } = require('../components/PatchNoteVersionFormatCreatedComponent');

class PatchNoteCreateVersionFormatModal {
    
    static customId = "PatchNoteCreateVersionFormatModal";
    
    static create(lang) {
        
        const modal = new ModalBuilder()
        .setCustomId(PatchNoteCreateVersionFormatModal.customId)
        .setTitle(LocalisationManager.getString('patchnote_create_version_format', lang));
		
        const input = new TextInputBuilder()
        .setCustomId(`patchNoteVersionFormatInput`)
        .setLabel(LocalisationManager.getString('patchnote_create_version_format_label', lang))
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(5)
        .setMaxLength(1000)
        .setRequired(true);
            
        modal.addComponents(new ActionRowBuilder().addComponents(input));
        
        return modal;
	}
    
    static async onSubmit(interaction) {
        
        const lang = interaction?.locale ?? 'en-US';
        
		const { db } = interaction.client;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const newContent = interaction.fields.getTextInputValue("patchNoteVersionFormatInput");

        await Formats.create({
            id: await db.getNextId('formats'),
            format: newContent
        });

        const latestEntry = await Versions.findOne({
            order: [['createdAt', 'DESC']],
        });

        const latestFormat = await Formats.findOne({ 
            order: [['createdAt', 'DESC']] 
        });

        await Versions.update(
            { formatId: latestFormat.id },
            { where: { id: latestEntry.id } }
        );

        const container = await PatchNoteVersionFormatCreatedComponent.create(lang, newContent)

        await interaction.editReply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });

        PatchnoteUtils.updateAllPatchNotePreviews(interaction);

    }
}

module.exports.PatchNoteCreateVersionFormatModal = PatchNoteCreateVersionFormatModal;