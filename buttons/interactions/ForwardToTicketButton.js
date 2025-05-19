const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");

class ForwardToTicketButton {
    static customId = "ForwardToTicketButton";

    static create(channelId, guildId) {
        return new ButtonBuilder()
            .setLabel('Ticket')
            .setStyle(ButtonStyle.Link)
            .setURL(`discord://discord.com/channels/${guildId}/${channelId}`)
    }

    static async onInteraction(interaction) {
        const [prefix, channelId] = interaction.customId.split(":");

        if (!channelId || !interaction.guild.channels.cache.has(channelId)) {
            return interaction.reply({
                content: "There is no channel linked to this button.",
                flags: MessageFlags.Ephemeral
            });
        }

        return;

    }
}

module.exports.ForwardToTicketButton = ForwardToTicketButton;