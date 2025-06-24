const { ButtonBuilder, ButtonStyle } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class ForwardToWebsiteButton {
    static customId = "ForwardToWebsiteButton";

    static create(lang, websiteURL, websiteName) {
        return new ButtonBuilder()
            .setLabel(websiteName)
            .setStyle(ButtonStyle.Link)
            .setURL(websiteURL)
    }

}

module.exports.ForwardToWebsiteButton = ForwardToWebsiteButton;