const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { TicketCategoryComponent } = require("../../components/TicketCategoryComponent");

class TicketCategoryButton {
    static customId = "TicketCategoryButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(TicketCategoryButton.customId)
        .setLabel(LocalisationManager.getString('ticket_category_button_label', lang))
        .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        
        let outputContainer = await TicketCategoryComponent.create(lang);

        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        await interaction.followUp({
            components: [outputContainer],
            flags: MessageFlags.IsComponentsV2,
        })

        return;
    }
}

module.exports.TicketCategoryButton = TicketCategoryButton;