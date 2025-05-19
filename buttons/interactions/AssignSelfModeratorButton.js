const { ButtonBuilder, ButtonStyle, MessageFlags, PermissionsBitField } = require("discord.js");
const { TicketUtilities } = require("../../utils/TicketUtils");

class AssignSelfModeratorButton {
    static customId = "AssignSelfModeratorButton";

    static create() {
        return new ButtonBuilder()
            .setCustomId(AssignSelfModeratorButton.customId)
            .setLabel('Assign Self Moderator')
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const member = interaction.member;
        const ticket = await TicketUtilities.findTicketByChannel(interaction.channel.id);

        if (!ticket) return TicketUtilities.searchTicketFail(interaction);

        await TicketUtilities.addUserToChannel(interaction.channel, member, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
            ManageChannels: true,
            AddReactions: true,
            AttachFiles: true,
            EmbedLinks: true
        });

        await TicketUtilities.assignModerator(
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

module.exports.AssignSelfModeratorButton = AssignSelfModeratorButton;
