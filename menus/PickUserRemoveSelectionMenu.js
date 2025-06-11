const { MentionableSelectMenuBuilder, MessageFlags } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");
const UserNotFoundComponent = require('../components/responses/UserNotFoundComponent');

class PickUserRemoveSelectionMenu {
    static customId = "PickUserRemoveSelectionMenu";

    static create() {

        return new MentionableSelectMenuBuilder()
            .setCustomId(PickUserRemoveSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(LocalisationManager.getString(
                'select_user_to_remove', 
                lang
            ))
    }

    static async onInteraction(interaction) {
        const userId = interaction.values[0];

        if (!userId || userId.length === 0) {
            const container = UserNotFoundComponent.create(lang, userId);
            
            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);

        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        const member = await interaction.guild.members.fetch(userId).catch(() => null);

        if (!member) {
            const container = NoVariableResponseComponent.create('members_not_found', lang);
            
            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        await interaction.channel.permissionOverwrites.delete(userId);

        await interaction.reply({
            content: LocalisationManager.getString(
                'user_removed_from_ticket', 
                lang,
                {"userId": userId}
            ),
            flags: MessageFlags.Ephemeral,
        });
    }
}

module.exports.PickUserRemoveSelectionMenu = PickUserRemoveSelectionMenu;
