const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, SeparatorSpacingSize, MessageFlags, PermissionsBitField } = require('discord.js');
const { AssignModeratorComponent } = require('../../components/AssignModeratorComponent');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction) {
		const lang = interaction.locale;

		let outputContainer = await AssignModeratorComponent.create(lang);
		
		await interaction.reply({
			components: [outputContainer],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};