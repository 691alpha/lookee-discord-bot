const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");

class PatchNoteTranslatePickLangSelectMenu {
    static customId = "PatchNoteTranslatePickLangSelectMenu";

    static create(lang) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(PatchNoteTranslatePickLangSelectMenu.customId)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_lang_de', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_lang_de_description', lang))
                    .setValue('lang_de'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(LocalisationManager.getString(
                        'patchnote_lang_fr', lang))
                    .setDescription(LocalisationManager.getString(
                        'patchnote_lang_fr_description', lang))
                    .setValue('lang_fr'),
            )
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(
                LocalisationManager.getString(
                    'patchnote_pick_lang_placeholder', lang)
            )

        return menu;
    }

    static async onInteraction(interaction) {
        const selectedLang = interaction.values;
        interaction.reply({
            content:`You choose the language ${selectedLang}. This feature is not yet implemented.`,
            flags: MessageFlags.Ephemeral
        })
    }
}

module.exports.PatchNoteTranslatePickLangSelectMenu = PatchNoteTranslatePickLangSelectMenu;
