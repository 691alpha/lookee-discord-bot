const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class ForwardToWebsiteButton {
    static customId = "ForwardToWebsiteButton";

    static create(lang) {
        return new ButtonBuilder()
            .setLabel(LocalisationManager.getString('forward_to_website_button_label', lang))
            .setStyle(ButtonStyle.Link)
            .setURL(`https://www.youtube.com/watch?v=NheWsvwoezM`)
    }

}

module.exports.ForwardToWebsiteButton = ForwardToWebsiteButton;