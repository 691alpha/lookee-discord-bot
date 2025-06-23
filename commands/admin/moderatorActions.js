const {SlashCommandBuilder, MessageFlags, PermissionsBitField} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager.js");
const { CreateTicketComponent } = require('../../components/CreateTicketComponent.js');
const { ModeratorActionsComponent } = require('../../components/ModeratorActionsComponent.js');

// Sends a component to create a new ticket in the current channel

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('moderator_actions')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sends a moderator actions message in the current channel.'),
        
    async execute(interaction) {
        const lang = interaction.locale;
        let outputContainer = await ModeratorActionsComponent.create(lang)

        await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    },
};