const { ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Tickets = require("../../database/models/Tickets");

class AssignSelfModeratorButton {
    static customId = "AssignSelfModeratorButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AssignSelfModeratorButton.customId)
            .setLabel(`${LocalisationManager.getString('add_self_moderator_ticket', lang)}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const member = interaction.member;
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);

        const currentTicket = await Tickets.findOne({ where: { channelId: interaction.channel.id } });
        const moderator = currentTicket.moderator;

        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        if(moderator === interaction.user.id) {
            await interaction.reply({
                content: `You are already assigned as moderator for this ticket.`,
                flags: MessageFlags.Ephemeral
            });
        } else {
            await TicketUtils.addUserToChannel(interaction.channel, member, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                ManageMessages: true,
                AddReactions: true,
                AttachFiles: true,
                EmbedLinks: true
            });
    
            await TicketUtils.assignModerator(
                ticket.id, 
                member.id, 
                interaction.guild, 
                interaction.channel);
    
            await interaction.reply({
                content: `You are now assigned as moderator for this ticket.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

module.exports.AssignSelfModeratorButton = AssignSelfModeratorButton;
