const { ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder } = require("discord.js");
const { PatchNoteSelectVersionValueMenu } = require("../../menus/PatchNoteSelectVersionValueMenu");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class PatchNoteIncreaseVersionButton {
    static customId = "PatchNoteIncreaseVersionButton";
    
        static create(lang) {
            return new ButtonBuilder()
                .setCustomId(PatchNoteIncreaseVersionButton.customId)
                .setLabel(LocalisationManager.getString('patchnote_increase_version_button_label', lang))
                .setStyle(ButtonStyle.Secondary);
        }
    
        static async onInteraction(interaction) {

            const lang = interaction?.locale ?? 'en-US';
        
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const selectMenu = PatchNoteSelectVersionValueMenu.create(lang);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.editReply({
                content: LocalisationManager.getString('patchnote_increase_version_placeholder', lang),
                components: [row]
            });
        }
}

module.exports.PatchNoteIncreaseVersionButton = PatchNoteIncreaseVersionButton;