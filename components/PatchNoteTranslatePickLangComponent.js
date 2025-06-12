const { ContainerBuilder, TextDisplayBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { PatchNoteTranslatePickLangSelectMenu } = require("../menus/PatchNoteTranslatePickLangSelectMenu");

class PatchNoteTranslatePickLangComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                ` ${LocalisationManager.getString('patchnote_pick_lang_component', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteTranslatePickLangSelectMenu.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteTranslatePickLangComponent = PatchNoteTranslatePickLangComponent;