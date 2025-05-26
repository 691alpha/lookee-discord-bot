const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const Setups = require('../../database/models/Setups');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_announcement_channel')
        .setDescription('Sets the current channel as announcement channel.'),
    async execute(interaction) {

        await Setups.update(
                    { announcementChannelId: interaction.channel.id },
                    { where: { guildId: interaction.guild.id } }
                );

        await interaction.reply({
            content: 'This Channel is now set as Annoucement Channel.',
            flags: MessageFlags.Ephemeral,
        })
    },
};