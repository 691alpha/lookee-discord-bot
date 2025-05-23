const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { RemoveUserTicketComponent } = require("../../components/RemoveUserTicketComponent");
const { TicketUtils } = require("../../utils/TicketUtils");

class RemoveUserTicketButton {
    static customId = "RemoveUserTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(RemoveUserTicketButton.customId)
            .setLabel(LocalisationManager.getString('remove_user_ticket', lang) || 'Remove User')
            .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const component = await RemoveUserTicketComponent.create(interaction);
        await interaction.reply({
            components: [component],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });
    }
}

module.exports.RemoveUserTicketButton = RemoveUserTicketButton;
