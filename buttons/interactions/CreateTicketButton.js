const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
const { EmbedManager } = require("../../managers/EmbedManager");
const { HelpTicketButton } = require("../components/HelpTicketButton");
const { BugTicketButton } = require("../components/BugTicketButton");
const { SuggestionTicketButton } = require("../components/SuggestionTicketButton");

class CreateTicketButton {
    static customId = "CreateTicketButton";

    static create() {
        return new ButtonBuilder()
        .setCustomId(CreateTicketButton.customId)
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Danger);
    }

    static async onInteraction(interaction) {
        
        let outputEmbed = EmbedManager.getEmbed('ticketChannel.pickCategory');

        const row = new ActionRowBuilder()
                .addComponents(
                    HelpTicketButton.create(), 
                    BugTicketButton.create(), 
                    SuggestionTicketButton.create()
                );
        
        const response = interaction.reply({
            embeds: [outputEmbed], 
            components: [row],
            flags: MessageFlags.Ephemeral
        })

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const component = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000});

            HelpTicketButton.onComponentInteraction(component, interaction);

        } catch (e) {
            console.log(e);
        }

        return;
    }
}

module.exports.CreateTicketButton = CreateTicketButton;