const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, SeparatorSpacingSize, MessageFlags } = require('discord.js');
const { AssignModeratorComponent } = require('../../components/AssignModeratorComponent');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// const container = new ContainerBuilder();
		// const text1 = new TextDisplayBuilder().setContent(
		// 	[
		// 	  'Test',
		// 	  'Test Text',
		// 	].join('\n'),
		// );
		// container.addTextDisplayComponents(text1);
		// const text2 = new TextDisplayBuilder().setContent(
		// 	[
		// 	  'discord.js',
		// 	  'Components v2!',
		// 	].join('\n'),
		// );
		// const changelogButton1 = new ButtonBuilder()
		// 	.setLabel('Video')
		// 	.setStyle(ButtonStyle.Link)
		// 	.setURL('https://www.youtube.com/shorts/nfKGYDsnnH0');
		// const section2 = new SectionBuilder().addTextDisplayComponents(text2).setButtonAccessory(changelogButton1);
		// container.addSectionComponents(section2);
		// container.setAccentColor(122342);
		// await interaction.reply({
		// 	components: [container],
		// 	flags: MessageFlags.IsComponentsV2,
		// });

		let outputContainer = await AssignModeratorComponent.create(interaction);
		await interaction.reply({
			components: [outputContainer],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};