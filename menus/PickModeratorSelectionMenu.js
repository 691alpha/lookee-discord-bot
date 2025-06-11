const { MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { TicketUtils } = require("../utils/TicketUtils");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const Tickets = require("../database/models/Tickets");

class PickModeratorSelectionMenu {
    static customId = "PickModeratorSelectionMenu";

    static create() {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickModeratorSelectionMenu.customId)
            .setMinValues(1)
            .setMaxValues(1);
    }

    static async onInteraction(interaction) {

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        const lang = interaction.locale;
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

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

        const selectedMembers = selectedMember.map(id => `<@${id}>`).join(', ');

        // Checks which confirmation message should be sent depending on the previous channel status
        if(!hasModerator) {
            await interaction.reply({
                content: `${LocalisationManager.getString(
                        'ticket_added_moderator', 
                        lang,
                        {"{selectedMembers}": selectedMembers}
                    )}`,
                flags: MessageFlags.Ephemeral,
            });
        } else if(member.user.id === moderator){
            await interaction.reply({
                content: `${LocalisationManager.getString(
                        'ticket_added_user_is_already_moderator', 
                        lang,
                        {"{selectedMembers}": selectedMembers}
                    )}`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: `${LocalisationManager.getString(
                        'ticket_added_new_moderator', 
                        lang,
                        {"{selectedMembers}": selectedMembers}
                    )}`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}

module.exports.PickModeratorSelectionMenu = PickModeratorSelectionMenu;
