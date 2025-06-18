const { Events } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const Setups = require('../../database/models/Setups');
const { LocalisationManager } = require('../../managers/LocalisationManager');

module.exports = {
    name: Events.GuildBanAdd,

    async execute(ban) {
        if (!ban.guild) return;

        try {

            const auditLogs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelDelete,
                limit: 5,
            });
            if (!auditLogs) return console.log(`Couldn't access audit log.`);

            const banLog = auditLogs.entries.find(entry =>
                entry.target.id === ban.user.id
            );
            if (!banLog) return console.log(`Couldn't read audit log.`);

            const executor = channelLog.executor.tag;
            if (!executor) executor = 'Unknown';

            const guild = Setups.findOne({
                where: {
                    guildId: ban.guild.id
                }
            })

            await LogUtils.sendLog(
                'log_user_ban_add',
                ban.guild,
                0xff9933,
                {
                    'userName': member.user.tag,
                    'userId': member.user.id,
                    'guildName': ban.guild.name,
                    'reason': ban.reason || LocalisationManager.getString(
                        'log_ban_no_reason',
                        guild.defaultLang || 'en-US'
                    ),
                    'executorName': member.guild.name || 'Unknown'
                }
            );
        } catch (error) {
            console.error(`[guildMemberRemove] Failed to send log message:`, error);
        }
    },
};
