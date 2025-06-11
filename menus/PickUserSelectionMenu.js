const { MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { TicketUtils } = require("../utils/TicketUtils");


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

        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const selectedMember = interaction.values.filter(id => interaction.guild.members.cache.has(id));

        if (!selectedMember || selectedMember.length === 0) {
            const container = NoVariableResponseComponent.create('no_valid_user_selected', lang);

            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        for (const userId of selectedMember) {

            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (!member) continue;

            await TicketUtils.addUserToChannel(interaction.channel, member, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
        }

        selectedMember = selectedMember[0];
        const selectedMembers = selectedMember.map(id => `<@${id}>`).join(', ');

        await interaction.reply({
            content: `${LocalisationManager.getString(
                        'ticket_added_user', 
                        lang,
                        {"{selectedMembers}": selectedMembers}
                    )}`,
            flags: MessageFlags.Ephemeral,
        });
    }
}

module.exports.PickUserSelectionMenu = PickUserSelectionMenu;
