const { ChannelType, MessageFlags, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const { EmbedManager } = require("../managers/EmbedManager");
const { ForwardToTicketButton } = require("../buttons/interactions/ForwardToTicketButton");

module.exports = class ChannelUtils {
    /**
     *  Creates a new Ticket Channel with an adapted name.
     * @param {*} guild 
     * @param {*} categoryId 
     * @param {*} ticketType 
     * @param {*} username 
     * @param {*} ticketId 
     */
    static async createTicketChannel(guild, categoryId, ticketType, username, ticketId, userId) {
        const parent = guild.channels.cache.get(categoryId);
        
        if(!parent || parent.type !== ChannelType.GuildCategory) {
            throw SyntaxError;
        };
        
        // Generate channel name with tickettype, username of the author
        // and the last 3 characters of the ticket's uuid.  
        const channelName = `${ticketType.toLowerCase()}-${username}-${ticketId.slice(-3)}`;
        
        const tempChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: parent.id,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: userId,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                    ],
                },
                {
                    id: guild.ownerId,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                    ],
                }
            ],
        });

        return tempChannel;
    }

    /**
     *  Sends an embed and button in ticket creation channel.
     * @param {*} interaction 
     * @param {*} tempChannel 
     */
    static sendTicketCreationSuccess(interaction, tempChannel) {
        let outputEmbed = EmbedManager.getEmbed(
            'ticketChannel.ticketCreated',
            {"{date}": Date.now()}
        );

        const row = new ActionRowBuilder()
                            .addComponents(
                                ForwardToTicketButton.create(
                                    tempChannel.id, 
                                    interaction.guild.id
                                )
                            )

        interaction.editReply({ 
            embeds: [outputEmbed], 
            flags: MessageFlags.Ephemeral,
            components: [row]
        });
    }

    /**
     *  Replys to interaction if failed.
     * @param {*} interaction 
     */
    static sendTicketCreationFailed(interaction) {
        interaction.editReply('Ticket Creation failed.')
    }

    /**
     *  Calls all functions needed for ticket channel creation.
     * @param {*} interaction 
     * @param {*} categoryId 
     * @param {*} ticketType 
     * @param {*} ticketId 
     * @returns 
     */
    static async runCreateTicketProcess(interaction, categoryId, ticketType, ticketId) {
        // Defer interaction to await for creation of the channel.
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const creationTicketResult = await ChannelUtils.createTicketChannel(
                interaction.guild,
                categoryId,
                ticketType,
                interaction.user.username,
                ticketId,
                interaction.user.id
            )
            
            ChannelUtils.sendTicketCreationSuccess(interaction, creationTicketResult);
            return creationTicketResult;
        } catch (e) {
            ChannelUtils.sendTicketCreationFailed(interaction);
            return;
        }
    }
}