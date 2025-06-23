const { Events, PermissionsBitField } = require('discord.js');
const Tickets = require('../database/models/Tickets');
const { NoVariableResponseComponent } = require('../components/responses/NoVariableResponseComponent');
const fs = require('fs').promises;
const path = require('path'); 
const { LocalisationManager } = require('../managers/LocalisationManager');

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        if (!message.guild) return;

        const { author } = message;
        const { member } = message;
        let msgContent = message.content;
        const ticket = await Tickets.findOne({where: {channelId: message.channel.id}});
        if(!ticket) return;

        const isAuthorTicketModerator = (ticket.moderator && ticket.moderator === author.id);
        const isAuthorTicketCreator = (ticket.userId && ticket.userId === author.id);

        let authorRole = "User";

        if (isAuthorTicketCreator) authorRole = "Author"
        else if (isAuthorTicketModerator) authorRole = "Moderator"
        else if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) 
            authorRole = "Support"

        if(message.components.length > 0 ) {
            const firstComponent = message.components[0];
            msgContent = "";
            if(firstComponent.components.length > 0 && 
                firstComponent.components[0].content
            ) msgContent = firstComponent.components[0].content
            
            authorRole = "System";
        }

        const { createdAt } = message;
        const msgDateFormat = `[${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()}] (${author.id}) (${authorRole}) ${author.username} > ${msgContent}\n`

        const logsFilePath = path.join(__dirname, `../files/tickets/${ticket.id}.txt`);
        fs.appendFile(logsFilePath, msgDateFormat);

    },
};
