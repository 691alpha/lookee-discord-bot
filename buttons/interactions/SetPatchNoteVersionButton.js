const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteVersionButtonComponent } = require("../../components/PatchNoteVersionButtonComponent")

class SetPatchNoteVersionButton {
    static customId = "SetPatchNoteVersionButton";

    static create(lang) {

        return new ButtonBuilder()
        .setCustomId(`${SetPatchNoteVersionButton.customId}`)
        .setLabel(LocalisationManager.getString('patchnote_version_button', lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;

        let outputContainer = await PatchNoteVersionButtonComponent.create(lang);

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    }
}

module.exports.SetPatchNoteVersionButton = SetPatchNoteVersionButton;