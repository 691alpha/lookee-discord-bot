const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { AssignModeratorComponent } = require("../../components/AssignModeratorComponent");

class AssignModeratorButton {
    static customId = "AssignModeratorButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AssignModeratorButton.customId)
            .setLabel(`${LocalisationManager.getString('add_moderator_ticket', lang)}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        const lang = interaction?.locale ?? 'en-US';
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        let outputContainer = await AssignModeratorComponent.create(lang);
		await interaction.reply({
			components: [outputContainer],
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
		});
    }
}

module.exports.AssignModeratorButton = AssignModeratorButton;
