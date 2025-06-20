const { ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { PatchNoteAddNodeCategoryButton } = require('../buttons/interactions/PatchNoteAddNodeCategoryButton');
const { PatchNoteDeleteCategoryButton } = require('../buttons/interactions/PatchNoteDeleteCategoryButton');

class PatchNoteEditCategoriesComponent {
    static async create(lang) {
        const container = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `${LocalisationManager.getString('patchnote_edit_categories_component_text', lang)}`,
            ].join('\n'),
        );
        
        container.addTextDisplayComponents(text1);

        container.addActionRowComponents(row => row.addComponents(
            PatchNoteAddNodeCategoryButton.create(lang),
            PatchNoteDeleteCategoryButton.create(lang)
        ));

        return container;
    }
}

module.exports.PatchNoteEditCategoriesComponent = PatchNoteEditCategoriesComponent;