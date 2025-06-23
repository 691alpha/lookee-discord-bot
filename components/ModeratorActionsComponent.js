const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { TicketCategoryButton } = require('../buttons/interactions/TicketCategoryButton');

class ModeratorActionsComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `# ${LocalisationManager.getString('moderator_actions_component_text', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            TicketCategoryButton.create(lang),
        ));

        return container;
    }
}

module.exports.ModeratorActionsComponent = ModeratorActionsComponent;