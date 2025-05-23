const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { PickUserSelectionMenu } = require("../menus/PickUserSelectionMenu");
const { LocalisationManager } = require("../managers/LocalisationManager");

class PickUserComponent {
    static async create(interaction) {
        const container = new ContainerBuilder();

        const lang = interaction?.locale ?? 'en-US';

        const text1 = new TextDisplayBuilder().setContent(
            [
                ` ${LocalisationManager.getString('pick_user_to_add', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(PickUserSelectionMenu.create(lang)));

        return container;
    }
}

module.exports.PickUserComponent = PickUserComponent;