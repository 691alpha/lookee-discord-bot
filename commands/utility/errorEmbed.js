const {SlashCommandBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const {EmbedManager} = require('../../managers/EmbedManager.js');
const path = require('node:path');

module.exports = {
    category: 'utility',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('error_embed')
        .setDescription('Tests Error Embed.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        let outputEmbed = EmbedManager.getEmbed('reload.error'); 

        const file = new AttachmentBuilder(
            path.join(__dirname, '../../assets/images/lookee-symbol.png')
        );

        interaction.reply({ embeds: [outputEmbed], files: [file] });
    },
};