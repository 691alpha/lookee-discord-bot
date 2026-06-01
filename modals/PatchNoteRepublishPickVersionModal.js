const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const LanguageManager = require('../managers/LanguageManager');
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
        const lang = await LanguageManager.getServerLang(interaction.guild.id);
        const { client } = interaction;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        let major = interaction.fields.getTextInputValue("patchNoteRepublishVersionMajorInput");
        let feature = interaction.fields.getTextInputValue("patchNoteRepublishVersionFeatureInput");
        let patch = interaction.fields.getTextInputValue("patchNoteRepublishVersionPatchInput");

        const format = await Formats.findOne({ where: { id: formatId } });
        if (!format) {
            return interaction.editReply(NoVariableResponseComponent.create("format", lang));
        }

        major = parseInt(major);
        feature = parseInt(feature);
        patch = parseInt(patch);

        if(!major || !feature || !patch) {
            const container = NoVariableResponseComponent.create('patchnote_no_valid_number');
            
            interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            })
        }

        const version = await Versions.findOne({
            where: {
                formatId: formatId,
                major_number: major,
                feature_number: feature,
                patch_number: patch
            }
        });
        if (!version) {
            const container = NoVariableResponseComponent.create("version_not_found", lang)
            return interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2]
            });
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
            interaction.client.db,
            'republish',
            interaction.guild,
            patchnote.id,
            version
        );

        const patchnoteMessage = await channel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
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

        await interaction.editReply({
            components: [containerPublished],
            flags: [MessageFlags.IsComponentsV2],
        })

        return;
    }
}

module.exports.PatchNoteRepublishPickVersionModal = PatchNoteRepublishPickVersionModal;