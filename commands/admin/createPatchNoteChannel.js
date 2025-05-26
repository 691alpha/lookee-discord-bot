const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { PatchNoteComponent } = require('../../components/PatchNoteComponent');
const { PatchNoteButtonComponent } = require('../../components/PatchNoteButtonComponent');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_patchnote_channel')
        .setDescription('Sends a Patchnote component in the current channel.'),
    async execute(interaction) {
        let outputContainer = await PatchNoteComponent.create(interaction);
        let outputButtons = await PatchNoteButtonComponent.create(interaction);

        await interaction.reply({
            components: [outputContainer, outputButtons],
            flags: MessageFlags.IsComponentsV2,
        })
    },
};