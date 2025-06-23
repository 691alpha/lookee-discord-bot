const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { LocalisationManager } = require('../managers/LocalisationManager');
const ChannelUtils = require('../utils/ChannelUtils');
const Setups = require('../database/models/Setups');
const Tickets = require('../database/models/Tickets');
const TicketCategories = require('../database/models/TicketCategories');
const fs = require('fs').promises;
const path = require('path'); 

class CategoryTicketModal {
    static customId = "CategoryTicketModal";
    
    static create (lang, category) {

        const modal = new ModalBuilder()
            .setCustomId(`${CategoryTicketModal.customId}/${category}`)
            .setTitle(LocalisationManager.getString(
                `ticket_modal_title`, 
                lang, 
                {'category': category}
            ));

		const title = new TextInputBuilder()
            .setMinLength(5)
            .setMaxLength(40)
			.setLabel(LocalisationManager.getString('ticket_modal_input_title', lang))
			.setCustomId('categoryTicketModalTitle')
            .setPlaceholder(LocalisationManager.getString('ticket_modal_placeholder_title', lang))
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
		
		const description = new TextInputBuilder()
            .setMinLength(10)
            .setMaxLength(1_000)
			.setLabel(LocalisationManager.getString('ticket_modal_input_description', lang))
            .setCustomId('ticketModalDescription')
            .setPlaceholder(LocalisationManager.getString('ticket_modal_placeholder_description', lang))
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(title);
		const secondActionRow = new ActionRowBuilder().addComponents(description);

		modal.addComponents(firstActionRow, secondActionRow);

        return modal;
	}

    static async onSubmit(interaction) {
		const { db } = interaction.client;
		const guildId = interaction.guildId.toString(); 
		const setup = await Setups.findOne({ where: { guildId } });
		const ticketId = await db.getNextId('tickets');
        const lang = interaction.locale;

        const customId = interaction.customId;
        const [prefix, categoryName] = customId.split('/');
        
		const createdTicketChannel = await ChannelUtils.runCreateTicketProcess(
			interaction,
			setup.unassignedTicketsCategoryId,
			categoryName,
			ticketId,
            lang
		);

        const category = await TicketCategories.findOne({
            where: {name: categoryName}
        });
        
		const newTicket = await Tickets.create({
            id: ticketId,
			channelId: createdTicketChannel.id,
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            discordUsername: interaction.user.username,
            title: interaction.fields.getTextInputValue('categoryTicketModalTitle'),
            description: interaction.fields.getTextInputValue('ticketModalDescription'),
            status: 'unassigned',
            categoryId: category.id,
			moderator: null,
        });

        const ticketCategory = await TicketCategories.findOne({where: {id: category.id}});

        const fileContent = `Ticket ID: ${newTicket.id}\n` +
                            `Author ID: ${newTicket.userId}\n` +
                            `Author Username: ${newTicket.discordUsername}\n` +
                            `Creation Date: ${newTicket.createdAt}\n` +
                            `Guild ID: ${newTicket.guildId}\n` +
                            `Category: ${ticketCategory.name}\n` +
                            `Category ID: ${newTicket.categoryId}\n` +
                            `Title: ${newTicket.title}\n` +
                            `Description: ${newTicket.description}\n` +
                            `\n` +
                            "  _____ ____      _    _   _ ____   ____ ____  ___ ____ _____ \n"+
                            " |_   _|  _ \\    / \\  | \\ | / ___| / ___|  _ \\|_ _|  _ \\_   _|\n"+
                            "   | | | |_) |  / _ \\ |  \\| \\___ \\| |   | |_) || || |_) || |  \n"+
                            "   | | |  _ <  / ___ \\| |\\  |___) | |___|  _ < | ||  __/ | |  \n"+
                            "   |_| |_| \\_\\/_/   \\_\\_| \\_|____/ \\____|_| \\_\\___|_|    |_|  \n";
                                                              

        const ticketsFolderPath = path.join(__dirname, '../files/tickets');
        fs.writeFile(ticketsFolderPath+`/${newTicket.id}.txt`,fileContent)

        await ChannelUtils.sendTicketCreationSuccess(interaction, createdTicketChannel, newTicket);
        return;

    }
}

module.exports.CategoryTicketModal = CategoryTicketModal;