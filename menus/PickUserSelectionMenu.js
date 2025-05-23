const { ComponentType, MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { TicketUtils } = require("../utils/TicketUtils");


class PickUserSelectionMenu {
    static customId = "PickUserSelectionMenu";

    static create(lang) {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickUserSelectionMenu.customId)
            // .setLabel(`${LocalisationManager.getString('add_moderator_ticket', lang)}`)
            // .setStyle(ButtonStyle.Secondary)
            .setMinValues(1)
            .setMaxValues(5);
    }

    static async onInteraction(interaction) {

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const selected = interaction.values.filter(id => interaction.guild.members.cache.has(id));

        if (!selected.length) {
            return interaction.reply({
                content: 'No valid user selected.',
                flags: MessageFlags.Ephemeral,
            });
        }

        for (const userId of selected) {
            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            if (!member) continue;

            await TicketUtils.addUserToChannel(interaction.channel, member, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
        }

        await interaction.reply({
            content: `Added User: ${selected.map(id => `<@${id}>`).join(', ')}`,
            flags: MessageFlags.Ephemeral,
        });
    }
}

module.exports.PickUserSelectionMenu = PickUserSelectionMenu;
