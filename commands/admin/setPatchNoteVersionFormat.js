const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Formats = require('../../database/models/Formats');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('set_patchnote_version_format')
        .setDescription('Sets the format for the patchnote version.')
        // .setDescription(LocalisationManager.getString(
        //         'set_patchnote_version_format_description_command', 
        //         lang
        //     ))
        .addStringOption(option =>
		    option.setName('input')
                .setDescription('New patchnote version format here')
                .setRequired(true)
                // .setDescription(LocalisationManager.getString(
                // 'set_patchnote_version_format_description_command_input', 
                // lang
                // ))
        ),
    async execute(interaction) {

        const { db } = interaction.client;

        const newFormatValue = interaction.options.addStringOption('input');

        await Formats.create({
            id: await db.getNextId('formats'),
            value: newFormatValue
        });

        await interaction.reply({
            content: LocalisationManager.getString(
                'set_patchnote_version_format_description_command', 
                lang
            ),
            flags: MessageFlags.Ephemeral
        }); 
    },
};