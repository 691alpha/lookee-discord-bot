const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteCreateVersionFormatModal } = require('../../modals/PatchNoteCreateVersionFormatModal');
const { format } = require("mysql2");
const Formats = require('../../database/models/Formats');
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class SetPatchNoteVersionFormatButton {
    static customId = "SetPatchNoteVersionFormatButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(SetPatchNoteVersionFormatButton.customId)
            .setLabel(`${LocalisationManager.getString(
                'set_patchnote_version_format_button_label', 
                lang
            )}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;

        const latestFormat= await Formats.findOne({
            order: [['createdAt', 'DESC']],
        });

        if(!latestFormat || latestFormat.length === 0) {
            
            
            return interaction.reply({
                components: [
                    NoVariableResponseComponent.create('latest_format_not_found', lang)
                ],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            })
        }

        return interaction.showModal(PatchNoteCreateVersionFormatModal.create(
            latestFormat.value, 
            lang
        ));
    }
}

module.exports.SetPatchNoteVersionFormatButton = SetPatchNoteVersionFormatButton;
