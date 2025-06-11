const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { PickUserSelectionMenu } = require("../menus/PickUserSelectionMenu");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PickModeratorSelectionMenu } = require("../menus/PickModeratorSelectionMenu");

class AssignModeratorComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                ` ${LocalisationManager.getString('pick_user_for_mod', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            PickModeratorSelectionMenu.create(lang)
        ));

        return container;
    }
}

module.exports.AssignModeratorComponent = AssignModeratorComponent;