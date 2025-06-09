const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteAddNodeComponent } = require("../../components/PatchNoteAddNodeComponent")

class PatchNoteAddNodePickStatusButton {
    static customId = "PatchNoteAddNodePickStatusButton";

    static create( lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteAddNodePickStatusButton.customId}`)
        .setLabel(LocalisationManager.getString('patchnote_node_pick_status'), lang)
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction?.locale ?? 'en-US';

        let outputContainer = await PatchNoteAddNodeComponent.create(lang);

        return await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    }
}

module.exports.PatchNoteAddNodePickStatusButton = PatchNoteAddNodePickStatusButton;