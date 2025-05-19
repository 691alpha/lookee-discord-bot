const { SlashCommandBuilder, ActionRowBuilder, MessageFlags } = require('discord.js');
const { AssignModeratorButton } = require('../../buttons/interactions/AssignModeratorButton');
const { AddUserTicketButton } = require('../../buttons/interactions/AddUserTicketButton');
const { AssignSelfModeratorButton } = require('../../buttons/interactions/AssignSelfModeratorButton');
const { CloseTicketButton } = require('../../buttons/interactions/CloseTicketButton');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('ticket_mod')
        .setDescription('Sends buttons for all Moderator Ticket options.'),
    async execute(interaction) {

        const row = new ActionRowBuilder()
                    .addComponents(AssignModeratorButton.create())
                    .addComponents(AddUserTicketButton.create())
                    .addComponents(AssignSelfModeratorButton.create())
                    .addComponents(CloseTicketButton.create());
        

        await interaction.reply({
            content: `Click on the Moderator Action you want to execute.`,
            components: [row],
            flags: MessageFlags.Ephemeral
        });

        // const ticket = await Tickets.findOne({ 
        //     where: {
        //         id: interaction.channel.id
        //     },
        // });
        // const target = interaction.options.getUser('target');

        // if (target) {
        //     await ticket.update({
        //         moderator: target.id,
        //     })
        // }
        // if (!target) {
        //     await ticket.update({
        //         moderator: interaction.user.id,
        //     })
        // }

    },
};