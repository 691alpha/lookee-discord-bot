const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require("../../database/models/PatchNoteNodes");
const { PatchNoteComponent } = require("../../components/PatchNoteComponent");
const Setups = require("../../database/models/Setups");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");

class PatchNotePublishButton {
    static customId = "PatchNotePublishButton";

    static create(lang) {
        
        return new ButtonBuilder()
        .setCustomId(PatchNotePublishButton.customId)
        .setLabel(LocalisationManager.getString('create_patchnote_node_button', lang))
        .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const lang = interaction?.locale ?? 'en-US';

        const nodes = await PatchnoteUtils.findAllNodes(interaction.guild.id, lang, 'publish');

        if(!nodes.length) return;

        const container = await PatchNoteComponent.buildFromNodes(nodes, interaction);

        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });

        // handle if setup is not done.
        // Maybe make a setup manager?
        let {client} = interaction;

        const announcementChannel = client.channels.cache.get(setup.announcementChannelId);

        await announcementChannel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });

        for (const node of nodes) {
            node.status = 'published';
            await node.save();
        }

        return interaction.editReply(LocalisationManager.getString('patchnote_published', lang));
    }
}

module.exports.PatchNotePublishButton = PatchNotePublishButton;