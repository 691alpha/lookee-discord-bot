const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteTranslatePickLangComponent } = require("../../components/PatchNoteTranslatePickLangComponent");

class PatchNoteTranslateButton {
    static customId = "PatchNoteTranslateButton";

    static create(lang, patchnoteId) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteTranslateButton.customId}:${patchnoteId}`)
        .setLabel(LocalisationManager.getString('patchnote_translate_button_label', lang))
        .setStyle(ButtonStyle.Primary);
    }

    static async onInteraction(interaction) {
        const customId = interaction.customId;
        const [prefix, patchnoteId] = customId.split(':');
        const lang = interaction.locale;

        let outputContainer = await PatchNoteTranslatePickLangComponent.create(lang, patchnoteId);

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        })
    }
}

module.exports.PatchNoteTranslateButton = PatchNoteTranslateButton;