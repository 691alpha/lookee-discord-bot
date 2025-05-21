const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { CloseTicketButton } = require('../buttons/interactions/CloseTicketButton');

class TicketCreationSuccessChannelComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `# ${LocalisationManager.getString('ticket_created_channel', lang)}`,
                `# ${LocalisationManager.getString('ticket_created_channel_1', lang)}`,
                `# ${LocalisationManager.getString('ticket_created_channel_close', lang)}`,
            ].join('\n'),
        );

        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(
            row => row.addComponents(
                CloseTicketButton.create(lang)
            ));

        return container;
    }
}

module.exports.TicketCreationSuccessChannelComponent = TicketCreationSuccessChannelComponent;