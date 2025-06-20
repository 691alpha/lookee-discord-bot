const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteEditAttachmentsComponent } = require("../../components/PatchNoteEditAttachmentsComponent");
const { PatchNoteEditCategoriesComponent } = require("../../components/PatchNoteEditCategoriesComponent");

class PatchNoteEditCategoriesButton {
    static customId = "PatchNoteEditCategoriesButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteEditCategoriesButton.customId}`)
        .setLabel(LocalisationManager.getString('patchnote_edit_categories', lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;

        let outputContainer = await PatchNoteEditCategoriesComponent.create(lang);

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    }
}

module.exports.PatchNoteEditCategoriesButton = PatchNoteEditCategoriesButton;