const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class ForwardToTicketButton {
    static customId = "ForwardToTicketButton";

    static create(channelId, guildId, lang) {
        return new ButtonBuilder()
            .setLabel(LocalisationManager.getString('forward_ticket_button', lang))
            .setStyle(ButtonStyle.Link)
            .setURL(`discord://discord.com/channels/${guildId}/${channelId}`)
    }

    static async onInteraction(interaction) {
        const [prefix, channelId] = interaction.customId.split(":");

        if (!channelId || !interaction.guild.channels.cache.has(channelId)) {
            return interaction.reply({
                content: LocalisationManager.getString('no_channel_linked', lang),
                flags: MessageFlags.Ephemeral
            });
        }

        return;

    }
}

module.exports.ForwardToTicketButton = ForwardToTicketButton;