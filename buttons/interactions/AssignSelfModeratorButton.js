const { ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const Tickets = require("../../database/models/Tickets");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class AssignSelfModeratorButton {
    static customId = "AssignSelfModeratorButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AssignSelfModeratorButton.customId)
            .setEmoji('1387098747548205066')
            .setLabel(`${LocalisationManager.getString('add_self_moderator_ticket', lang)}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        const member = interaction.member;
        const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id, lang);

        const currentTicket = await Tickets.findOne({ where: { channelId: interaction.channel.id } });
        const moderator = currentTicket.moderator;

        if (!ticket) return TicketUtils.searchTicketFail(interaction, lang);

        if(moderator === interaction.user.id) {
            const container = NoVariableResponseComponent.create(
                'arl_moderator', 
                lang
            );
            await interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
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
    
            const container = NoVariableResponseComponent.create(
                'assigned_moderator', 
                lang
            );
            await interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }
    }
}

module.exports.AssignSelfModeratorButton = AssignSelfModeratorButton;
