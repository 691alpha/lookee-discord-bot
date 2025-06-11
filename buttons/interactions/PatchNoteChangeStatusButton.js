const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNotePickStatusComponent } = require("../../components/PatchNotePickStatusComponent");

class PatchNoteChangeStatusButton {
    static customId = "PatchNoteChangeStatusButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteChangeStatusButton.customId)
            .setLabel(LocalisationManager.getString(
                'patchnote_change_status_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction.locale;
            
        const container = PatchNotePickStatusComponent.create(lang, nodes, type)

        return await interaction.editReply({
            components: [container],
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PatchNoteChangeStatusButton = PatchNoteChangeStatusButton;
