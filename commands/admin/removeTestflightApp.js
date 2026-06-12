const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const { Op } = require('sequelize');
const TestflightApps = require('../../database/models/TestflightApps');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('remove_testflight_app')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Stops TestFlight build announcements for an app.')
        .addStringOption(option =>
            option
                .setName('app')
                .setDescription('Numeric Apple ID or display name of the tracked app.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const lang = interaction.locale;
        const input = interaction.options.getString('app').trim();

        const app = await TestflightApps.findOne({
            where: {
                guildId: interaction.guild.id,
                [Op.or]: [{ appStoreAppId: input }, { name: input }],
            },
        });

        if (!app) {
            const container = VariableResponseComponent.create('testflight_app_not_found', lang, { appId: input });
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        const appName = app.name;
        await app.destroy();

        const container = VariableResponseComponent.create('testflight_app_removed', lang, { appName });
        return interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
