const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class ForwardToAttachmentsChannel {
    static customId = "ForwardToAttachmentsChannel";

    static create(attachmentChannelId, guildId, lang) {
        return new ButtonBuilder()
            .setLabel(LocalisationManager.getString('forward_attachmentchannel_button', lang))
            .setStyle(ButtonStyle.Link)
            .setURL(`discord://discord.com/channels/${guildId}/${attachmentChannelId}`)
    }

    static async onInteraction(interaction) {
        const [prefix, attachmentChannelId] = interaction.customId.split(":");

        if (!attachmentChannelId || !interaction.guild.channels.cache.has(attachmentChannelId.id)) {
            return interaction.reply({
                content: LocalisationManager.getString('no_channel_linked', lang),
                flags: MessageFlags.Ephemeral
            });
        }
        return;
    }
}

module.exports.ForwardToAttachmentsChannel = ForwardToAttachmentsChannel;