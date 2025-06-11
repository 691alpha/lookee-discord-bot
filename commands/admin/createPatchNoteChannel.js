const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const { PatchNoteComponent } = require('../../components/PatchNoteComponent');
const { PatchNoteButtonComponent } = require('../../components/PatchNoteButtonComponent');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require('../../database/models/PatchNoteNodes');
const PatchNotePreviews = require('../../database/models/PatchNotesPreviews');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');

// Send a component in the current channel to manage patchnotes.
module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_patchnote_component')
        .setDescription('Sends a Patchnote component in the current channel.'),
        // .setDescription(LocalisationManager.getString(
        //     'create_patchnote_component_description', 
        //     lang
        // )),
    async execute(interaction) {
        const lang = interaction?.locale ?? 'en-US';

        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId: interaction.guild.id,
                status: ['done', 'planned']
            }
        });

        let outputContainer = await PatchNoteComponent.create(nodes, lang);
        let outputButtons = await PatchNoteButtonComponent.create(lang);

        const sentMessage = await interaction.channel.send({
            components: [outputContainer, outputButtons],
            flags: MessageFlags.IsComponentsV2
        });

        if(!sentMessage) {
            return LocalisationManager.getString(
                'sent_message_not_found', 
                lang
            )
        }

        const tableSize = await PatchNotePreviews.count();

        if(!tableSize && tableSize != 0) {
            return LocalisationManager.getString(
                'tablesize_doesnt_exist', 
                lang
            )
        }
        
        if(tableSize === 0) {
            await PatchNotePreviews.create({
                guildId: interaction.guild.id,
                channelId: sentMessage.channel.id,
                messageId: sentMessage.id
            });
        } else {
            await PatchNotePreviews.update(
                { messageId: sentMessage.id },
                { where: { 
                    guildId: interaction.guild.id,
                } }
            );
        }

        const container = NoVariableResponseComponent.create(
            'patchnote_edit_msg_sent', 
            lang
        );

        interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        })
    },
};