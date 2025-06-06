const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { PatchNoteComponent } = require('../../components/PatchNoteComponent');
const { PatchNoteButtonComponent } = require('../../components/PatchNoteButtonComponent');
const PatchNoteNodes = require('../../database/models/PatchNoteNodes');
const PatchNotePreviews = require('../../database/models/PatchNotesPreviews');
const { PatchnoteUtils } = require('../../utils/PatchnoteUtils');

module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_patchnote_channel')
        .setDescription('Sends a Patchnote component in the current channel.'),
    async execute(interaction) {

        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId: interaction.guild.id,
                status: ['done', 'planned']
            }
        });

        let outputContainer = await PatchNoteComponent.create(nodes, interaction);
        let outputButtons = await PatchNoteButtonComponent.create(interaction);

        await interaction.reply({
            components: [outputContainer, outputButtons],
            flags: MessageFlags.IsComponentsV2
        });

        const sent = await interaction.fetchReply();

        const tableSize = await PatchNotePreviews.count();
        try {
            if(tableSize === 0) {
                await PatchNotePreviews.create({
                    guildId: interaction.guild.id,
                    channelId: sent.channel.id,
                    messageId: sent.id
                });
            } else {
                await PatchNotePreviews.update(
                    { messageId: sent.id },
                    { where: { 
                        guildId: interaction.guild.id,
                    } }
                );
            }
        } catch (error) {
            console.log(error);
        }
    },
};