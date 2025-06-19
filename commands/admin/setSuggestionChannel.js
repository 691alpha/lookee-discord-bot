const {SlashCommandBuilder, MessageFlags, PermissionsBitField} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Setups = require('../../database/models/Setups');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

// Sets the current channel as 'suggestion' channel which is used to send suggestions
module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_suggestion_channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sets the current channel as suggestion channel.'),
    async execute(interaction) {
        const lang = interaction.locale;
        const { db } = interaction.client;
        const guildId = interaction.guild.id;
        const setup = await Setups.findOne({ where: { guildId } });

        if(!(setup)) {
            await Setups.create({
                id: await db.getNextId('setups'),
                guildId: guildId,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                announcementChannelId: null,
                logChannelId: null,
                suggestionChannelId: interaction.channel.id,
                defaultLang: 'en-US',
                patchnoteRoleId: null
            });

            const container = NoVariableResponseComponent.create(
                'suggestion_channel_set_setup_created',
                lang
            );

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });

        }

        await Setups.update(
            { suggestionChannelId: interaction.channel.id },
            { where: { guildId: guildId } }
        );

        const container = NoVariableResponseComponent.create(
            'suggestion_channel_set',
            lang
        );

        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    },
};