const { ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder, flatten } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { VariableResponseComponent } = require("../../components/responses/VariableResponseComponent");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const { PatchnoteUtils } = require("../../utils/PatchnoteUtils");
const PatchNoteAttachments = require('../../database/models/PatchNoteAttachments');
const { ForwardToAttachmentsChannel } = require("./ForwardToAttachmentsChannel");
const Setups = require("../../database/models/Setups");

class PatchNoteAddImageButton {
    static customId = "PatchNoteAddImageButton";

    static create(lang) {

        return new ButtonBuilder()
            .setCustomId(PatchNoteAddImageButton.customId)
            .setLabel(LocalisationManager.getString(
                'patchnote_add_image_button_label', 
                lang
            ))
            .setStyle(ButtonStyle.Success);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction.locale;
        const {db} = interaction.client;
            
        const container = NoVariableResponseComponent.create(
            'patchnote_go_to_channel_container_text',
            lang
        );

        const setup = await Setups.findOne({where:{guildId: interaction.guild.id}});
        const attachmentChannel = interaction.client.channels.cache.get(setup.attachmentChannelId);
        if(!attachmentChannel) {
            const container = NoVariableResponseComponent.create('no_attachmentchannel', lang);
            interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            })
        }

        const row = new ActionRowBuilder()
                    .addComponents(ForwardToAttachmentsChannel.create(
                        attachmentChannel.id,
                        interaction.guild.id,
                        lang
                    ));

        await interaction.editReply({
            components: [container, row],
            flags: MessageFlags.IsComponentsV2
        });
        
        const sendContainer = VariableResponseComponent.create(
            'patchnote_add_image_container_text',
            lang,
            {'userId': interaction.user.id}
        );

        const sendAttachmentMessage = await attachmentChannel.send({
            components: [sendContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });
        if(!sendAttachmentMessage) {
            const container = NoVariableResponseComponent.create(
                'attachment_message_not_send',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            })
        }

        const filter = msg => msg.author.id === interaction.user.id && msg.attachments.size > 0;
    
        try {
            const collected = await attachmentChannel.awaitMessages({
                filter,
                max: 1,
                time: 60_000,
                errors: ['time']
            });

            let attachmentList = [];

            const msg = collected.first();
            const attachments = msg.attachments.values();

            const existingAttachments = await PatchNoteAttachments.findAll({
                where: {
                    published: false,
                    cleared: false
                }
            });

            if(existingAttachments.length > 10) {
                const container = NoVariableResponseComponent.create(
                    'patchnote_too_many_attachments',
                    lang
                );

                // await msg.delete();

                return interaction.editReply({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2]
                })
            }
            
            for(const attachment of attachments) {
                const attachmentUrl = attachment?.url;
                const nextAttachmentId = await db.getNextId('patchnote_attachments');
                attachmentList.push({
                    id: nextAttachmentId,
                    guildId: interaction.guild.id,
                    attachmentUrl: attachmentUrl,
                    patchnoteId: null,
                    published: false,
                    cleared: false
                });
            }

            const allAttachmentsLength = existingAttachments.length + attachmentList.length;

            if(allAttachmentsLength > 10) {
                const container = NoVariableResponseComponent.create(
                    'patchnote_too_many_attachments',
                    lang
                );

                // await msg.delete();

                return interaction.editReply({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2]
                })
            }

            await PatchNoteAttachments.bulkCreate(attachmentList);

            PatchnoteUtils.updateAllPatchNotePreviews(interaction.guild, interaction.client, lang);
            // Sleep 2 seconds.
            await new Promise(r => setTimeout(r, 2000));

            // await msg.delete();


            const container = VariableResponseComponent.create(
                'image_upload_success',
                lang,
                {
                    'attachmentListLength': attachmentList.length
                }
            );

            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

            
        } catch (err) {
            const container = NoVariableResponseComponent.create(
                'patchnote_image_upload_failed',
                lang
            )
            return interaction.followUp({
                components: [container],
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

module.exports.PatchNoteAddImageButton = PatchNoteAddImageButton;
