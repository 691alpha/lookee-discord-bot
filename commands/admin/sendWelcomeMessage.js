const {SlashCommandBuilder, MessageFlags, PermissionsBitField} = require('discord.js');
const { WelcomeMessageComponent } = require('../../components/WelcomeMessageComponent.js');
const Setups = require('../../database/models/Setups.js');
const { PresentationComponent } = require('../../components/PresentationComponent.js');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

// Sends a component to create a new ticket in the current channel

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('send_welcome_message')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Sends a welcome message in the current channel.'),
    async execute(interaction) {
        const setup = await Setups.findOne({ where: { guildId: interaction.guild.id } });
        
        if (!setup) {
            const container = NoVariableResponseComponent.create(
                'patchnote_no_setup_found', 
                lang
            );

            return await interaction.editReply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }

        const lang = setup.defaultLang;

        const presentationContainer = await PresentationComponent.create(lang);
        let outputContainer = await WelcomeMessageComponent.create(lang);

        await interaction.channel.send({
            components: [ presentationContainer, outputContainer],
            flags: MessageFlags.IsComponentsV2,
        })

        const returnContainer = NoVariableResponseComponent.create('welcome_message_send', lang)
        return interaction.reply({
            components: [returnContainer],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    },
};