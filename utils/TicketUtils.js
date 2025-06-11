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
            console.log(`Setup not found for guild ${guild.id}`); // TODO: locatisalitotbtbjbkn
            return;
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

        if (!result) return // TODO: ...handle
        
        return result;
    }

    static searchTicketFail(interaction) {
        // TODO: kinda useless function too except if used plenty of times
        return interaction.reply({
            content: "No ticket found for this channel.", // TODO: localisation
            flags: MessageFlags.Ephemeral
        });
    }

    /**
     *  Replies message to user incase of failed interaction.
     * @param {*} interaction 
     * @returns
     */
    static gettingMemberFail(interaction) {
        // kinda useless fuunction as wellll
        return interaction.followUp({ 
            content: 'Could not find a user with that ID or mention.', // TODO: localisation
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
            console.log(`Setup not found for guild ${guild.id}`); // TODO: localisation
            return;
        }

        // Moves ticket to new category whilst keeping its permissions.
        
        // TODO: add comment : 
        // We assume that the key blablabla newstatus+ticketsCategoryId = proper key
        // USE AN ENUM if you can and have a lot of scenarios taht justifyu
        // such a thing
        await channel.setParent(setup[`${newStatus}TicketsCategoryId`], { lockPermissions: false });

        await channel.permissionOverwrites.edit(guild.roles.everyone, {
            ViewChannel: false
        });
    }

    /**
     * Updates the channel's description to include the names of all current channel members
     * @param {*} channel 
     * @param {*} ticket 
     */
    static async updateChannelDescription(channel, ticket) {
        const overwrites = channel.permissionOverwrites.cache;

        const mainModeratorId = ticket.moderator;
        const supportMods = [];
        let mainMod = [];
        const user = [];
    
        for (const [id, overwrite] of overwrites.entries()) {

            if (id === channel.guild.roles.everyone.id) continue;
    
            const isUser = overwrite.type === 1;
            if (!isUser) continue;
    
            const hasManageMessages = overwrite.allow.has(PermissionsBitField.Flags.ManageMessages);
    
            if (id === mainModeratorId) {
                mainMod.push(`<@${id}>`);
            } else if (hasManageMessages) {
                supportMods.push(`<@${id}>`);
            } else {
                user.push(`<@${id}>`);
            }
        }
    
        const description = [ // TODO: localsiaiton
            `**Main Moderator**: ${mainMod.length > 0 ? mainMod.join(', ') : 'None'}`,
            `**Support Moderators**: ${supportMods.length > 0 ? supportMods.join(', ') : 'None'}`,
            `**User**: ${user.length > 0 ? user.join(', ') : 'None'}`
        ].join(' • ');
    
        // TODO: rmv i suppose
        try {
            channel.setTopic(description);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports.TicketUtils = TicketUtils;
