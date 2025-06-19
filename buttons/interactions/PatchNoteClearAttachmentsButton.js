const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const PatchNoteAttachments = require('../../database/models/PatchNoteAttachments');
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { VariableResponseComponent } = require("../../components/responses/VariableResponseComponent");

class PatchNoteClearAttachmentsButton {
    static customId = "PatchNoteClearAttachmentsButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteClearAttachmentsButton.customId)
            .setLabel(LocalisationManager.getString(
                'patchnote_clear_image_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction.locale;

        const attachments = await PatchNoteAttachments.findAll({
            where: {
                guildId: interaction.guild.id,
                published: false,
                cleared: false
            }
        });

        for(const attachment of attachments) {
            attachment.update({
                cleared: true
            });
        }

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild, interaction.client, lang);

        const container = VariableResponseComponent.create(
            'patchnote_attachment_cleared_success',
            lang,
            {
                'attachmentListLength': attachments.length
            }
        );

        return interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2]
        })
    }
}

module.exports.PatchNoteClearAttachmentsButton = PatchNoteClearAttachmentsButton;
