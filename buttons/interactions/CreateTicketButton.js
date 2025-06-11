const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { PickCategoryComponent } = require("../../components/PickCategoryComponent");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class CreateTicketButton {
    static customId = "CreateTicketButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(CreateTicketButton.customId)
        .setLabel(LocalisationManager.getString('create_ticket_button', lang))
        .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        
        let outputContainer = await PickCategoryComponent.create(lang);

        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        await interaction.followUp({
            components: [outputContainer],
            flags: MessageFlags.IsComponentsV2,
        })

        return;
    }
}

module.exports.CreateTicketButton = CreateTicketButton;