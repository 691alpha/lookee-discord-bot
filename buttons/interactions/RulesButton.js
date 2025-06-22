const { ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");

class RulesButton {
    static customId = "RulesButton";

    static create(lang) {
        return new ButtonBuilder()
        .setCustomId(RulesButton.customId)
        .setEmoji('1014243420937650226')
        .setLabel(`${LocalisationManager.getString('rules_button_label', lang)}`)
        .setStyle(ButtonStyle.Primary);
    }

    static onInteraction(interaction) {

        const lang = interaction.locale;
        let componentsList = [];

        const serverRulesContainer = new ContainerBuilder();

        const serverRulesTitle = new TextDisplayBuilder().setContent(
                [
                    `${LocalisationManager.getString(`server_rules_title`, lang)}`
                ].join('\n'),
            );

        const serverRulesText = new TextDisplayBuilder().setContent(
                [
                    `${LocalisationManager.getString(`server_rules_text`, lang)}`
                ].join('\n'),
            );

        serverRulesContainer.addTextDisplayComponents([serverRulesTitle, serverRulesText]);
        componentsList.push(serverRulesContainer);

        for(let index = 1; index < 10; index++) {
            const ruleContainer = new ContainerBuilder();
    
            const ruleTitle = new TextDisplayBuilder().setContent(
                `${
                    LocalisationManager.getString(`rule_title_${index}`, lang)
                }`
            );
    
            const ruleText = new TextDisplayBuilder().setContent(
                [
                    `${LocalisationManager.getString(`rule_text_${index}`, lang)}`
                ].join('\n'),
            );

            ruleContainer.addTextDisplayComponents([ruleTitle, ruleText]);

            componentsList.push(ruleContainer);
        }

        interaction.reply({
            components: componentsList,
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });

    }
}

module.exports.RulesButton = RulesButton;