const { SlashCommandBuilder, MessageFlags, PermissionsBitField, ContainerBuilder, TextDisplayBuilder } = require('discord.js');
const Setups = require('../../database/models/Setups');
const ColorManager = require('../../managers/ColorManager');
const { LocalisationManager } = require('../../managers/LocalisationManager');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_main_color')
        .setDescription('Sets the main brand color used by bot components (bars, accents).')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('Hex color, e.g. #006874')
                .setRequired(true)
        ),
    async execute(interaction) {
        const rawInput = interaction.options.getString('color').trim();
        const parsed = ColorManager.parseHex(rawInput);

        if (parsed === null) {
            const container = NoVariableResponseComponent.create(
                'set_main_color_invalid',
                interaction.locale,
            );
            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }

        const normalized = `#${parsed.toString(16).padStart(6, '0').toUpperCase()}`;

        const setup = await Setups.findOne({
            where: { guildId: interaction.guild.id },
        });

        if (!setup) {
            const { db } = interaction.client;
            await Setups.create({
                id: await db.getNextId('setups'),
                guildId: interaction.guild.id,
                assignedTicketsCategoryId: null,
                unassignedTicketsCategoryId: null,
                closedTicketsCategoryId: null,
                suggestionChannelId: null,
                attachmentChannelId: null,
                announcementChannelId: null,
                logChannelId: null,
                defaultLang: 'en-US',
                patchnoteRoleId: null,
                mainColor: normalized,
            });
        } else {
            await Setups.update(
                { mainColor: normalized },
                { where: { guildId: interaction.guild.id } },
            );
        }

        ColorManager.invalidate(interaction.guild.id);

        const lang = setup?.defaultLang ?? interaction.locale;
        const preview = new ContainerBuilder();
        preview.setAccentColor(parsed);
        preview.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                LocalisationManager.getString('set_main_color_success', lang, { color: normalized }),
            ),
        );

        await interaction.reply({
            components: [preview],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
