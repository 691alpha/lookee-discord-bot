const { ButtonBuilder, ButtonStyle, MessageFlags, FileBuilder, FileComponent, AttachmentBuilder } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const fs = require('fs').promises;
const path = require('path'); 
const { VariableResponseComponent } = require("../../components/responses/VariableResponseComponent");

class TicketSendLogButton {
    static customId = "TicketSendLogButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(TicketSendLogButton.customId)
            .setEmoji('1387116103922090174')
            .setLabel(LocalisationManager.getString('send_ticket_log', lang))
            .setStyle(ButtonStyle.Primary);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        
        const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id);

        const logMessageComponent = VariableResponseComponent.create(
            'ticket_current_log_send',
            lang,
            { 'username': ticket.discordUsername }
        );

        const ticketChannel = await interaction.client.channels.fetch(ticket.channelId);
        const ticketsFolderPath = path.join(__dirname, '../../files/tickets').replaceAll("\\\\", "\\");
        const newFileName = `${LocalisationManager.getString(
            'ticket_log_file_prefix', 
            lang)}${ticketChannel.name}.txt`

        const file = new AttachmentBuilder(`${ticketsFolderPath}/${ticket.id}.txt`)
            .setName(`${newFileName}`)
        
        const fileBuilder = new FileBuilder().setURL(`attachment://${newFileName}`);
        
        logMessageComponent.addFileComponents(fileBuilder);

        interaction.reply({ 
            components: [logMessageComponent],
            files: [file],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
        });
    }
}

module.exports.TicketSendLogButton = TicketSendLogButton;
