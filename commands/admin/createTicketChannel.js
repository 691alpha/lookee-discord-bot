const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { CreateTicketComponent } = require('../../components/CreateTicketComponent.js');

// Sends a component to create a new ticket in the current channel

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_ticket_channel')
        .setDescription('Sends a Ticket embed in the current channel.'),
        // .setDescription(LocalisationManager.getString(
        //         'send_ticket_embed_description', 
        //         lang
        //     )),
    async execute(interaction) {
        const lang = interaction?.locale ?? 'en-US';
        let outputContainer = await CreateTicketComponent.create(lang);

        await interaction.reply({
            components: [outputContainer],
            flags: MessageFlags.IsComponentsV2,
        })
    },
};