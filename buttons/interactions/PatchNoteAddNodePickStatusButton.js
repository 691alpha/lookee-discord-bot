const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const {PatchNoteAddNodeComponent} = require("../../components/PatchNoteAddNodeComponent")

class PatchNoteAddNodePickStatusButton {
    static customId = "PatchNoteAddNodePickStatusButton";

    static create(status, lang) {

        return new ButtonBuilder()
        .setCustomId(`${PatchNoteAddNodePickStatusButton.customId}`)
        .setLabel(LocalisationManager.getString('patchnote_node_pick_status'), lang)
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const lang = interaction?.locale ?? 'en-US';

        let outputContainer = await PatchNoteAddNodeComponent.create(lang);

        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        await interaction.followUp({
            components: [outputContainer],
            flags: MessageFlags.IsComponentsV2,
        })

        return;

    }
}

module.exports.PatchNoteAddNodePickStatusButton = PatchNoteAddNodePickStatusButton;