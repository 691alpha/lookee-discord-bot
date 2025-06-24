const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteEditAttachmentsComponent } = require("../../components/PatchNoteEditAttachmentsComponent")

class PatchNoteEditAttachmentsButton {
    static customId = "PatchNoteEditAttachmentsButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteEditAttachmentsButton.customId}`)
        .setEmoji('1387102782665785365')
        .setLabel(LocalisationManager.getString('patchnote_edit_attachments', lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;

        let outputContainer = await PatchNoteEditAttachmentsComponent.create(lang);

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    }
}

module.exports.PatchNoteEditAttachmentsButton = PatchNoteEditAttachmentsButton;