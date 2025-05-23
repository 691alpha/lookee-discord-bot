const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { PickSupportSelectionMenu } = require("../menus/PickSupportSelectionMenu");
const { LocalisationManager } = require("../managers/LocalisationManager");

class AddSupportTicketComponent {
    static async create(interaction) {
        const container = new ContainerBuilder();
        const lang = interaction?.locale ?? 'en-US';

        const text = new TextDisplayBuilder().setContent(
            LocalisationManager.getString('pick_user_for_support', lang)
        );

        container.addTextDisplayComponents(text);
        container.addActionRowComponents(row => row.addComponents(PickSupportSelectionMenu.create(lang)));

        return container;
    }
}

module.exports.AddSupportTicketComponent = AddSupportTicketComponent;
