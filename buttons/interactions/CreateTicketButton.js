const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { CreateTicketPickCategoryComponent } = require("../../components/CreateTicketPickCategoryComponent");

class CreateTicketButton {
    static customId = "CreateTicketButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(CreateTicketButton.customId)
        .setEmoji('1387102785329299617')
        .setLabel(LocalisationManager.getString('create_ticket_button', lang))
        .setStyle(ButtonStyle.Success);
    }

    static async onInteraction(interaction) {

        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        const lang = interaction.locale;

        const container = await CreateTicketPickCategoryComponent.create(
            lang, 
            interaction.client.db,
            interaction.guild.id
        );


        await interaction.editReply({
            components: container,
            flags: MessageFlags.IsComponentsV2,
        })

        return;
    }
}

module.exports.CreateTicketButton = CreateTicketButton;