const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { PatchNoteComponent } = require("../../components/PatchNoteComponent");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const { PatchnotePublishedComponent } = require("../../components/PatchnotePublishedComponent");
const { PatchNoteNoNodesComponent } = require("../../components/responses/PatchNoteNoNodesComponent");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const Setups = require("../../database/models/Setups");
const Versions = require("../../database/models/Versions");
const Formats = require("../../database/models/Formats");
const PatchNotes = require("../../database/models/PatchNotes");
const { PatchNoteTranslateButtonComponent } = require("../../components/PatchNoteTranslateButtonComponent");
const EPatchNoteStatus = require("../../enums/EPatchNoteStatus");
const PatchNoteAttachments = require("../../database/models/PatchNoteAttachments");

class PatchNotePublishButton {
    static customId = "PatchNotePublishButton";

    static create(lang) {
        
        return new ButtonBuilder()
        .setCustomId(PatchNotePublishButton.customId)
        .setLabel(LocalisationManager.getString('create_patchnote_node_button', lang))
        .setStyle(ButtonStyle.Success);
    }

    static async onInteraction(interaction) {

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const server = Setups.findOne({
            where: {guildId: interaction.guild.id}
        });
        const lang = server.defaultLang;
        let { client } = interaction;
        let announcementChannel;

        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });

        if (!setup) {
            const container = NoVariableResponseComponent.create(
                'patchnote_no_setup_found', 
                lang
            );

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }

        announcementChannel = client.channels.cache.get(setup.announcementChannelId);

        if (!announcementChannel) {
            const container = NoVariableResponseComponent.create(
                'patchnote_no_announcement_channel_found', 
                lang
            );

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }

        const nodes = await PatchnoteUtils.findAllNodes(
            interaction.guild.id,
            [EPatchNoteStatus.DONE, EPatchNoteStatus.PLANNED],
            false
        );

        if(!nodes || nodes.length === 0) {
            const container = await PatchNoteNoNodesComponent.create(lang, 'publish');

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        };

        const patchnoteId = await client.db.getNextId('patchnotes');

        const attachments = await PatchNoteAttachments.findAll({
            where: {
                guildId: interaction.guild.id,
                published: false,
                cleared: false
            }
        });
        
        const container = await PatchNoteComponent.create(
            nodes, 
            server.defaultLang,
            interaction.client.db,
            'publish', 
            interaction.guild, 
            patchnoteId,
            attachments
        );

        for(const attachment of attachments) {
            PatchNoteAttachments.update(
                {published: true},
                {where: {id: attachment.id}}
            )
        }

        const latestVersion = await Versions.findOne({ order: [['createdAt', 'DESC']] });
        
        if(!latestVersion || !latestVersion.id) {
            return interaction.reply("not good no version could be found schlecht");
        } 
        
        await PatchNotes.create({
            id: patchnoteId,
            publishedDate: Math.floor(Date.now()/1000),
            channelId: announcementChannel.id,
            versionId: latestVersion.id
        });

        const patchnoteMessage = await announcementChannel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });

        for (const node of nodes) {
            node.published = true;
            node.patchnoteId = patchnoteId;
            await node.save();
        }

        const containerPublished = await PatchnotePublishedComponent.create(
            'patchnote_published',
            patchnoteMessage,
            interaction.guild.id,
            lang
        );

        if(!containerPublished) {
            return interaction.editReply(
                LocalisationManager.getString('patchnote_send_failed', lang)
            )
        } 
        
        const latestFormat = await Formats.findOne({ order: [['createdAt', 'DESC']] });


        await Versions.create({
            id: await client.db.getNextId('versions'),
            formatId: latestVersion?.formatId ?? latestFormat.id,
            major_number: latestVersion?.major_number ?? '0',
            feature_number: latestVersion?.feature_number ?? '0',
            patch_number: (parseInt(latestVersion?.patch_number ?? '0') + 1).toString(),
            description: LocalisationManager.getString("db_default_version_desc", lang)
        });

        PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild, client, server.defaultLang);
        
        await interaction.editReply({
            components: [containerPublished],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })

    }
}

module.exports.PatchNotePublishButton = PatchNotePublishButton;
