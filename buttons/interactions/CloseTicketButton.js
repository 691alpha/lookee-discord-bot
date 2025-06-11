const { ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField, ActionRowBuilder } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { ReopenTicketButton } = require("../interactions/ReopenTicketButton");
const { EmbedManager } = require("../../managers/EmbedManager");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class CloseTicketButton {
    static customId = "CloseTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(CloseTicketButton.customId)
            .setLabel(LocalisationManager.getString('ticket_close', lang))
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        TicketUtils.moveTicketToCategory(
            interaction.guild, 
            ticket.id, 
            interaction.channel, 
            'closed'
        );

        const row = new ActionRowBuilder()
                    .addComponents(ReopenTicketButton.create(lang));

        let outputEmbed = EmbedManager.getEmbed('ticketChannel.movedToClosed');

        interaction.reply({ embeds: [outputEmbed], components: [row]});

    }

}

module.exports.CloseTicketButton = CloseTicketButton;
