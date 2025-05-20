const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { ReleaseComponent } = require('../../components/ReleaseComponent.js');

module.exports = {
	category: 'utility',
	cooldown: 0,
	data: new SlashCommandBuilder()
		.setName('release')
		.setDescription('Replies with the Discord.js 14.19.0 release component.'),

	async execute(interaction) {
		const container = await ReleaseComponent.create();

		await interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};
