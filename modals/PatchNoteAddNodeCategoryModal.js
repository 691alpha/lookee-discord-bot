const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const PatchNoteCategories = require('../database/models/PatchNoteCategories');
const NoVariableResponseComponent = require('../components/responses/NoVariableResponseComponent');
const { VariableResponseComponent } = require('../components/responses/VariableResponseComponent');

class PatchNoteAddNodeCategoryModal {
    static customId = "PatchNoteAddNodeCategoryModal";
    
    static create(lang) {
        
        const modal = new ModalBuilder()
        .setCustomId(`${PatchNoteAddNodeCategoryModal.customId}`)
        .setTitle(LocalisationManager.getString('patchnote_add_node_catagory_modal_title', lang));
		
        const input = new TextInputBuilder()
        .setCustomId(`patchnoteAddCategoryInput`)
        .setLabel(LocalisationManager.getString(
            'patchnote_add_node_category_input_label', 
            lang
        ))
        .setStyle(TextInputStyle.Short)
        .setMinLength(5)
        .setMaxLength(45)
        .setRequired(true);
        
        modal.addComponents(new ActionRowBuilder().addComponents(input));
        
        
        return modal;
	}
    
    static async onSubmit(interaction) {
        const {db} = interaction.client;
        const lang = interaction.locale;
        const newCategory = interaction.fields.getTextInputValue('patchnoteAddCategoryInput');

        const sameCategory = await PatchNoteCategories.findAll({
            where: {
                name: newCategory
            }
        });

        if(sameCategory && sameCategory.length > 0) {
            const container = NoVariableResponseComponent.create(
                'patchnote_category_already_exists',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        const createdCategory = await PatchNoteCategories.create({
            id: await db.getNextId('patchnote_categories'),
            name: newCategory,
            guildId: interaction.guild.id
        });

        if(!createdCategory) {
            const container = NoVariableResponseComponent.create(
                'patchnode_add_category_failed',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        const container = VariableResponseComponent.create(
            'patchnote_add_category_success',
            lang,
            {
                'newCategory': newCategory
            }
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.PatchNoteAddNodeCategoryModal = PatchNoteAddNodeCategoryModal;