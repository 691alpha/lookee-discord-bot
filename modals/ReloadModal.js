const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

class ReloadModal {
    static create () {

        const modal = new ModalBuilder()
			.setCustomId('ReloadModal')
			.setTitle('Test Modal');

		// Add components to modal

		// Create the text input components
		const testInput = new TextInputBuilder()
            .setMinLength(10)
            .setMaxLength(1_000)
			.setCustomId('testInput')
			.setLabel("Give me Text!")
            .setPlaceholder('Enter some text!')
            .setRequired(true)
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(testInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

        return modal;
	}

    static onSubmit(interaction) {
        interaction.reply({ content: 'Your submission was received successfully!' });
    }
}

module.exports.ReloadModal = ReloadModal;