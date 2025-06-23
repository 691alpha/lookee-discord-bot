const { MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { TicketUtils } = require("../utils/TicketUtils");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent"); // Make sure this is imported if used
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent"); // Make sure this is imported if used

class PickUserSelectionMenu {
    static customId = "PickUserSelectionMenu";

    static create() {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickUserSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(5);
    }

    static async onInteraction(interaction) {
        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        const lang = interaction.locale;

        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        let selectedMemberIds = interaction.values.filter(id => interaction.guild.members.cache.has(id)); // Renamed for clarity

        if (!selectedMemberIds || selectedMemberIds.length === 0) {
            const container = NoVariableResponseComponent.create('no_valid_user_selected', lang);

            return interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
        }

        // Before iterating, create the string for the reply
        const selectedMembersMentions = selectedMemberIds.map(id => `<@${id}>`).join(', ');

        for (const userId of selectedMemberIds) { // Iterate over the array of IDs
            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (!member) continue;

            await TicketUtils.addUserToChannel(interaction.channel, member, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
        }

        const container = VariableResponseComponent.create(
            'ticket_added_user',
            lang,
            {"selectedMembers": selectedMembersMentions}
        )

        await interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        });
    }
}

module.exports.PickUserSelectionMenu = PickUserSelectionMenu;