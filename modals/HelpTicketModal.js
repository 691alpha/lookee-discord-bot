const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const ChannelUtils = require('../utils/ChannelUtils');
const Setups = require('../database/models/Setups');
const Tickets = require('../database/models/Tickets');
const { LocalisationManager } = require('../managers/LocalisationManager');
const { TicketUtils } = require('../utils/TicketUtils');

class HelpTicketModal {
    static create (lang) {

        const modal = new ModalBuilder()
            .setCustomId('HelpTicketModal')
            .setTitle(LocalisationManager.getString('help_modal_title', lang));

		const title = new TextInputBuilder()
            .setMinLength(5)
            .setMaxLength(40)
			.setLabel(LocalisationManager.getString('help_modal_input_title', lang))
			.setCustomId('helpTicketModalTitle')
            .setPlaceholder(LocalisationManager.getString('help_modal_placeholder_title', lang))
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
		
		const description = new TextInputBuilder()
            .setMinLength(10)
            .setMaxLength(1_000)
			.setLabel(LocalisationManager.getString('help_modal_input_description', lang))
            .setCustomId('helpTicketModalDescription')
            .setPlaceholder(LocalisationManager.getString('help_modal_placeholder_description', lang))
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
        const lang = interaction?.locale ?? 'en-US';
		const createdTicketChannel = await ChannelUtils.runCreateTicketProcess(
			interaction,
			setup.unassignedTicketsCategoryId,
			'help',
			ticketId,
            lang
		);

		await Tickets.create({
            id: ticketId,
			channelId: createdTicketChannel.id,
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            discordUsername: interaction.user.username,
            title: interaction.fields.getTextInputValue('helpTicketModalTitle'),
            description: interaction.fields.getTextInputValue('helpTicketModalDescription'),
            status: 'unassigned',
            category: 'help',
			moderator: null,
        })

    }
}

module.exports.HelpTicketModal = HelpTicketModal;