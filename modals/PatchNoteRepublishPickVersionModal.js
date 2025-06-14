const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchnoteUtils } = require('../utils/PatchnoteUtils');
const { PatchNoteVersionFormatCreatedComponent } = require('../components/responses/PatchNoteVersionFormatCreatedComponent');
const Formats = require('../database/models/Formats');
const Versions = require('../database/models/Versions');
const PatchNotes = require('../database/models/PatchNotes');
const PatchNoteNodes = require('../database/models/PatchNoteNodes');
const Setups = require('../database/models/Setups');
const { NoVariableResponseComponent } = require('../components/responses/NoVariableResponseComponent');
const { PatchNoteComponent } = require('../components/PatchNoteComponent');
const { ModalManager } = require('../managers/ModalManager');
const { PatchnotePublishedComponent } = require('../components/PatchnotePublishedComponent');

class PatchNoteRepublishPickVersionModal {
    static customId = "PatchNoteRepublishPickVersionModal";
    
    static create(lang, formatId) {
        
        const modal = new ModalBuilder()
            .setCustomId(`${PatchNoteRepublishPickVersionModal.customId}/formatId=${formatId}`)
            .setTitle(LocalisationManager.getString(
                'patchnote_republish_pick_version_modal_title', 
                lang
            ));
		
        const inputMajor = new TextInputBuilder()
            .setCustomId(`patchNoteRepublishVersionMajorInput`)
            .setLabel(LocalisationManager.getString(
                'patchnote_republish_pick_version_modal_major_label', 
                lang
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(50)
            .setRequired(true);

        const inputFeature = new TextInputBuilder()
            .setCustomId(`patchNoteRepublishVersionFeatureInput`)
            .setLabel(LocalisationManager.getString(
                'patchnote_republish_pick_version_modal_feature_label', 
                lang
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(50)
            .setRequired(true);

        const inputPatch = new TextInputBuilder()
            .setCustomId(`patchNoteRepublishVersionPatchInput`)
            .setLabel(LocalisationManager.getString(
                'patchnote_republish_pick_version_modal_patch_label', 
                lang
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(50)
            .setRequired(true);
            
        modal.addComponents(
            new ActionRowBuilder().addComponents(inputMajor),
            new ActionRowBuilder().addComponents(inputFeature),
            new ActionRowBuilder().addComponents(inputPatch)
        );
        
        return modal;
	}
    
    static async onSubmit(interaction) {
        const customId = interaction.customId;
        const {params} = ModalManager.getCustomIdData(customId);
        const formatId = params.formatId.toString();
        const lang = interaction.locale;
        const { client } = interaction;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const major = interaction.fields.getTextInputValue("patchNoteRepublishVersionMajorInput");
        const feature = interaction.fields.getTextInputValue("patchNoteRepublishVersionFeatureInput");
        const patch = interaction.fields.getTextInputValue("patchNoteRepublishVersionPatchInput");

        const format = await Formats.findOne({ where: { id: formatId } });
        if (!format) {
            return interaction.editReply(NoVariableResponseComponent.create("format", lang));
        }

        const version = await Versions.findOne({
            where: {
                formatId: formatId,
                major_number: parseInt(major),
                feature_number: parseInt(feature),
                patch_number: parseInt(patch)
            }
        });
        if (!version) {
            return interaction.editReply(NoVariableResponseComponent.create("version", lang));
        }

        const patchnote = await PatchNotes.findOne({
            where: { versionId: version.id }
        });

        if (!patchnote) {
            return interaction.editReply(NoVariableResponseComponent.create("patchnote", lang));
        }

        const nodes = await PatchNoteNodes.findAll({
            where: { patchnoteId: patchnote.id }
        });

        const setup = await Setups.findOne({
            where: { guildId: interaction.guild.id }
        });

        if (!setup) {
            return interaction.editReply(NoVariableResponseComponent.create("patchnote_no_setup_found", lang));
        }

        const channel = client.channels.cache.get(setup.announcementChannelId);
        if (!channel) {
            return interaction.editReply(NoVariableResponseComponent.create("patchnote_no_announcement_channel_found", lang));
        }

        const container = await PatchNoteComponent.create(
            nodes, 
            lang, 
            'republish', 
            interaction.guild
        );

        await channel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });

        interaction.editReply({
            content: LocalisationManager.getString('patchnote_republish_success', lang)
        });

        const containerPublished = await PatchnotePublishedComponent.create(
            'patchnote_republished',
            patchnoteMessage,
            interaction.guild.id,
            lang
        );

        if(!containerPublished) {
            return interaction.editReply(
                LocalisationManager.getString('patchnote_send_failed', lang)
            )
        }

        return await interaction.editReply({
            components: [containerPublished],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    }
}

module.exports.PatchNoteRepublishPickVersionModal = PatchNoteRepublishPickVersionModal;