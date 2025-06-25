const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { CreateTicketButton } = require('../buttons/interactions/CreateTicketButton');
const { LocalisationManager } = require('../managers/LocalisationManager');

class CreateTicketComponent {
    static async create(lang, announcementChannelId) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `## ${LocalisationManager.getString('create_ticket', lang)}`,
                `### ${LocalisationManager.getString('create_ticket_1', lang)}`,
                `-# ${LocalisationManager.getString(
                    'create_ticket_2', 
                    lang,
                    {'patchnoteChannel': announcementChannelId}
                )}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(CreateTicketButton.create(lang)));

        return container;
    }
}

module.exports.CreateTicketComponent = CreateTicketComponent;