const { Events, ChannelType, AuditLogEvent } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const Setups = require('../../database/models/Setups');

module.exports = {
    name: Events.ChannelDelete,

    async execute(channel) {
        if (!channel.guild || channel.type === ChannelType.DM) return;

        try {
            const auditLogs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelDelete,
                limit: 5,
            });
            if (!auditLogs) return console.log(`Couldn't access audit log.`);

            const deletionEntry = auditLogs.entries.find(entry =>
                entry.target.id === channel.id
            );

            if (!deletionEntry) return console.log(`Couldn't read audit log.`);

            const executor = deletionEntry.executor.tag;
            if (!executor) executor = 'Unknown';

            await LogUtils.sendLog(
                'log_channel_deleted',
                channel.guild,
                0xeb4034,
                {
                    'channelName': channel.name,
                    'channelId': channel.id,
                    'guildName': channel.guild.name,
                    'executorName': executor
                }
            );

        } catch (error) {
            console.error(`[channelDelete] Failed to send log message:`, error);
        }
    },
};
