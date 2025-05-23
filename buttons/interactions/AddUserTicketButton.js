const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const {PickUserComponent} = require("../../components/PickUserComponent")

class AddUserTicketButton {
    static customId = "AddUserTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(AddUserTicketButton.customId)
            .setLabel(`${LocalisationManager.getString('add_user_ticket', lang)}`)
            .setStyle(ButtonStyle.Secondary);
    }

    static async onInteraction(interaction) {

        let outputContainer = await PickUserComponent.create(interaction);
		await interaction.reply({
			components: [outputContainer],
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
		});

        // await interaction.reply({
        //     content: 'Please enter the **User ID** or mention the user to add.',
        //     flags: MessageFlags.Ephemeral,
        // });

        // const collector = interaction.channel.createMessageCollector({
        //     filter: m => m.author.id === interaction.user.id,
        //     time: 30_000,
        //     max: 1
        // });

        // collector.on('collect', async (msg) => {
        //     // Extracts username or id by checking if the message mentions an user,
        //     // if so it gets the id of the user, 
        //     // otherwise it gets the text input (without whitespaces)
        //     const userId = msg.mentions.users.first()?.id || msg.content.trim();

        //     // gets the guild member by user id
        //     const member = await interaction.guild.members.fetch(userId).catch(() => null);

        //     if (!member) return TicketUtils.gettingMemberFail(interaction);

        //     await TicketUtils.addUserToChannel(interaction.channel, member, {
        //         ViewChannel: true,
        //         SendMessages: true,
        //         ReadMessageHistory: true,
        //     });

        //     await interaction.followUp({ 
        //         content: `<@${member.id}> added to the ticket.`, 
        //         flags: MessageFlags.Ephemeral 
        //     });
        // });

        // collector.on('end', (collected) => {
        //     if (collected.size === 0) {
        //         interaction.followUp({ 
        //             content: 'No response in time.', 
        //             flags: MessageFlags.Ephemeral 
        //         });
        //     }
        // });
    }
}

module.exports.AddUserTicketButton = AddUserTicketButton;
