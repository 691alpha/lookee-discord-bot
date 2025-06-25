const { MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");

class PickSupportSelectionMenu {
    static customId = "PickSupportSelectionMenu";

    static create() {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickSupportSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(5);
    }

    static async onInteraction(interaction) {
        const lang = interaction.locale;
        const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id, lang);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        // We assume Discord ensures the expected minimum value has been provided.
        const selected = interaction.values[0];

        if (!interaction.values || interaction.values.length === 0) {
            const container = NoVariableResponseComponent.create('selected_members_not_found', lang);

            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }
        
        const member = await interaction.guild.members.fetch(selected).catch(() => null);
        if (!member) {
            const container = NoVariableResponseComponent.create('members_not_found', lang);
            
            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        await TicketUtils.addUserToChannel(interaction.channel, member, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
            ManageChannels: true,
            AddReactions: true,
            AttachFiles: true,
            EmbedLinks: true
        });

        const container = VariableResponseComponent.create(
            'ticket_added_support_moderator', 
            lang,
            {'memberId': member.id}
        );

        await interaction.reply({
            components: [container],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    }
}

module.exports.PickSupportSelectionMenu = PickSupportSelectionMenu;
