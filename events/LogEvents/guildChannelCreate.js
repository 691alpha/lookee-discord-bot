const { Events, ChannelType, AuditLogEvent } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');

module.exports = {
    name: Events.ChannelCreate,

    async execute(channel) {
        if (!channel.guild || channel.type === ChannelType.DM) return;

        try {

            const auditLogs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelCreate,
                limit: 5,
            });
            if(!auditLogs) return console.log(`Couldn't access audit log.`);

            const creationEntry = auditLogs.entries.find(entry =>
                entry.target.id === channel.id
            );
            if(!creationEntry) return console.log(`Couldn't read audit log.`);

            const executor = creationEntry.executor.tag;
            if(!executor) executor = 'Unknown';

            await LogUtils.sendLog(
                'log_channel_created',
                channel.guild,
                0x00FF00,
                {
                    'channelName': channel.name,
                    'channelId': channel.id,
                    'executorName': executor
                },
                
            );

        } catch (error) {
            console.error(`[channelCreate] Failed to send log message:`, error);
        }
    },
};
