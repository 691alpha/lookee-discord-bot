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
            .setEmoji('1387077790117003405')
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

        const ticketsFolderPath = path.join(__dirname, '../../files/tickets').replaceAll("\\\\", "\\");
        const file = new AttachmentBuilder(`${ticketsFolderPath}/${ticket.id}.txt`)
        const fileBuilder = new FileBuilder().setURL(`attachment://${ticket.id}.txt`);

        logMessageComponent.addFileComponents(fileBuilder);

        interaction.reply({ 
            components: [logMessageComponent],
            files: [file],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
        });
    }
}

module.exports.TicketSendLogButton = TicketSendLogButton;
