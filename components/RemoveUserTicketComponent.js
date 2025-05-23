const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { PickUserRemoveSelectionMenu } = require("../menus/PickUserRemoveSelectionMenu");
const { LocalisationManager } = require("../managers/LocalisationManager");

class RemoveUserTicketComponent {
    static async create(interaction) {
        const container = new ContainerBuilder();
        const lang = interaction?.locale ?? 'en-US';

        const text = new TextDisplayBuilder().setContent(
            LocalisationManager.getString('pick_user_to_remove', lang)
        );

        container.addTextDisplayComponents(text);
        container.addActionRowComponents(row => 
            row.addComponents(
                PickUserRemoveSelectionMenu.create(interaction.channel, lang)
            )
        );

        return container;
    }
}

module.exports.RemoveUserTicketComponent = RemoveUserTicketComponent;
