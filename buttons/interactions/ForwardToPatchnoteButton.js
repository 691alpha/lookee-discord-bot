const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class ForwardToPatchnoteButton {
    static customId = "ForwardToPatchnoteButton";

    static create(messageId, channelId, guildId, lang) {
        return new ButtonBuilder()
            .setLabel(LocalisationManager.getString('forward_patchnote_button', lang))
            .setStyle(ButtonStyle.Link)
            .setURL(`discord://discord.com/channels/${guildId}/${channelId}/${messageId}`)
    }

    static async onInteraction(interaction) {
        const [prefix, messageId] = interaction.customId.split(":");

        if (!messageId || !interaction.guild.channels.cache.has(messageId.channel)) {
            return interaction.reply({
                content: LocalisationManager.getString('no_channel_linked', lang),
                flags: MessageFlags.Ephemeral
            });
        }

        return;

    }
}

module.exports.ForwardToPatchnoteButton = ForwardToPatchnoteButton;