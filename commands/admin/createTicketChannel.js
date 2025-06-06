const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { CreateTicketComponent } = require('../../components/CreateTicketComponent.js');

// Sends a component to create a new ticket in the current channel

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_channel')
        .setDescription('Sends a Ticket embed in the current channel.'),
    async execute(interaction) {
        let outputContainer = await CreateTicketComponent.create(interaction);

        await interaction.reply({
            components: [outputContainer],
            flags: MessageFlags.IsComponentsV2,
        })
    },
};