const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');

class SelectMenuComponent {
    static async create(placeholder, menu, lang, menuVariableOne, menuVariableTwo) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            `${LocalisationManager.getString(placeholder, lang)}`,
        );
        
        container.addTextDisplayComponents(text1);

        const createdMenu = await menu.create(lang, menuVariableOne, menuVariableTwo);
        container.addActionRowComponents(row => row.addComponents(createdMenu));

        return container;
    }
}

module.exports.SelectMenuComponent = SelectMenuComponent;
