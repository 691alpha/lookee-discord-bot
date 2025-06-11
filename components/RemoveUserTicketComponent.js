const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { PickUserRemoveSelectionMenu } = require("../menus/PickUserRemoveSelectionMenu");
const { LocalisationManager } = require("../managers/LocalisationManager");

class RemoveUserTicketComponent {
    static async create(channel, lang) {
        const container = new ContainerBuilder();

        const text = new TextDisplayBuilder().setContent(
            LocalisationManager.getString('pick_user_to_remove', lang)
        );

        container.addTextDisplayComponents(text);
        container.addActionRowComponents(row => 
            row.addComponents(
                PickUserRemoveSelectionMenu.create(channel, lang)
            )
        );

        return container;
    }
}

module.exports.RemoveUserTicketComponent = RemoveUserTicketComponent;
