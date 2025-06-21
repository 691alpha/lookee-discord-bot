const {SlashCommandBuilder, MessageFlags, PermissionsBitField} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Setups = require('../../database/models/Setups');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_attachment_channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sets the current channel as attachment channel.'),
    async execute(interaction) {
        const lang = interaction.locale;

        const setups = await Setups.findAll({
            where: {
                guildId: interaction.guild.id
            }
        });

        if(!setups || setups.length === 0) {

            const { db } = interaction.client;

            await Setups.create({
                id: await db.getNextId('setups'),
                guildId: interaction.guild.id,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                suggestionChannelId: null,
                announcementChannelId: null,
                attachmentChannelId: interaction.channel.id,
                logChannelId: null,
                defaultLang: 'en-US',
                patchnoteRoleId: null
            });
        }

        await Setups.update(
                    { attachmentChannelId: interaction.channel.id },
                    { where: { guildId: interaction.guild.id } }
                );

        const container = NoVariableResponseComponent.create(
            'set_attachment_channel_success', 
            lang
        )

        await interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        })
    },
};