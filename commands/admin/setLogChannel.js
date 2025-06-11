const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Setups = require('../../database/models/Setups');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_log_channel')
        .setDescription('Sets the current channel as the log channel for the server.'),
    async execute(interaction) {
        const { db } = interaction.client;
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;
        const lang = interaction.locale;

        let setup = await Setups.findOne({ where: { guildId } });

        if (!setup) {
            await Setups.create({
                id: await db.getNextId('setups'),
                guildId: guildId,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                announcementChannelId: null,
                logChannelId: channelId,
                defaultLang: lang,
            });

            await interaction.reply({
                content: LocalisationManager.getString('log_channel_set_and_setup_created', lang),
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await setup.update({
                logChannelId: channelId
            });

            await interaction.reply({
                content: LocalisationManager.getString('log_channel_updated', lang),
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};