const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteComponent } = require("../../components/PatchNoteComponent");
const Setups = require("../../database/models/Setups");
const Versions = require("../../database/models/Versions");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchnotePublishedComponent } = require("../../components/PatchnotePublishedComponent");
const Formats = require("../../database/models/Formats");
const { PatchNoteNoNodesComponent } = require("../../components/responses/PatchNoteNoNodesComponent");
const { PatchNoteNoAnnouncementChannelComponent } = require("../../components/responses/PatchNoteNoAnnouncementChannelComponent");
const { PatchNoteNoSetupComponent } = require("../../components/responses/PatchNoteNoSetupComponent");

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
        let { client } = interaction;
        let announcementChannel;

        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });

        if (!setup) {
            const container = await PatchNoteNoSetupComponent.create(lang);

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }

        announcementChannel = client.channels.cache.get(setup.announcementChannelId);

        if (!announcementChannel) {
            const container = await PatchNoteNoAnnouncementChannelComponent.create(lang);

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }

        const nodes = await PatchnoteUtils.findAllNodes(
            interaction.guild.id
        );

        if(!nodes || nodes.length === 0) {
            const container = await PatchNoteNoNodesComponent.create(lang, 'publish');

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        };

        const container = await PatchNoteComponent.create(nodes, lang);

        await announcementChannel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });

        for (const node of nodes) {
            node.status = 'published';
            await node.save();
        }

        const containerPublished = await PatchnotePublishedComponent.create(
            announcementChannel,
            interaction.guild.id,
            lang
        );

        if(!containerPublished) {
            return interaction.editReply(
                LocalisationManager.getString('patchnote_send_failed', lang)
            )
        } 

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
            // LocalisationManager not used since it's a value that is the same for everyone
            description: 'Auto increment after publish'
        });

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild.id, interaction.client, lang);
        
        await interaction.editReply({
            components: [containerPublished],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    
        if(!announcementChannel) {
            const containerNoAnnouncement = await PatchNoteNoAnnouncementChannelComponent.create(
                lang
            );
    
            await interaction.editReply({
                components: [containerNoAnnouncement],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
            return;

        }
    }
}

module.exports.PatchNotePublishButton = PatchNotePublishButton;
