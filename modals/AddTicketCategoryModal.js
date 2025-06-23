const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { VariableResponseComponent } = require('../components/responses/VariableResponseComponent');
const TicketCategories = require('../database/models/TicketCategories');
const { NoVariableResponseComponent } = require('../components/responses/NoVariableResponseComponent');

class AddTicketCategoryModal {
    static customId = "AddTicketCategoryModal";
    
    static create(lang) {
        
        const modal = new ModalBuilder()
        .setCustomId(`${AddTicketCategoryModal.customId}`)
        .setTitle(LocalisationManager.getString('add_ticket_category_modal_title', lang));
		
        const input = new TextInputBuilder()
        .setCustomId(`addTicketCategoryInput`)
        .setLabel(LocalisationManager.getString(
            'add_ticket_category_input_label', 
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
        const newCategory = interaction.fields.getTextInputValue('addTicketCategoryInput');

        const sameCategory = await TicketCategories.findAll({
            where: {
                name: newCategory
            }
        });

        if(sameCategory && sameCategory.length > 0) {
            const container = NoVariableResponseComponent.create(
                'ticket_category_already_exists',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        const createdCategory = await TicketCategories.create({
            id: await db.getNextId('ticket_categories'),
            name: newCategory,
            guildId: interaction.guild.id,
            archived: false
        });

        if(!createdCategory) {
            const container = NoVariableResponseComponent.create(
                'add_ticket_category_failed',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        const container = VariableResponseComponent.create(
            'add_ticket_category_success',
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

module.exports.AddTicketCategoryModal = AddTicketCategoryModal;