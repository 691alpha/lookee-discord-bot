const { Events } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const Setups = require('../../database/models/Setups');

module.exports = {
    name: Events.ChannelUpdate,

    async execute(oldChannel, newChannel) {
        if (!oldChannel.guild || oldChannel.type === ChannelType.DM) return;

        try {

           const auditLogs = await oldChannel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelUpdate,
                limit: 5,
            });
            if(!auditLogs) return console.log(`Couldn't access audit log.`);

            const updatedEntry = auditLogs.entries.find(entry =>
                entry.target.id === oldChannel.id
            );
            if (!updatedEntry) return console.log(`Couldn't read audit log.`);

            const executor = updatedEntry.executor.tag;
            if(!executor) executor = 'Unknown';

            await LogUtils.sendLog(
                'log_channel_updated',
                oldChannel.guild,
                0xeb4034,
                {
                    channelName: channel.name,
                    guildName: channel.guild.name,
                    executorName: executor
                }
            );
           
        } catch (error) {
            console.error(`[guildMemberRemove] Failed to send log message:`, error);
        }
    },
};
