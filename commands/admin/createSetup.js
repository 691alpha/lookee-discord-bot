const {SlashCommandBuilder, MessageFlags, PermissionsBitField} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Setups = require('../../database/models/Setups');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_setup')
        .setDescription('Creates a setup for the current guild.')
        // .setDescription(LocalisationManager.getString(
        //         'create_setup_description', 
        //         lang
        //     )),
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        const { db } = interaction.client;

        await Setups.create({
                id: await db.getNextId('setups'),
                guildId: interaction.guild.id,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                announcementChannelId: null,
                logChannelId: null,
                defaultLang: 'en-US',
                patchnoteRoleId: null
            });

        await interaction.reply({
            content: LocalisationManager.getString(
                'setup_created', 
                interaction.locale
            ),
            flags: MessageFlags.Ephemeral,
        })
    },
};