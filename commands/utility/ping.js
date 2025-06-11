const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, SeparatorSpacingSize, MessageFlags } = require('discord.js');
const { AssignModeratorComponent } = require('../../components/AssignModeratorComponent');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const lang = interaction?.locale ?? 'en-US';

		let outputContainer = await AssignModeratorComponent.create(lang);
		
		await interaction.reply({
			components: [outputContainer],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};