const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { AddSupportTicketComponent } = require("../../components/AddSupportTicketComponent");

class AddSupporterTicketButton {
    static customId = "AddSupporterTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AddSupporterTicketButton.customId)
            .setLabel(`${LocalisationManager.getString('add_support', lang)}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const outputContainer = await AddSupportTicketComponent.create(lang);
        await interaction.reply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });
    }
}

module.exports.AddSupporterTicketButton = AddSupporterTicketButton;
