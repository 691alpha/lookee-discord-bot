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

        if (!userId || userId.length === 0) {
            throw EmptyResultError(LocalisationManager.getString(
                'no_valid_user_selected', lang
            ));
        }

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);

        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const member = await interaction.guild.members.fetch(userId).catch(() => null);

        if (!member) {
            throw EmptyResultError(LocalisationManager.getString(
                'user_not_found', lang, {"userId": userId}
            ));
        }

        await interaction.channel.permissionOverwrites.delete(userId);

        await interaction.reply({
            content: `User <@${userId}> has been removed from this ticket.`,
            flags: MessageFlags.Ephemeral,
        });
    }
}

module.exports.PickUserRemoveSelectionMenu = PickUserRemoveSelectionMenu;
