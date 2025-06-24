const { Op } = require("sequelize");
const Tickets = require("../database/models/Tickets");
const { NoVariableResponseComponent } = require("../components/responses/NoVariableResponseComponent");
const Setups = require("../database/models/Setups");
const { MessageFlags } = require("discord.js");

module.exports = class ClosedTicketHandler {
    static _instance;
    closedTickets = [];

    async ClosedTicketHandler() {
        await ClosedTicketHandler.loadCache();
    }

    static getInstance() {
        if (!ClosedTicketHandler._instance) ClosedTicketHandler._instance = new ClosedTicketHandler();
        
        return ClosedTicketHandler._instance;
    }

    static async loadCache() {
        const instance = ClosedTicketHandler.getInstance();
        // Get an array of closed tickets for which the channel has not been deleted.
        instance.closedTickets = await Tickets.findAll({
            where: {
                status: "closed",
                channelId: {[Op.ne]: null}
            }
        });
    }

    static async getTimedoutTickets(client) {
        const instance = ClosedTicketHandler.getInstance();
        const { closedTickets } = instance;
        
        if (!closedTickets && closedTickets.length == 0) return [];

        const setup = null;
        const logChannel = null;

        for (const closedTicket of closedTickets) {
            if (!(Date.now() - closedTicket.closedAt > (1000 * 3600 * 24 * 6))) continue;
            
            const channel = await client.channels.fetch(closedTicket.channelId);
            
            if(!channel) {
                if (!setup) setup = await Setups.findOne({where: {guildId: channel.guild.id}});
                if (!logChannel) logChannel = client.channels.fetch(setup.logChannelId);

                const container = NoVariableResponseComponent.create(
                    'autodeletion_failed'
                );

                logChannel.send({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2]
                })

                continue;
            }
            channel.delete();
            closedTicket.update({channelId: null});
            
        }
    }
    
}