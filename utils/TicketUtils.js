const Tickets = require("../database/models/Tickets");
const Setups = require("../database/models/Setups");
const { MessageFlags, PermissionsBitField } = require("discord.js");

class TicketUtils {
    /**
     *  Adds user to the channel with specified permissions.
     * @param {*} channel 
     * @param {*} member 
     * @param {*} permissions 
     */
    static async addUserToChannel(channel, member, permissions) {
        await channel.permissionOverwrites.create(member.id, permissions);
    }

    /**
     * Assigns the user as moderator, moves the ticket to differnet category and updates database.
     * @param {string} ticketId 
     * @param {string} userId 
     */
    static async assignModerator(ticketId, userId, guild, channel) {
        await Tickets.update(
            { 
                moderator: userId,
                status: 'assigned'
            },
            { where: { id: ticketId } }
        );

        const setup = await Setups.findOne({ where: { guildId: guild.id } });

        if (!setup) {
            return console.log(`
                ${LocalisationManager.getString('setup_not_found', lang)}${guild.id}`);
        }

        // Moves ticket to new category whilst keeping its permissions.
        await channel.setParent(setup.assignedTicketsCategoryId, { lockPermissions: false });

        await channel.permissionOverwrites.edit(guild.roles.everyone, {
            ViewChannel: false
        });
    }

    /**
     * Gets ticket data by channel id.
     * @param {*} channelId 
     * @returns 
     */
    static async findTicketByChannel(channelId) {
        const result = await Tickets.findOne({ where: { channelId } });

        if (!result) return console.log(`
                ${LocalisationManager.getString('ticket_not_found', lang)}`);
        
        return result;
    }

    static searchTicketFail(interaction) {
        return interaction.reply({
            content: LocalisationManager.getString('ticket_not_found', lang),
            flags: MessageFlags.Ephemeral
        });
    }

    /**
     *  Replies message to user incase of failed interaction.
     * @param {*} interaction 
     * @returns
     */
    static gettingMemberFail(interaction) {
        return interaction.followUp({ 
            content: LocalisationManager.getString('could_not_find_user_with_id', lang),
            flags: MessageFlags.Ephemeral,
        });
    }

    /**
     * Moves the ticket to the closed category and updates the database.
     * @param {*} guild 
     * @param {*} ticketId 
     * @param {*} channel 
     * @returns 
     */
    static async moveTicketToCategory(guild, ticketId, channel, newStatus) {

        await Tickets.update(
            { status: newStatus },
            { where: { id: ticketId } }
        );
        
        const setup = await Setups.findOne({ where: { guildId: guild.id } });

        if (!setup) {
            return console.log(`
                ${LocalisationManager.getString('setup_not_found', lang)}${guild.id}`);
        }

        // Moves ticket to new category whilst keeping its permissions.
        // We assume that all keys are properly named with: status + 'TicketsCategoryId'
        await channel.setParent(
            setup[`${newStatus}TicketsCategoryId`], 
            { lockPermissions: false }
        );

        await channel.permissionOverwrites.edit(guild.roles.everyone, {
            ViewChannel: false
        });
    }
}

module.exports.TicketUtils = TicketUtils;
