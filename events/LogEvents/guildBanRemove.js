const { Events, AuditLogEvent } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const Setups = require('../../database/models/Setups');
const { LocalisationManager } = require('../../managers/LocalisationManager');

module.exports = {
    name: Events.GuildBanRemove,

    async execute(ban) {
        if (!ban.guild) return;

        try {

            const auditLogs = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanRemove,
                limit: 5,
            });
            if (!auditLogs) return console.log(`Couldn't access audit log.`);

            const banLog = auditLogs.entries.find(entry =>
                entry.target.id === ban.user.id
            );
            if (!banLog) return console.log(`Couldn't read audit log.`);

            const executor = banLog.executor.tag;
            if (!executor) executor = 'Unknown';

            const guild = Setups.findOne({
                where: {
                    guildId: ban.guild.id
                }
            })

            await LogUtils.sendLog(
                'log_user_ban_remove',
                ban.guild,
                0xff9933,
                {
                    'username': ban.user.tag,
                    'userId': ban.user.id,
                    'guildName': ban.guild.name,
                    'reason': ban.reason || LocalisationManager.getString(
                        'log_ban_no_reason',
                        guild.defaultLang || 'en-US'
                    ),
                    'executorName': executor || 'Unknown'
                }
            );
        } catch (error) {
            console.error(`[guildBanRemove] Failed to send log message:`, error);
        }
    },
};
