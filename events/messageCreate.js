const { Events, ChannelType, AuditLogEvent } = require('discord.js');
const { LogUtils } = require('../utils/LogUtils');

module.exports = {
    name: Events.MessageDelete,

    async execute(message) {
        if (!message.guild) return;

        try {
            if(!message || !message.author || !message.author.username) {
                return await LogUtils.sendLog(
                    'log_message_deleted_no_data_found',
                    message.guild,
                    0xeb4034,
                    {
                        'messageChannelName': message.channel.name,
                        'messageContent': message.content
                    }
                );
            }

            await LogUtils.sendLog(
                'log_message_deleted',
                message.guild,
                0xeb4034,
                {
                    'messageChannelName': message.channel.name,
                    'messageContent': message.content,
                    'messageAuthor': message.author.username
                }
            );

        } catch (error) {
            console.error(`[channelDelete] Failed to send log message:`, error);
        }
    },
};
