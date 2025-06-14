const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteRepublishPickVersionModal } = require("../../modals/PatchNoteRepublishPickVersionModal");
const { PatchNoteSelectFormatRepublishMenu } = require("../../menus/PatchNoteSelectFormatRepublishMenu");
const Formats = require("../../database/models/Formats");

class PatchNoteRepublishButton {
    static customId = "PatchNoteRepublishButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(PatchNoteRepublishButton.customId)
            .setLabel(`${LocalisationManager.getString(
                'patchnote_republish_button_label', 
                lang
            )}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        const formats = await Formats.findAll();

        const selectMenu = await PatchNoteSelectFormatRepublishMenu.create(lang, formats);

        if (!selectMenu) {
            return interaction.reply({
                content: LocalisationManager.getString("patchnote_no_format_found", lang),
                flags: MessageFlags.Ephemeral
            });
        }

        return interaction.reply({
            content: LocalisationManager.getString("patchnote_select_format_republish_menu_title", lang),
            components: [
                new ActionRowBuilder().addComponents(selectMenu)
            ],
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PatchNoteRepublishButton = PatchNoteRepublishButton;
