const { MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const Tickets = require("../database/models/Tickets");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { VariableResponseComponent } = require("../components/responses/VariableResponseComponent");

class PickModeratorSelectionMenu {
    static customId = "PickModeratorSelectionMenu";

    static create() {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickModeratorSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(1);
    }

    static async onInteraction(interaction) {

        const lang = interaction.locale;
        const ticket = await TicketUtils.findTicketByChannelId(interaction.channel.id, lang);
        if (!ticket) return TicketUtils.searchTicketFail(interaction, lang);

        let selectedMember = interaction.values.filter(id => interaction.guild.members.cache.has(id));

        if (!selectedMember || selectedMember.length === 0) {
            const container = NoVariableResponseComponent.create('members_not_found', lang);

            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }
        
        selectedMember = selectedMember[0];

        const currentTicket = await Tickets.findOne({ 
            where: { channelId: interaction.channel.id } 
        });
        
        if (!currentTicket) {
            const container = NoVariableResponseComponent.create(
                    'ticket_not_found', 
                    lang
                );

            interaction.reply({
                components: [container],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }

        const moderator = currentTicket.moderator;
        const hasModerator = currentTicket.moderator != null;

        const member = await interaction.guild.members.fetch(selectedMember).catch(() => null);
        if (!member) {
            const container = NoVariableResponseComponent.create('selected_members_not_found', lang);
            
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

        await TicketUtils.assignModerator(
            ticket.id,
            member.id,
            interaction.guild,
            interaction.channel
        );

        // Checks which confirmation message should be sent depending on the previous channel status
        if(!hasModerator) {
            const container = VariableResponseComponent.create(
                'ticket_added_moderator', 
                lang,
                {"selectedMember": member.id}
            );
            await interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        } else if(member.user.id === moderator){
            const container = VariableResponseComponent.create(
                'ticket_added_user_is_already_moderator', 
                lang,
                {"selectedMember": member.id}
            );
            await interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        } else {
            const container = VariableResponseComponent.create(
                'ticket_added_new_moderator', 
                lang,
                {"selectedMember": member.id}
            );
            await interaction.reply({
                components: [container],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            });
        }
    }
}

module.exports.PickModeratorSelectionMenu = PickModeratorSelectionMenu;
