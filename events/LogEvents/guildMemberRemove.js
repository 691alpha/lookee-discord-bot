const { Events } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const Setups = require('../../database/models/Setups');

module.exports = {
    name: Events.GuildMemberRemove,

    async execute(member) {
        if (!member.guild) return;

        try {

            await LogUtils.sendLog(
                'log_member_leave',
                member.guild,
                0xff9933,
                {
                    'memberName': member.user.tag,
                    'memberId': member.user.id,
                    'guildName': member.guild.name
                }
            );
        } catch (error) {
            console.error(`[guildMemberRemove] Failed to send log message:`, error);
        }
    },
};
