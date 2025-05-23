const { MentionableSelectMenuBuilder, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");

class PickUserRemoveSelectionMenu {
    static customId = "PickUserRemoveSelectionMenu";

    static create() {

        return new MentionableSelectMenuBuilder()
            .setCustomId(PickUserRemoveSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("Select user to remove")
    }

    static async onInteraction(interaction) {
        const userId = interaction.values[0];

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const member = await interaction.guild.members.fetch(userId).catch(() => null);
        if (!member) {
            return interaction.reply({
                content: `User <@${userId}> could not be found.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.channel.permissionOverwrites.delete(userId);

        await interaction.reply({
            content: `User <@${userId}> has been removed from this ticket.`,
            flags: MessageFlags.Ephemeral,
        });
    }
}

module.exports.PickUserRemoveSelectionMenu = PickUserRemoveSelectionMenu;
