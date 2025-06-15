const {SlashCommandBuilder, MessageFlags, PermissionsBitField} = require('discord.js');
const { PatchNoteComponent } = require('../../components/PatchNoteComponent');
const { PatchNoteButtonComponentOne } = require('../../components/PatchNoteButtonComponentOne');
const { PatchNoteButtonComponentTwo } = require('../../components/PatchNoteButtonComponentTwo');
const { LocalisationManager } = require("../../managers/LocalisationManager");
const PatchNoteNodes = require('../../database/models/PatchNoteNodes');
const PatchNotePreviews = require('../../database/models/PatchNotesPreviews');
const { NoVariableResponseComponent } = require('../../components/responses/NoVariableResponseComponent');
const { EPatchNoteStatus } = require('../../enums/EPatchNoteStatus');

// Send a component in the current channel to manage patchnotes.
module.exports = {
    category: 'admin',
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('create_patchnote_component')
        .setDescription('Sends a Patchnote component in the current channel.')
        // .setDescription(LocalisationManager.getString(
        //     'create_patchnote_component_description', 
        //     lang
        // ))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        const lang = interaction.locale;

        const nodes = await PatchNoteNodes.findAll({
            where: {
                guildId: interaction.guild.id,
                status: [EPatchNoteStatus.DONE, EPatchNoteStatus.PLANNED]
            }
        });

        let outputContainer = await PatchNoteComponent.create(
            nodes, 
            lang, 
            'edit', 
            interaction.guild
        );
        let outputButtonsOne = await PatchNoteButtonComponentOne.create(lang);
        let outputButtonsTwo = await PatchNoteButtonComponentTwo.create(lang);

        const sentMessage = await interaction.channel.send({
            components: [
                outputContainer, 
                outputButtonsOne, 
                outputButtonsTwo
            ],
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