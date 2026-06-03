const { ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { LocalisationManager } = require("../../managers/LocalisationManager");
const { CreateWebsiteTicketPickCategoryComponent } = require("../../components/CreateWebsiteTicketPickCategoryComponent");
const { VariableResponseComponent } = require("../../components/responses/VariableResponseComponent");
const TicketCooldownManager = require("../../managers/TicketCooldownManager");

class CreateWebsiteTicketButton {
    static customId = "CreateWebsiteTicketButton";

    static create(lang) {
        return new ButtonBuilder()
            .setCustomId(CreateWebsiteTicketButton.customId)
            .setEmoji('1387102785329299617')
            .setLabel(LocalisationManager.getString('create_ticket_button', lang))
            .setStyle(ButtonStyle.Success);
    }

    static async onInteraction(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const lang = interaction.locale;

        const cooldownSeconds = await TicketCooldownManager.getCooldownSeconds(interaction.guild.id);
        const remaining = TicketCooldownManager.getRemainingSeconds(
            interaction.guild.id,
            interaction.user.id,
            cooldownSeconds,
        );
        if (remaining > 0) {
            const container = VariableResponseComponent.create(
                'ticket_cooldown_active',
                lang,
                { seconds: remaining, discordTimestamp: Math.floor(Date.now() / 1000) + remaining },
            );
            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        const containers = await CreateWebsiteTicketPickCategoryComponent.create(
            lang,
            interaction.guild.id,
        );

        await interaction.editReply({
            components: containers,
            flags: MessageFlags.IsComponentsV2,
        });
    }
}

module.exports.CreateWebsiteTicketButton = CreateWebsiteTicketButton;
