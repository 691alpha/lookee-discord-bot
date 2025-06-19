const { Events, ChannelType, AuditLogEvent } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');

module.exports = {
    name: Events.ChannelUpdate,

    async execute(oldChannel, newChannel) {
        if (!oldChannel.guild || oldChannel.type === ChannelType.DM) return;

        try {
            const auditLogs = await oldChannel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelUpdate,
                limit: 5,
            });
            if (!auditLogs) return console.log(`Couldn't access audit log.`);

            const channelLog = auditLogs.entries.find(entry =>
                entry.target.id === oldChannel.id
            );
            if (!channelLog) return console.log(`Couldn't read audit log.`);

            const executor = channelLog.executor.tag;
            if (!executor) executor = 'Unknown';

            if (oldChannel.name !== newChannel.name) {
                await LogUtils.sendLog(
                    'log_channel_renamed',
                    oldChannel.guild,
                    0xeb4034,
                    {
                        'oldChannelName': oldChannel.name,
                        'oldChannelId': oldChannel.id,
                        'newChannelName': newChannel.name,
                        'executorName': executor
                    }
                );
            }

            if (oldChannel.topic !== newChannel.topic) {
                await LogUtils.sendLog(
                    'log_channel_topic_changed',
                    oldChannel.guild,
                    0xeb4034,
                    {
                        'oldChannelName': oldChannel.name,
                        'oldChannelId': oldChannel.id,
                        'oldChannelTopic': oldChannel.topic,
                        'newChannelTopic': newChannel.topic,
                        'executorName': executor
                    }
                );
            }

            if (oldChannel.parent !== newChannel.parent) {
                await LogUtils.sendLog(
                    'log_channel_moved',
                    oldChannel.guild,
                    0xeb4034,
                    {
                        'oldChannelName': oldChannel.name,
                        'oldChannelId': oldChannel.id,
                        'oldChannelParent': oldChannel.parent,
                        'newChannelParent': newChannel.parent,
                        'executorName': executor
                    }
                );
            }

        } catch (error) {
            console.error(`[channelUpdate] Failed to send log message:`, error);
        }
    },
};
