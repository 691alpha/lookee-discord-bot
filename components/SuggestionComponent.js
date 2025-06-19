const {
    ContainerBuilder,
    TextDisplayBuilder,
} = require('discord.js');

const { LocalisationManager } = require('../managers/LocalisationManager');

class SuggestionComponent {
    static async create(content, author, lang) {
        const container = new ContainerBuilder();
        const suggestionTitle = new TextDisplayBuilder().setContent(
            `### ${
                LocalisationManager.getString(
                'suggestion_comopnent_title', 
                lang)
            }${author.username} (${author.id})
            \n ${new Date().toLocaleString(lang, {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })}`
        );
        const contentText = new TextDisplayBuilder().setContent(
            content
        );

        container.addTextDisplayComponents(suggestionTitle);
        container.addTextDisplayComponents(contentText);

        return container;
    }
}

module.exports.SuggestionComponent = SuggestionComponent;