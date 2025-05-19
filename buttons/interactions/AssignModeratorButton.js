const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtilities } = require("../../utils/TicketUtils");

class AssignModeratorButton {
    static customId = "AssignModeratorButton";

    static create() {
        return new ButtonBuilder()
            .setCustomId(AssignModeratorButton.customId)
            .setLabel('Add Moderator')
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const ticket = await TicketUtilities.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtilities.searchTicketFail(interaction);

        await interaction.reply({
            content: 'Please enter the **User ID** or mention the user to add to this ticket.',
            flags: MessageFlags.Ephemeral,
        });

        const collector = interaction.channel.createMessageCollector({
            filter: m => m.author.id === interaction.user.id,
            time: 30_000,
            max: 1
        });

        collector.on('collect', async (msg) => {
            // Extracts username or id by checking if the message mentions an user,
            // if so it gets the id of the user, 
            // otherwise it gets the text input (without whitespaces)
            const userId = msg.mentions.users.first()?.id || msg.content.trim();

            // gets the guild member by user id
            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (!member) return TicketUtilities.gettingMemberFail(interaction);

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

            await interaction.followUp({ 
                content: `<@${member.id}> has been added as moderator.`, 
                flags: MessageFlags.Ephemeral, 
            });
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.followUp({ 
                    content: 'You did not provide a user ID in time.', 
                    flags: MessageFlags.Ephemeral,
                });
            }
        });
    }
}

module.exports.AssignModeratorButton = AssignModeratorButton;
