const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteTranslatePickLangSelectMenu } = require("../../menus/PatchNoteTranslatePickLangSelectMenu");
const { PatchNoteTranslatePickLangComponent } = require("../../components/PatchNoteTranslatePickLangComponent");

class PatchNoteTranslateButton {
    static customId = "PatchNoteTranslateButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteTranslateButton.customId}`)
        .setLabel(LocalisationManager.getString('patchnote_translate_button_label', lang))
        .setStyle(ButtonStyle.Primary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;

        let outputContainer = await PatchNoteTranslatePickLangComponent.create(lang);

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        })
    }
}

module.exports.PatchNoteTranslateButton = PatchNoteTranslateButton;