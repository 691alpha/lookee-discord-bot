const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const {PickUserComponent} = require("../../components/PickUserComponent")

class AddUserTicketButton {
    static customId = "AddUserTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AddUserTicketButton.customId)
            .setEmoji('1387098742372565083')
            .setLabel(`${LocalisationManager.getString('add_user_ticket', lang)}`)
            .setStyle(ButtonStyle.Success);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;

        let outputContainer = await PickUserComponent.create(lang);
		await interaction.reply({
			components: [outputContainer],
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
		});
    }
}

module.exports.AddUserTicketButton = AddUserTicketButton;
