const { ButtonBuilder, ButtonStyle } = require("discord.js");

class SuggestionTicketButton {
    static customId = "suggestionTicket";

    static create() {
        return new ButtonBuilder()
        .setCustomId(SuggestionTicketButton.customId)
        .setLabel('Suggestion')
        .setStyle(ButtonStyle.Secondary);
    }

    static onComponentInteraction(component) {
        if(component.customId == SuggestionTicketButton.customId) {
            
        }

        return;
    }
}

module.exports.SuggestionTicketButton = SuggestionTicketButton;