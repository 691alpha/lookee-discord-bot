const { ChannelType, MessageFlags, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const { EmbedManager } = require("../managers/EmbedManager");
const { ForwardToTicketButton } = require("../buttons/interactions/ForwardToTicketButton");
const { TicketCreationSuccessComponent } = require("../components/TicketCreationSuccessComponent");

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
    static async sendTicketCreationSuccess(interaction, tempChannel) {
        let outputContainer = await TicketCreationSuccessComponent.create(
            tempChannel, 
            interaction
        );

        await interaction.editReply({
            components: [outputContainer],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        })
    }

    /**
     *  Replys to interaction if failed.
     * @param {*} interaction 
     */
    static sendTicketCreationFailed(interaction, lang) {
        interaction.editReply(LocalisationManager.getString('ticket_creation_fail', lang))
    }

    /**
     *  Calls all functions needed for ticket channel creation.
     * @param {*} interaction 
     * @param {*} categoryId 
     * @param {*} ticketType 
     * @param {*} ticketId 
     * @returns 
     */
    static async runCreateTicketProcess(interaction, categoryId, ticketType, ticketId, lang) {
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
            ChannelUtils.sendTicketCreationFailed(interaction, lang);
            return;
        }
    }
}