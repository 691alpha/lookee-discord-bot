const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { TicketModeratorActionsComponent } = require('../../components/TicketModeratorActionsComponent')

// Sends a component in the current channel to manage the ticket assigned to the channel

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('ticket_mod')
        .setDescription('Sends buttons for all Moderator Ticket options.'),
        // .setDescription(LocalisationManager.getString(
        //         'ticket_mod_description_command', 
        //         lang
        //     )),
    async execute(interaction) {
        const lang = interaction.locale;

        let outputContainer = await TicketModeratorActionsComponent.create(lang);

        await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    },
};