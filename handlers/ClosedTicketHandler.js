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

    static async getTimedoutTickets() {
        const instance = ClosedTicketHandler.getInstance();
        const { closedTickets } = instance;
        const timedoutTickets = [];
        
        if (!closedTickets && closedTickets.length == 0) return [];

        for (const closedTicket of closedTickets) {
            if (!(Date.now() - closedTicket.closedAt > (1000 * 10))) 
            // if (!(Date.now() - closedTicket.closedAt > (1000 * 3600 * 24 * 7))) 
                timedoutTickets.push(closedTicket);
        }

        return timedoutTickets;
    }

    static getTickets() {
        const instance = ClosedTicketHandler.getInstance();
        return instance.closedTickets;
    }
}