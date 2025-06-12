const { Events } = require('discord.js');
const { LogUtils } = require('../../utils/LogUtils');
const Setups = require('../../database/models/Setups');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const setup = await Setups.findOne({ where: { guildId: oldState.guild.id } });
        const lang = setup?.defaultLang || 'en-US';

        if (!oldState.channel && newState.channel) {
            await LogUtils.sendLog('member_voice_join', lang, 0x34eb89, {
                guildName: newState.guild.name,
                memberName: newState.member.user.tag,
                memberId: newState.member.id,
                voiceChannel: newState.channel.name
            });
        }

        else if (oldState.channel && !newState.channel) {
            await LogUtils.sendLog('member_voice_leave', lang, 0xff9933, {
                guildName: oldState.guild.name,
                memberName: oldState.member.user.tag,
                memberId: oldState.member.id,
                voiceChannel: oldState.channel.name
            });
        }
    },
};
