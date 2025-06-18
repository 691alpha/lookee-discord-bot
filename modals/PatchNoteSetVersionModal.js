const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { NoVariableResponseComponent } = require('../components/responses/NoVariableResponseComponent');
const Versions = require('../database/models/Versions');

class PatchNoteSetVersionModal {
    static customId = "PatchNoteSetVersionModal";

    static create(lang) {

        const modal = new ModalBuilder()
            .setCustomId(`${PatchNoteSetVersionModal.customId}`)
            .setTitle(LocalisationManager.getString(
                'patchnote_set_version_modal_title',
                lang
            ));

        const inputMajor = new TextInputBuilder()
            .setCustomId(`patchnoteSetVersionMajorInput`)
            .setLabel(LocalisationManager.getString(
                'patchnote_republish_pick_version_modal_major_label',
                lang
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(50)
            .setRequired(true);

        const inputFeature = new TextInputBuilder()
            .setCustomId(`patchnoteSetVersionFeatureInput`)
            .setLabel(LocalisationManager.getString(
                'patchnote_republish_pick_version_modal_feature_label',
                lang
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(50)
            .setRequired(true);

        const inputPatch = new TextInputBuilder()
            .setCustomId(`patchnoteSetVersionPatchInput`)
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
        const lang = interaction.locale;
        const { client } = interaction;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const major = parseInt(interaction.fields.getTextInputValue("patchnoteSetVersionMajorInput"));
        const feature = parseInt(interaction.fields.getTextInputValue("patchnoteSetVersionFeatureInput"));
        const patch = parseInt(interaction.fields.getTextInputValue("patchnoteSetVersionPatchInput"));

        if (!major || !feature || !patch) {
            const container = NoVariableResponseComponent.create('patchnote_no_valid_number');

            interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            })
        }

        const latestVersion = await Versions.findOne({ order: [['createdAt', 'DESC']] });

        if (!latestVersion || !latestVersion.id) {
            return interaction.editReply(LocalisationManager.getString('patchnote_no_version_found', lang));
        }

        const newVersion = Versions.create({
            id: await client.db.getNextId('versions'),
            formatId: latestVersion.formatId ?? '{major}.{feature}.{patch}',
            major_number: major,
            feature_number: feature,
            patch_number: patch,
            description: latestVersion.description ?? LocalisationManager.getString("db_default_version_desc", lang)
        });

        if (!newVersion) {
            return interaction.editReply(LocalisationManager.getString('patchnote_set_version_failed', lang));
        }

        const container = NoVariableResponseComponent.create('patchnote_set_version_success', {
            major: major,
            feature: feature,
            patch: patch
        });

        interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
}

module.exports.PatchNoteSetVersionModal = PatchNoteSetVersionModal;