const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../../utils/TicketUtils");
const { EmbedManager } = require("../../managers/EmbedManager");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { NoVariableResponseComponent } = require("../../components/responses/NoVariableResponseComponent");

class ReopenTicketButton {
    static customId = "ReopenTicketButton";
    
        static create(lang) {
            return new ButtonBuilder()
                .setCustomId(ReopenTicketButton.customId)
                .setEmoji('1386724332889313300')
                .setLabel(LocalisationManager.getString('reopen_ticket_label_button', lang))
                .setStyle(ButtonStyle.Primary);
        }
    
        static async onInteraction(interaction) {
            const { CloseTicketButton } = require("./CloseTicketButton");
            const lang = interaction.locale;

            const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id, lang);

            if(ticket.status != 'closed') {
                const outputContainer = NoVariableResponseComponent.create(
                    'ticket_already_reopened', 
                    lang
                );

                outputContainer.addActionRowComponents(row => row.addComponents(
                    CloseTicketButton.create(lang)
                ));

                return interaction.reply({ 
                    components: [outputContainer],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
                });
            }

            if(ticket.moderator) {
                TicketUtils.moveTicketToCategory(
                    interaction.guild, 
                    ticket.id,
                    interaction.channel, 
                    'assigned', 
                );
            } else {
                TicketUtils.moveTicketToCategory(
                    interaction.guild, 
                    ticket.id, 
                    interaction.channel, 
                    'unassigned', 
                );
            }

            const outputContainer = NoVariableResponseComponent.create(
                'ticket_has_been_reopened', 
                lang
            );

            outputContainer.addActionRowComponents(row => row.addComponents(
                CloseTicketButton.create(lang)
            ));

            interaction.reply({ 
                components: [outputContainer],
                flags: [MessageFlags.IsComponentsV2]
            });
        }
}

module.exports.ReopenTicketButton = ReopenTicketButton;