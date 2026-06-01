const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Setups = require('../../database/models/Setups');
const LanguageManager = require('../../managers/LanguageManager');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

const LANG_LABELS = {
    'en-US': 'English',
    'fr': 'Français',
    'de': 'Deutsch',
};

const languageChoices = fs.readdirSync(path.join(__dirname, '..', '..', 'langs'))
    .filter(file => file.endsWith('.json'))
    .map(file => {
        const code = file.replace(/\.json$/, '');
        return { name: LANG_LABELS[code] ?? code, value: code };
    });

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_default_language')
        .setDescription('Sets the default language for the bot in this server.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option
                .setName('language')
                .setDescription('The language to use for bot messages.')
                .setRequired(true)
                .addChoices(...languageChoices)
        ),
    async execute(interaction) {
        const selectedLang = interaction.options.getString('language');

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
                defaultLang: selectedLang,
                patchnoteRoleId: null,
            });
        } else {
            await Setups.update(
                { defaultLang: selectedLang },
                { where: { guildId: interaction.guild.id } },
            );
        }

        LanguageManager.invalidate(interaction.guild.id);

        const container = VariableResponseComponent.create(
            'set_default_language_success',
            selectedLang,
            { lang: LANG_LABELS[selectedLang] ?? selectedLang },
        );

        await interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    },
};
