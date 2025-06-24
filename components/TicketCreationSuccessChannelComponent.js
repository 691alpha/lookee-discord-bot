const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { CloseTicketButton } = require('../buttons/interactions/CloseTicketButton');
const Tickets = require("../database/models/Tickets");
const { TicketSendLogButton } = require("../buttons/interactions/TicketSendLogButton");

class TicketCreationSuccessChannelComponent {
    static async create(lang, newTicket) {
        const container = new ContainerBuilder();

        const ticket = await Tickets.findOne({
            where: {channelId: newTicket.channelId}
        });

        const text1 = new TextDisplayBuilder().setContent(
            [
                `### ${LocalisationManager.getString(
                    'ticket_created_channel', 
                    lang, 
                    {'userId': ticket.userId}
                )}`,
                `-# ${LocalisationManager.getString(
                    'ticket_record_info', 
                    lang
                )}`,
                `### ${LocalisationManager.getString(
                    'ticket_created_channel_details', 
                    lang,
                    {'title': ticket.title, 'description': ticket.description}
                )}\n\n`,
                `-# ${LocalisationManager.getString('ticket_created_channel_close', lang)}`,
            ].join('\n'),
        );

        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(
            row => row.addComponents(
                CloseTicketButton.create(lang),
                TicketSendLogButton.create(lang)
            ));

        return container;
    }
}

module.exports.TicketCreationSuccessChannelComponent = TicketCreationSuccessChannelComponent;