const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNotePickStatusComponent } = require("../../components/PatchNotePickStatusComponent");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class PatchNoteAddImageButton {
    static customId = "PatchNoteAddImageButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteAddImageButton.customId)
            .setLabel(LocalisationManager.getString(
                'patchnote_add_image_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction.locale;
            
        const container = NoVariableResponseComponent.create(
            'patchnote_add_image_container_text'
        )

        return await interaction.editReply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.PatchNoteAddImageButton = PatchNoteAddImageButton;
