const { ContainerBuilder,TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../../managers/LocalisationManager');

class MembersNotFoundComponent {
    static async create(lang, variable) {

        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString(
                    'selected_members_not_found', 
                    lang,
                    {"memberSelectionVariable": variable}
                )}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        return container;
    }
}

module.exports.MembersNotFoundComponent = MembersNotFoundComponent;
