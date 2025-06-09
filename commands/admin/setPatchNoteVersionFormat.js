const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const Formats = require('../../database/models/Formats');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_patchnote_version_format')
        .setDescription('Sets the format for the patchnote version.')
        .addStringOption(option =>
		    option.setName('input')
                .setDescription('New patchnote version format here')
                .setRequired(true)
        ),
    async execute(interaction) {

        const { db } = interaction.client;

        const format = interaction.options.addStringOption('input');

        await Formats.create({
            id: await db.getNextId('formats'),
            format: format
        });

        await interaction.reply({
            content: `Set patchnote version format.`,
            flags: MessageFlags.Ephemeral
        }); 
    },
};