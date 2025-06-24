const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { AddUserTicketButton } = require("../buttons/interactions/AddUserTicketButton");
const { AssignModeratorButton } = require("../buttons/interactions/AssignModeratorButton");
const { AssignSelfModeratorButton } = require("../buttons/interactions/AssignSelfModeratorButton");
const { AddSupporterTicketButton } = require("../buttons/interactions/AddSupporterTicketButton");
const { RemoveUserTicketButton } = require("../buttons/interactions/RemoveUserTicketButton");

class TicketModeratorActionsComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('pick_moderator_action', lang)}`,
            ].join('\n'),
        );

        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(
            row => row.addComponents(
                AddUserTicketButton.create(lang),
                RemoveUserTicketButton.create(lang),
                AssignModeratorButton.create(lang),
                AddSupporterTicketButton.create(lang),
                AssignSelfModeratorButton.create(lang),
            ));

        return container;

    }
}

module.exports.TicketModeratorActionsComponent = TicketModeratorActionsComponent;