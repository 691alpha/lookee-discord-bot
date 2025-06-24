const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { ReopenTicketButton } = require("../interactions/ReopenTicketButton");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class CloseTicketButton {
    static customId = "CloseTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(CloseTicketButton.customId)
            .setEmoji('1386725670796923031')
            .setLabel(LocalisationManager.getString('ticket_close', lang))
            .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        TicketUtils.moveTicketToCategory(
            interaction.guild, 
            ticket.id, 
            interaction.channel, 
            'closed'
        );

        const outputContainer = NoVariableResponseComponent.create('ticket_has_been_closed', lang)

        outputContainer.addActionRowComponents(row => row.addComponents(
            ReopenTicketButton.create(lang)
        ));

        const createdDate = ticket.createdAt;
        const dateNow = Date.now();

        const timeDifference = dateNow - createdDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        interaction.reply({ 
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.CloseTicketButton = CloseTicketButton;
