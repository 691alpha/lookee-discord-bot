const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class TicketLogPrivateMessageComponent {
    static async create(lang, guildName, ticket) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `## ${LocalisationManager.getString(
                    'ticket_log_private_message_title', 
                    lang,
                    {'username': ticket.discordUsername}
                )}`,
                `${LocalisationManager.getString(
                    'ticket_log_private_message', 
                    lang,
                    {'serverName': guildName, 'ticketId': ticket.id}
                )}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.TicketLogPrivateMessageComponent = TicketLogPrivateMessageComponent;