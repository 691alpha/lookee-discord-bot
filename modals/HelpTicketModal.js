const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const ChannelUtils = require('../utils/ChannelUtils');

class HelpTicketModal {
    static create () {

        const modal = new ModalBuilder()
            .setCustomId('HelpTicketModal')
            .setTitle('Create Help Ticket');

        const title = new TextInputBuilder()
        .setMinLength(0)
        .setMaxLength(40)
        .setCustomId('helpTicketModalTitle')
        .setPlaceholder('Title')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setMinLength(10)
            .setMaxLength(1_000)
            .setCustomId('helpTicketModalDescription')
            .setPlaceholder('Description')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(title, description);

        modal.addComponents(firstActionRow);

        return modal;
    }

    static onSubmit(interaction) {

        ChannelUtils.createChannel(interaction, HelpTickets, interaction.user.name);

        let outputEmbed = EmbedManager.getEmbed('ticketChannel.help');

        interaction.reply({ embeds: [outputEmbed], ephemeral: true });
    }
}

module.exports.HelpTicketModal = HelpTicketModal;