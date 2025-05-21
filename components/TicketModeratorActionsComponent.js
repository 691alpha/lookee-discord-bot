const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { AddUserTicketButton } = require("../buttons/interactions/AddUserTicketButton");
const { AssignModeratorButton } = require("../buttons/interactions/AssignModeratorButton");
const { AssignSelfModeratorButton } = require("../buttons/interactions/AssignSelfModeratorButton");

class TicketModeratorActionsComponent {
    static async create(interaction) {
        const container = new ContainerBuilder();

        const lang = interaction?.locale ?? 'en-US';

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('pick_moderator_action', lang)}`,
            ].join('\n'),
        );

        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(
            row => row.addComponents(
                AddUserTicketButton.create(lang),
                AssignModeratorButton.create(lang),
                AssignSelfModeratorButton.create(lang)

            ));

        return container;

    }
}

module.exports.TicketModeratorActionsComponent = TicketModeratorActionsComponent;