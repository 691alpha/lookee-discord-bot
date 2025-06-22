const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');

class PresentationComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const PresentationTitle = new TextDisplayBuilder().setContent(
            `### ${
                LocalisationManager.getString('presentation_title', lang)
            }`
        );

        const PresentationText = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('presentation_text_1', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(PresentationTitle);
        container.addTextDisplayComponents(PresentationText);

        return container;
    }
}

module.exports.PresentationComponent = PresentationComponent;