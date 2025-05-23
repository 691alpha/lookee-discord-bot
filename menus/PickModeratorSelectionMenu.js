const { ComponentType, MessageFlags, MentionableSelectMenuBuilder } = require("discord.js");
const { LocalisationManager } = require("../managers/LocalisationManager");
const { TicketUtils } = require("../utils/TicketUtils");
const Tickets = require("../database/models/Tickets");

class PickModeratorSelectionMenu {
    static customId = "PickModeratorSelectionMenu";

    static create(lang) {
        return new MentionableSelectMenuBuilder()
            .setCustomId(PickModeratorSelectionMenu.customId)
            // .setLabel(`${LocalisationManager.getString('add_moderator_ticket', lang)}`)
            // .setStyle(ButtonStyle.Secondary)
            .setMinValues(1)
            .setMaxValues(1);
    }

    static async onInteraction(interaction) {
        // await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const ticket = await TicketUtils.findTicketByChannel(interaction.channel.id);
        if (!ticket) return TicketUtils.searchTicketFail(interaction);

        let hasModerator = false;

        const selected = interaction.values.filter(id => interaction.guild.members.cache.has(id));

        if (!selected.length) {
            return interaction.reply({
                content: 'No valid user selected.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const currentTicket = await Tickets.findOne({ where: { channelId: interaction.channel.id } });
        const moderator = currentTicket.moderator;
        if(moderator) hasModerator = true;

        const member = await interaction.guild.members.fetch(selected[0]).catch(() => null);
        if (!member) return;

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

        if(!hasModerator) {
            await interaction.reply({
                content: `Added Moderator: ${selected.map(id => `<@${id}>`).join(', ')}.`,
                flags: MessageFlags.Ephemeral,
            });
        } else if(member.user.id === moderator){
            await interaction.reply({
                content: `User ${selected.map(id => `<@${id}>`).join(', ')} is already the Moderator.`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: `User ${selected.map(id => `<@${id}>`).join(', ')} is now the Moderator.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}

module.exports.PickModeratorSelectionMenu = PickModeratorSelectionMenu;
