const { MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");

class PickSupportSelectionMenu {
    static customId = "PickSupportSelectionMenu";

    static create(lang) {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickSupportSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(5);
    }

    static async onInteraction(interaction) {
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const selected = interaction.values[0];
        const member = await interaction.guild.members.fetch(selected).catch(() => null);
        if (!member) return TicketUtils.gettingMemberFail(interaction);

        await TicketUtils.addUserToChannel(interaction.channel, member, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
            ManageChannels: true,
            AddReactions: true,
            AttachFiles: true,
            EmbedLinks: true
        });

        await interaction.reply({
            content: `<@${member.id}> has been added as support moderator.`,
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports.PickSupportSelectionMenu = PickSupportSelectionMenu;
