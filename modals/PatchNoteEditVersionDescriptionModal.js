const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchnoteUtils } = require('../utils/PatchnoteUtils');
const { PatchNoteVersionDescriptionEditedComponent } = require('../components/responses/PatchNoteVersionDescriptionEditedComponent');
const Formats = require('../database/models/Formats');
const Versions = require('../database/models/Versions');

class PatchNoteEditVersionDescriptionModal {
    static customId = "PatchNoteEditVersionDescriptionModal";
    
    static create(lang) {
        
        const modal = new ModalBuilder()
        .setCustomId(PatchNoteEditVersionDescriptionModal.customId)
        .setTitle(LocalisationManager.getString(
            'patchnote_edit_version_description_modal_title', 
            lang
        ));
		
        const input = new TextInputBuilder()
        .setCustomId(`patchNoteVersionDescriptionInput`)
        .setLabel(LocalisationManager.getString(
            'patchnote_edit_version_description_modal_label', 
            lang
        ))
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(0)
        .setMaxLength(50)
        .setRequired(true);
            
        modal.addComponents(new ActionRowBuilder().addComponents(input));
        
        return modal;
	}
    
    static async onSubmit(interaction) {
        const lang = interaction.locale;
        
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const newDescription = interaction.fields.getTextInputValue(
            "patchNoteVersionDescriptionInput"
        );

        const latestEntry = await Versions.findOne({
            order: [['createdAt', 'DESC']],
        });

        await Versions.update(
            { description: newDescription },
            { where: { id: latestEntry.id } }
        );

        const container = await PatchNoteVersionDescriptionEditedComponent.create(
            lang, 
            newDescription
        )

        await interaction.editReply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });

    }
}

module.exports.PatchNoteEditVersionDescriptionModal = PatchNoteEditVersionDescriptionModal;