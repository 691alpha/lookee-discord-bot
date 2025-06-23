const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { AddTicketCategoryButton } = require('../buttons/interactions/AddTicketCategoryButton');
const { TicketDeleteCategoryButton } = require('../buttons/interactions/TicketDeleteCategoryButton');

class TicketCategoryComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `# ${LocalisationManager.getString('ticket_category_component_text', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            AddTicketCategoryButton.create(lang),
            TicketDeleteCategoryButton.create(lang)
        ));

        return container;
    }
}

module.exports.TicketCategoryComponent = TicketCategoryComponent;