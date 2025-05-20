const {
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');

const { HelpTicketButton } = require('../buttons/interactions/HelpTicketButton');
const { LocalisationManager } = require('../managers/LocalisationManager');

class PickCategoryComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `# ${LocalisationManager.getString('pick_category', lang)}`,
                `${LocalisationManager.getString('pick_category_1', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(HelpTicketButton.create(lang)));

        return container;
    }
}

module.exports.PickCategoryComponent = PickCategoryComponent;