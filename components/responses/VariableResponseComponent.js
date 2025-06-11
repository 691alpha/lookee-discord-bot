const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class VariableResponseComponent {
    static create(placeholder, lang, variable) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString(placeholder, lang, variable)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.VariableResponseComponent = VariableResponseComponent;
