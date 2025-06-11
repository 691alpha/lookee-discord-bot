const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchnoteUtils } = require('../utils/PatchnoteUtils');
const { PatchNoteVersionFormatCreatedComponent } = require('../components/responses/PatchNoteVersionFormatCreatedComponent');
const Formats = require('../database/models/Formats');
const Versions = require('../database/models/Versions');

class PatchNoteCreateVersionFormatModal {
    static customId = "PatchNoteCreateVersionFormatModal";
    
    static create(formatValue, lang) {
        
        const modal = new ModalBuilder()
            .setCustomId(PatchNoteCreateVersionFormatModal.customId)
            .setTitle(LocalisationManager.getString(
                'patchnote_create_version_format', 
                lang
            ));
		
        const input = new TextInputBuilder()
            .setCustomId(`patchNoteVersionFormatInput`)
            .setLabel(LocalisationManager.getString(
                'patchnote_create_version_format_label', 
                lang
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(0)
            .setMaxLength(50)
            .setValue(formatValue ?? "")
            .setRequired(true);
            
        modal.addComponents(new ActionRowBuilder().addComponents(input));
        
        return modal;
	}
    
    static async onSubmit(interaction) {
        
        const lang = interaction.locale;
        
		const { db } = interaction.client;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const newContent = interaction.fields.getTextInputValue("patchNoteVersionFormatInput");

        const createdFormat = await Formats.create({
            id: await db.getNextId('formats'),
            value: newContent
        });

        await Versions.create({
            id: await db.getNextId('versions'),
            formatId: createdFormat.id,
            major_number: 0,
            feature_number: 0,
            patch_number: 0,
            description: 'Initial version'
        });

        const container = await PatchNoteVersionFormatCreatedComponent.create(lang, newContent)

        await interaction.editReply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild.id, interaction.client, lang);

    }
}

module.exports.PatchNoteCreateVersionFormatModal = PatchNoteCreateVersionFormatModal;