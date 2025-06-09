const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteComponent } = require("../../components/PatchNoteComponent");
const Setups = require("../../database/models/Setups");
const Versions = require("../../database/models/Versions");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchnotePublishedComponent } = require("../../components/PatchnotePublishedComponent");
const Formats = require("../../database/models/Formats");

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

        const container = await PatchNoteComponent.create(nodes, interaction);

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

        const container2 = await PatchnotePublishedComponent.create(announcementChannel, interaction);

        const latestVersion = await Versions.findOne({ order: [['createdAt', 'DESC']] });

        if(!latestVersion.formatId) {
            await Formats.create({
                id: await interaction.client.db.getNextId('formats'),
                format: '{major}.{feature}.{patch}'
            })
        }

        const latestFormat = await Formats.findOne({ order: [['createdAt', 'DESC']] });

        await Versions.create({
            id: await interaction.client.db.getNextId('versions'),
            formatId: latestVersion?.formatId ?? latestFormat.id,
            major_number: latestVersion?.major_number ?? '0',
            feature_number: latestVersion?.feature_number ?? '0',
            patch_number: (parseInt(latestVersion?.patch_number ?? '0') + 1).toString(),
            description: 'Auto increment after publish'
        });



        PatchnoteUtils.updateAllPatchNotePreviews(interaction);
        
        return await interaction.editReply({
            components: [container2],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })

        // return interaction.editReply(LocalisationManager.getString('patchnote_published', lang));
    }
}

module.exports.PatchNotePublishButton = PatchNotePublishButton;