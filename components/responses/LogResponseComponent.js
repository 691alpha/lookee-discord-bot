const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class LogResponseComponent {
    static create(placeholder, lang, color, variable) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString(placeholder, lang, variable)}`,
            ].join('\n'),
        );
        
        container.setAccentColor(color)
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.LogResponseComponent = LogResponseComponent;
