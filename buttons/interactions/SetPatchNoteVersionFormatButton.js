const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Formats = require('../../database/models/Formats');
const { PatchNoteCreateVersionFormatModal } = require('../../modals/PatchNoteCreateVersionFormatModal')

class SetPatchNoteVersionFormatButton {
    static customId = "SetPatchNoteVersionFormatButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(SetPatchNoteVersionFormatButton.customId)
            .setLabel(`${LocalisationManager.getString('set_patchnote_version_format_button_label', lang)}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction?.locale ?? 'en-US';

        return interaction.showModal(PatchNoteCreateVersionFormatModal.create(lang));

        // await interaction.reply({
        //     content: 'Please enter the **format** you want to set for the version formatting.',
        //     flags: MessageFlags.Ephemeral,
        // });

        // const collector = interaction.channel.createMessageCollector({
        //     filter: m => m.author.id === interaction.user.id,
        //     time: 30_000,
        //     max: 1
        // });

        // collector.on('collect', async (msg) => {

        //     const { db } = interaction.client;
    
        //     await Formats.create({
        //         id: await db.getNextId('formats'),
        //         format: msg.content
        //     });
    
        //     await interaction.reply({
        //         content: `Set patchnote version format to ${msg}.`,
        //         flags: MessageFlags.Ephemeral
        //     }); 
        // });

        // collector.on('end', (collected) => {
        //     if (collected.size === 0) {
        //         interaction.followUp({ 
        //             content: 'You did not provide a format in time.', 
        //             flags: MessageFlags.Ephemeral,
        //         });
        //     }
        // });
    }
}

module.exports.SetPatchNoteVersionFormatButton = SetPatchNoteVersionFormatButton;
