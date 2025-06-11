const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Setups = require('../../database/models/Setups');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_setup')
        .setDescription('Creates a setup for the current guild.'),
        // .setDescription(LocalisationManager.getString(
        //         'create_setup_description', 
        //         lang
        //     )),
    async execute(interaction) {
        const { db } = interaction.client;

        await Setups.create({
                id: await db.getNextId('setups'),
                guildId: interaction.guild.id,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                announcementChannelId: null,
                defaultLang: 'en-US',
            });

        await interaction.reply({
            content: LocalisationManager.getString(
                'setup_created', 
                lang
            ),
            flags: MessageFlags.Ephemeral,
        })
    },
};