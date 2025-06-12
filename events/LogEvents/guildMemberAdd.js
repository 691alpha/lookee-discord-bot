const { Events } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {
        if (!member.guild) return;

        try {
            await LogUtils.sendLog(
                'log_member_join',
                member.guild,
                0x34eb89,
                {
                    'newMemberName': member.user.tag,
                    'newMemberId': member.user.id,
                    'guildName': member.guild.name
                }
            );
        } catch (error) {
            console.error(`[guildMemberAdd] Failed to send log message:`, error);
        }
    },
};