const { ContainerBuilder,TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class UserNotFoundComponent {
    static async create(lang, userId) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString(
                    'selected_user_not_found', 
                    lang,
                    {"userId": userId}
                )}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.UserNotFoundComponent = UserNotFoundComponent;
