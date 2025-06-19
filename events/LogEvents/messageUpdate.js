const { Events, ChannelType, AuditLogEvent } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const { VariableResponseComponent } = require('../../components/responses/VariableResponseComponent');

module.exports = {
    name: Events.MessageUpdate,

    async execute(oldMessage, newMessage) {
        if (!oldMessage.guild) return;

        try {
            if (oldMessage.content !== newMessage.content) {
                if(!(oldMessage.channel.name) || 
                    !(oldMessage.id) || 
                    !(oldMessage.content) || 
                    !(newMessage.content) ||
                    !(oldMessage.author.username )
                ) {
                    return await LogUtils.sendLog(
                        'log_message_data_not_found',
                        oldMessage.guild,
                        0xeb4034,
                        {
                            'messageChannelName': oldMessage.channel.name,
                            'messageId': oldMessage.id,
                            'newMessageContent': newMessage.content
                        }
                    );
                }

                await LogUtils.sendLog(
                    'log_message_updated_content',
                    oldMessage.guild,
                    0xeb4034,
                    {
                        'messageChannelName': oldMessage.channel.name,
                        'messageId': oldMessage.id,
                        'oldMessageContent': oldMessage.content,
                        'newMessageContent': newMessage.content,
                        'messageAuthor': newMessage.author.username
                    }
                );
            }

        } catch (error) {
            console.error(`[channelUpdate] Failed to send log message:`, error);
        }
    },
};
