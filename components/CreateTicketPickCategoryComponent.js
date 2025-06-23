const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const TicketCategories = require('../database/models/TicketCategories');
const { NoVariableResponseComponent } = require('./responses/NoVariableResponseComponent');
const { TicketCategoryCreateButton } = require('../buttons/interactions/TicketCategoryCreateButton');

class CreateTicketPickCategoryComponent {
    static async create(lang, db, guildId) {
        let containers = [];
        const textContainer = new ContainerBuilder();

        const text1 = new TextDisplayBuilder().setContent(
            [
                `## ${LocalisationManager.getString(
                    'create_ticket_pick_category_title_component', 
                    lang
                )}`,
                `${LocalisationManager.getString(
                    'create_ticket_pick_category_description_component', 
                    lang
                )}`,
            ].join('\n'),
        );
        textContainer.addTextDisplayComponents(text1);
        containers.push(textContainer);

        let categories = await TicketCategories.findAll();

        if(categories.length === 0) {
            const defaultCategory = await TicketCategories.create({
                id: await db.getNextId('ticket_categories'),
                name: 'Help',
                guildId: guildId,
                archived: false
            });

            categories.push(defaultCategory);
        }

        let newBC = new ContainerBuilder();
        let actionRowComponents = [];

        for( let index = 0; index < categories.length; index++ ) {
            if(index != 0 && index%5 == 0) {
                newBC.addActionRowComponents(row => row.addComponents(actionRowComponents))
                actionRowComponents = [];
                
                containers.push(newBC);
                newBC = new ContainerBuilder();
            }
            
            actionRowComponents.push(
                TicketCategoryCreateButton.create(lang, categories[index].name)
            );

        }
        newBC.addActionRowComponents(row => row.addComponents(actionRowComponents))
        containers.push(newBC);
        
        return containers;
    }
}

module.exports.CreateTicketPickCategoryComponent = CreateTicketPickCategoryComponent;