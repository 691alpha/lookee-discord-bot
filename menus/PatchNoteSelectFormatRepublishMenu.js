const { StringSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchNoteRepublishPickVersionModal } = require("../modals/PatchNoteRepublishPickVersionModal");

class PatchNoteSelectFormatRepublishMenu {
    static customId = "PatchNoteSelectFormatRepublishMenu";

    static async create(lang, formats) {
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`${PatchNoteSelectFormatRepublishMenu.customId}`)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(LocalisationManager.getString(
                'patchnote_select_format_republish_menu_placeholder', 
                lang
            ));

        if (!formats || formats.length === 0) {
            return null;
        }

        menu.addOptions(
            formats.slice(0, 30).map(format => ({
                label: format.value.slice(0, 80),
                value: format.id.toString()
            }))
        );

        return menu;
    }

    static async onInteraction(interaction) {

        // We assume that this code ensures that we never get an empty array
        const selectedFormat = interaction.values[0];

        const lang = interaction.locale;

        return interaction.showModal(PatchNoteRepublishPickVersionModal.create(
            lang,
            selectedFormat
        ));
    }
}

module.exports.PatchNoteSelectFormatRepublishMenu = PatchNoteSelectFormatRepublishMenu;
