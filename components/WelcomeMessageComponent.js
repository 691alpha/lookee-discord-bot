const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { ForwardToWebsiteButton } = require('../buttons/interactions/ForwardToWebsiteButton');
const { RulesButton } = require('../buttons/interactions/RulesButton');

class WelcomeMessageComponent {
    static async create(lang) {

        const container = new ContainerBuilder();

        const welcomeTitle = new TextDisplayBuilder().setContent(
            `### ${
                LocalisationManager.getString('welcome_message_title', lang)
            }`
        );

        const welcomeText = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('welcome_message_text', lang)}`,
                `${LocalisationManager.getString('welcome_message_links', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(welcomeTitle);
        container.addTextDisplayComponents(welcomeText);

        container.addActionRowComponents(row => row.addComponents(
            RulesButton.create(lang),
            ForwardToWebsiteButton.create(lang, 'https://sypher-project.com/', 'Sypher'),
            ForwardToWebsiteButton.create(lang, 'https://esylda.com/', 'Esylda'),
        ));

        return container;
    }
}

module.exports.WelcomeMessageComponent = WelcomeMessageComponent;