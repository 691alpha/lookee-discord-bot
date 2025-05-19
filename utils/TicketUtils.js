const Tickets = require("../database/models/Tickets");
const Setups = require("../database/models/Setups");
const { MessageFlags } = require("discord.js");

class TicketUtilities {
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
            console.log(`Setup not found for guild ${guild.id}`);
            return;
        }

        // Moves ticket to new category whilst keeping its permissions.
        await channel.setParent(setup.solvedTicketsId, { lockPermissions: false });

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
        return await Tickets.findOne({ where: { channelId } });
    }

    static searchTicketFail(interaction) {
        return interaction.reply({
            content: "No ticket found for this channel.",
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
            content: 'Could not find a user with that ID or mention.', 
            flags: MessageFlags.Ephemeral,
        });
    }
}

module.exports.TicketUtilities = TicketUtilities;
