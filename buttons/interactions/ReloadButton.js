const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

class ReloadButton {
    static create() {
        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Kick')
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

        return row;
    }

    static async onInteraction(interaction) {
        const customId = interaction.customId;

        if (customId === 'cancel') {
            return interaction.reply('Action cancelled.');
        }

    }
}

module.exports.ReloadButton = ReloadButton;