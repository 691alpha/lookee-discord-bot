const { ButtonBuilder, ButtonStyle, MessageFlags, FileBuilder, FileComponent, AttachmentBuilder } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { ReopenTicketButton } = require("../interactions/ReopenTicketButton");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");
const { TicketLogPrivateMessageComponent } = require("../../components/responses/TicketLogPrivateMessageComponent");
const fs = require('fs').promises;
const path = require('path'); 
const { ForwardToTicketButton } = require("./ForwardToTicketButton");

class CloseTicketButton {
    static customId = "CloseTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(CloseTicketButton.customId)
            .setEmoji('1386725670796923031')
            .setLabel(LocalisationManager.getString('ticket_close', lang))
            .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        
        const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id);

        if(ticket.status === 'closed') {
            const outputContainer = NoVariableResponseComponent.create(
                'ticket_already_closed', 
                lang
            )

            outputContainer.addActionRowComponents(row => row.addComponents(
                ReopenTicketButton.create(lang)
            ));

            return interaction.reply({ 
                components: [outputContainer],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            });
        }

        TicketUtils.moveTicketToCategory(
            interaction.guild, 
            ticket.id, 
            interaction.channel, 
            'closed'
        );

        const outputContainer = NoVariableResponseComponent.create('ticket_has_been_closed', lang)

        outputContainer.addActionRowComponents(row => row.addComponents(
            ReopenTicketButton.create(lang)
        ));

        const logMessageComponent = await TicketLogPrivateMessageComponent.create(
            lang, 
            interaction.guild.name, 
            ticket
        );

        const ticketsFolderPath = path.join(__dirname, '../../files/tickets').replaceAll("\\\\", "\\");

        const ticketChannel = await interaction.client.channels.fetch(ticket.channelId);

        const newFileName = `${LocalisationManager.getString(
            'ticket_log_file_prefix', 
            lang)}${ticketChannel.name}.txt`

        const file = new AttachmentBuilder(`${ticketsFolderPath}/${ticket.id}.txt`)
            .setName(`${newFileName}`)

        const fileBuilder = new FileBuilder().
            setURL(`attachment://${newFileName}`);

        logMessageComponent.addFileComponents(fileBuilder);

        logMessageComponent.addActionRowComponents(row => row.addComponents(
            ForwardToTicketButton.create(ticket.channelId, ticket.guildId, lang)
        ));

        interaction.client.users.send(ticket.userId, 
            {
                components: [logMessageComponent],
                files: [file],
                flags: [MessageFlags.IsComponentsV2]
            }
        )

        interaction.reply({ 
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.CloseTicketButton = CloseTicketButton;
