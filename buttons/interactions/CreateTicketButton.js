const { ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ComponentType } = require("discord.js");
const { EmbedManager } = require("../../managers/EmbedManager");
const { HelpTicketButton } = require("./HelpTicketButton");
const { BugTicketButton } = require("../components/BugTicketButton");
const { SuggestionTicketButton } = require("../components/SuggestionTicketButton");
const Tickets = require("../../database/models/Tickets");

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

        await interaction.deferReply();

        const row = new ActionRowBuilder()
                .addComponents(
                    HelpTicketButton.create(), 
                    BugTicketButton.create(), 
                    SuggestionTicketButton.create()
                );
        
        await interaction.followUp({
            embeds: [outputEmbed], 
            components: [row],
            flags: MessageFlags.Ephemeral
        })

        // const collectorFilter = i => i.user.id === interaction.user.id;

        // try {
        //     const component = await response.awaitMessageComponent({
        //         filter: collectorFilter,
        //         time: 60_000,
        //         componentType: ComponentType.Button
        //     });

        //     HelpTicketButton.onComponentInteraction(component, interaction);

        // } catch (e) {
        //     console.log(e);
        // }

        return;
    }
}

module.exports.CreateTicketButton = CreateTicketButton;