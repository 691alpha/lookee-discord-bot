const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { ForwardToPatchnoteButton } = require('../buttons/interactions/ForwardToPatchnoteButton');

class PatchnotePublishedComponent {
    static async create(placeholder, patchnoteMessage, guildId, lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `## ${LocalisationManager.getString(placeholder, lang)}`,
                `-# ${new Date().toLocaleString(lang, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(
            row => row.addComponents(
                ForwardToPatchnoteButton.create(
                    patchnoteMessage.id, 
                    patchnoteMessage.channel.id, 
                    guildId, 
                    lang
                )
            ));

        return container;
    }
}

module.exports.PatchnotePublishedComponent = PatchnotePublishedComponent;
